import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: any = null;  // Stocker les infos de l'utilisateur connecté
  displayName: string = '';  // Stocker le pseudo ou l'email à afficher
  message = '';
  privateMessage = ''; // Message privé
  messages: any[] = [];
  privateMessages: any[] = [];  // Stocker les messages privés
  onlineUsers: any[] = [];  // Stocker les utilisateurs en ligne
  selectedUser: any = null;  // Utilisateur sélectionné pour la messagerie privée
  offlineUsers: any[] = [];  // Stocker les utilisateurs hors ligne

  // Propriétés pour la gestion des groupes
  groups: any[] = [];
  selectedGroup: any = null;
  groupMessages: any[] = [];
  groupMessage: string = '';
  groupName: string = '';
  userToAdd: string = '';  // Pour ajouter un utilisateur au groupe
  newMemberName: string = '';  // Saisie du nom du membre à ajouter



  constructor(
    private afAuth: AngularFireAuth,
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupérer l'utilisateur actuel et afficher le pseudo ou email
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        this.displayName = user.displayName ? user.displayName : user.email || 'Anonymous';
        console.log("User : ", this.displayName);
        this.loadUsers();  // Charger les utilisateurs hors ligne
        this.loadUserGroups(user.uid);
        // Mettre à jour l'état en ligne de l'utilisateur
        this.chatService.setUserOnline(user.uid);

        // Récupérer les messages de chat général
        this.chatService.getMessages('general').subscribe(messages => {
          this.messages = messages;
          console.log(this.messages);
        });
      } else {
        // Si l'utilisateur se déconnecte, on le met hors ligne
        this.chatService.setUserOffline(this.user?.uid);
      }
    });
  }

  loadUserGroups(userId: string) {
    this.chatService.getUserGroups(userId).subscribe(groups => {
      this.groups = groups;
    });
  }

  selectGroup(group: any) {
    this.selectedGroup = group;
  
    // Charger les messages du groupe sélectionné
    this.loadGroupMessages(group.key);
  
    // Charger les membres du groupe (qui sont maintenant des IDs)
    this.selectedGroup.members = group.members;
  }
  

  loadGroupMessages(groupId: string) {
    this.chatService.getGroupMessages(groupId).subscribe(messages => {
      this.groupMessages = messages;
    });
  }

  sendGroupMessage() {
    if (this.groupMessage.trim() !== '' && this.selectedGroup) {
      this.chatService.sendGroupMessage(this.groupMessage, this.user.uid, this.selectedGroup.key);
      this.groupMessage = '';
    }
  }

  createGroup() {
    if (this.groupName.trim() !== '') {
      this.chatService.createGroup(this.groupName, this.user.uid).then(() =>{
        this.groupName = '';  // Réinitialiser le champ de nom de groupe
      }).catch(error => {
        console.error('Erreur lors de la création du groupe : ', error);
      });
    }
  }

  deleteGroup(groupId: string) {
    this.chatService.deleteGroup(groupId).then(() => {
      console.log('Groupe supprimé avec succès');
    }).catch(error => {
      console.error('Erreur lors de la suppression du groupe : ', error);
    });
  }

  loadUsers() {
    this.chatService.getOnlineUsers(this.user.uid).subscribe(users => {
      this.onlineUsers = users;
    });
  
    this.chatService.getOfflineUsers().subscribe(users => {
      this.offlineUsers = users;
    });
  }
  

  sendMessage() {
    if (this.message.trim() !== '') {
      this.chatService.sendMessage(this.message, this.user.uid, this.displayName, 'general');
      this.message = '';
    }
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.chatService.getPrivateMessages(this.user.uid, user.uid).subscribe(messages => {
      this.privateMessages = messages;
    });
  }

  sendPrivateMessage() {
    if (this.privateMessage.trim() !== '' && this.selectedUser) {
      this.chatService.sendPrivateMessage(this.privateMessage, this.user.uid, this.selectedUser.uid);
      this.privateMessage = '';
    }
  }

  // Ajouter un membre au groupe sélectionné
addMember() {
  if (this.selectedGroup && this.userToAdd.trim() !== '') {
    this.chatService.addMemberToGroup(this.selectedGroup.key, this.userToAdd).then(() => {
      this.userToAdd = '';  // Réinitialiser le champ d'ajout
    }).catch(error => {
      console.error('Erreur lors de l\'ajout du membre : ', error);
    });
  }
}

signOut() {
  this.authService.signOut().then(() => {
    console.log('User signed out');
    this.router.navigate(['/auth/login']); // Rediriger vers la page de login après la déconnexion
  }).catch((error: any) => {
    console.error('Sign out error', error);
  });
}

removeMemberByName(displayName: string) {
  // Rechercher l'utilisateur par son displayName
  this.chatService.getUserByName(displayName).subscribe(user => {
    if (user) {
      this.chatService.removeMemberFromGroup(this.selectedGroup.key, user.uid).then(() => {
        console.log(`${displayName} supprimé du groupe ${this.selectedGroup.name}`);
      }).catch(error => {
        console.error('Erreur lors de la suppression du membre : ', error);
      });
    } else {
      console.error('Utilisateur non trouvé');
    }
  });
}


addMemberByName() {
  if (this.newMemberName.trim() !== '') {
    this.chatService.getUserByName(this.newMemberName).subscribe(user => {
      if (user) {
        // Ajouter l'utilisateur au groupe sélectionné
        this.chatService.addMemberToGroup(this.selectedGroup.key, user.uid).then(() => {
          console.log(`${user.displayName} ajouté au groupe ${this.selectedGroup.name}`);
          this.newMemberName = '';  // Réinitialiser le champ de saisie
        }).catch(error => {
          console.error('Erreur lors de l\'ajout du membre : ', error);
        });
      } else {
        console.error('Utilisateur non trouvé');
      }
    });
  }
}


}

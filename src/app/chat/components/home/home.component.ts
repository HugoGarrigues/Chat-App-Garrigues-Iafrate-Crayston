import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: any = null;  // Stocker les infos de l'utilisateur connecté
  displayName: string = '';  // Stocker le pseudo ou l'email à afficher
  message = '';
  privateMessage = '';
  messages: any[] = [];
  privateMessages: any[] = [];  // Stocker les messages privés
  onlineUsers: any[] = [];  // Stocker les utilisateurs en ligne
  selectedUser: any = null;  // Utilisateur sélectionné pour la messagerie privée

  constructor(
    private afAuth: AngularFireAuth,
    private chatService: ChatService
  ) {}

ngOnInit() {
  // Récupérer l'utilisateur actuel et afficher le pseudo ou email
  this.afAuth.authState.subscribe(user => {
    if (user) {
      this.user = user;
      this.displayName = user.displayName ? user.displayName : user.email || 'Anonymous';  // Afficher pseudo ou email ou "Anonymous"
      console.log("User : ", this.displayName);
      this.loadOnlineUsers();  // Charger les utilisateurs en ligne
      
      // Mettre à jour l'état en ligne de l'utilisateur
      this.chatService.setUserOnline(user.uid);  // Ajouter cette ligne
    } else {
      // Si l'utilisateur se déconnecte, on le met hors ligne
      this.chatService.setUserOffline(this.user?.uid); // Ajouter cette ligne pour gérer l'utilisateur hors ligne
    }

        // Récupérer les messages de chat général
        this.chatService.getMessages('general').subscribe(messages => {
          this.messages = messages;
          console.log(this.messages);
        });
  });
}


  loadOnlineUsers() {
    // Récupérer les utilisateurs en ligne depuis Firebase (adapter selon ta base de données)
    this.chatService.getOnlineUsers().subscribe(users => {
      this.onlineUsers = users.filter(u => u.uid !== this.user.uid);  // Ne pas inclure l'utilisateur connecté
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;  // Définir l'utilisateur sélectionné pour la messagerie privée
    this.loadPrivateMessages(user.uid);  // Charger les messages privés échangés avec l'utilisateur sélectionné
  }

  loadPrivateMessages(userId: string) {
    // Récupérer les messages privés avec l'utilisateur sélectionné (à adapter selon ta structure de données)
    this.chatService.getPrivateMessages(this.user.uid, userId).subscribe(messages => {
      this.privateMessages = messages;
    });
  }

  sendMessage() {
    if (this.message.trim() !== '') {
      this.chatService.sendMessage(this.message, this.user.uid, this.displayName, 'general');  // Envoyer le message général
      this.message = '';  // Réinitialiser le champ de message après l'envoi
    }
  }

  sendPrivateMessage() {
    if (this.privateMessage.trim() !== '' && this.selectedUser) {
      this.chatService.sendPrivateMessage(this.privateMessage, this.user.uid, this.selectedUser.uid);  // Envoyer le message privé
      this.privateMessage = '';  // Réinitialiser le champ de message privé après l'envoi
    }
  }
}

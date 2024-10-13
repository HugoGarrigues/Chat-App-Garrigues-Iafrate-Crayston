import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: any = null;  // Stocker les infos de l'utilisateur connecté
  displayName: string = '';  // Stocker le pseudo ou l'email à afficher
  message = '';
  messages: any[] = [];

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
      }
    });

    // Récupérer les messages de chat
    this.chatService.getMessages().subscribe(messages => {
      this.messages = messages;
      console.log(this.messages);
    });
  }

  sendMessage() {
    if (this.message.trim() !== '') {
      this.chatService.sendMessage(this.message, this.user?.uid, this.displayName);  // Envoyer le message, l'UID et le pseudo
      this.message = '';  // Réinitialiser le champ de message après l'envoi
    }
  }
}

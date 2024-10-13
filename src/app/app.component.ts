import { Component, OnInit } from '@angular/core';
import { AuthService } from '../app/auth/services/auth.service';
import { ChatService } from '../../src/app/chat/services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user: any = null;  // Stocke l'utilisateur connecté
  messages: any[] = []; // Stocke les messages du chat général
  message: string = ''; // Nouveau message à envoyer

  constructor(private authService: AuthService, private chatService: ChatService) {}

  ngOnInit() {
    // Récupérer l'état de l'utilisateur (connecté ou non)
    this.authService.getUser().subscribe(user => {
      this.user = user; // Stocker l'utilisateur connecté
    });

    // Récupérer les messages du chat général depuis Firebase
    this.chatService.getMessages('general').subscribe((messages: any) => {
      this.messages = messages; // Stocker les messages
    });
  }

  sendMessage() {
    if (this.message.trim() && this.user) {
      // Envoyer le message dans le chat général
      this.chatService.sendMessage(this.message, this.user?.uid, this.user.displayName, 'general'); 
      this.message = ''; // Réinitialiser l'input du message
    }
  }
}

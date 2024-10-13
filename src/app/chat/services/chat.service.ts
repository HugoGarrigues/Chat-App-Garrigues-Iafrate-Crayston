import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {}

  sendMessage(message: string, userId: string, displayName: string) {
    const timestamp = new Date().getTime();
    const chatMessage = {
      message: message,
      userId: userId,
      displayName: displayName,
      timestamp: timestamp
    };

    // Envoi le message à la base de données
    return this.db.list('messages').push(chatMessage);
  }

  getMessages() {
    return this.db.list('messages', ref => ref.orderByChild('timestamp')).valueChanges();
  }
}

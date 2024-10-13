import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private db: AngularFireDatabase) {}

  // Récupérer les messages d'un chat général ou d'une conversation privée
  getMessages(chatId: string, isPrivate: boolean = false) {
    const path = isPrivate ? `/private/${chatId}` : `/messages/${chatId}`;
    return this.db.list(path).valueChanges();
  }

  // Envoyer un message dans un chat général ou dans une conversation privée
  sendMessage(text: string, uid: string, displayName: string, chatId: string, isPrivate: boolean = false) {
    const path = isPrivate ? `/private/${chatId}` : `/messages/${chatId}`;
    this.db.list(path).push({
      text: text,
      senderId: uid,
      displayName: displayName,  // Ajouter le pseudo
      createdAt: new Date().toISOString()
    });
  }

  // Créer une nouvelle conversation privée entre deux utilisateurs
  createPrivateConversation(userId1: string, userId2: string) {
    // Créer un identifiant de conversation unique basé sur les deux userIds
    const conversationId = userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
    return conversationId;  // Utiliser cet ID pour la conversation privée
  }

  // Récupérer les conversations de l'utilisateur actuel
  getUserConversations(userId: string) {
    return this.db.list(`/private`, ref => ref.orderByChild('members').equalTo(userId)).valueChanges();
  }
}

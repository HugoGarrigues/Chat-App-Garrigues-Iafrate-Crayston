import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private db: AngularFireDatabase) {}

  // Récupérer les messages d'un chat spécifique
  getMessages(chatId: string): Observable<any[]> {
    return this.db.list(`/messages/${chatId}`).valueChanges();
  }

  // Envoyer un message avec le pseudo inclus
  sendMessage(text: string, uid: string, displayName: string, chatId: string) {
    this.db.list(`/messages/${chatId}`).push({
      text: text,
      senderId: uid,
      displayName: displayName,
      createdAt: new Date().toISOString()
    });
  }

// Récupérer les utilisateurs en ligne
getOnlineUsers(): Observable<any[]> {
  return this.db.list('/users', ref => ref.orderByChild('isOnline').equalTo(true)).snapshotChanges().pipe(
    map(actions => 
      actions.map(a => ({
        uid: a.key,  // Ajoute ici l'uid de l'utilisateur
        ...a.payload.val() as any  // Récupère les autres propriétés
      }))
    )
  );
}

  sendPrivateMessage(text: string, senderId: string, receiverId: string) {
    const privateChatId = this.getPrivateChatId(senderId, receiverId);
    console.log(`Private chat ID: ${privateChatId}, sender ID: ${senderId}, receiver ID: ${receiverId}`);
    
    return this.db.list(`/messages/private/${privateChatId}`).push({
        text: text,
        senderId: senderId,
        receiverId: receiverId,
        createdAt: new Date().toISOString()
    });
}


  // Récupérer les messages privés entre deux utilisateurs
  getPrivateMessages(userId1: string, userId2: string): Observable<any[]> {
    const privateChatId = this.getPrivateChatId(userId1, userId2);
    return this.db.list(`/messages/private/${privateChatId}`).valueChanges();
  }

  private getPrivateChatId(userId1: string, userId2: string): string {
    // Crée une clé unique pour les messages privés
    return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
}


  setUserOnline(userId: string) {
    return this.db.object(`/users/${userId}`).update({ 
      isOnline: true, 
      lastSeen: null // On peut enlever la dernière connexion s'il est en ligne 
    });
  }

  setUserOffline(userId: string) {
    return this.db.object(`/users/${userId}`).update({ 
      isOnline: false, 
      lastSeen: new Date().toISOString() // Mettre à jour la dernière connexion
    });
  }
}

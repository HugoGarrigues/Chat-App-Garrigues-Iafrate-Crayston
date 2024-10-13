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

  // Récupérer les utilisateurs en ligne, exclure l'utilisateur connecté
  getOnlineUsers(currentUserId: string): Observable<any[]> {
    return this.db.list('/users', ref => ref.orderByChild('isOnline').equalTo(true)).snapshotChanges().pipe(
      map(actions => 
        actions.map(a => ({
          uid: a.key,
          ...a.payload.val() as any
        })).filter(user => user.uid !== currentUserId) // Exclure l'utilisateur connecté
      )
    );
  }

  // Récupérer les utilisateurs hors ligne
  getOfflineUsers(): Observable<any[]> {
    return this.db.list('/users', ref => ref.orderByChild('isOnline').equalTo(false)).snapshotChanges().pipe(
      map(actions => 
        actions.map(a => ({
          uid: a.key,
          ...a.payload.val() as any
        }))
      )
    );
  }

  sendPrivateMessage(text: string, senderId: string, receiverId: string) {
    const privateChatId = this.getPrivateChatId(senderId, receiverId);
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
    return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  }

  setUserOnline(userId: string) {
    return this.db.object(`/users/${userId}`).update({ 
      isOnline: true, 
      lastSeen: null 
    });
  }

  setUserOffline(userId: string) {
    return this.db.object(`/users/${userId}`).update({ 
      isOnline: false, 
      lastSeen: new Date().toISOString() 
    });
  }

  // Récupérer les groupes d'un utilisateur
  getUserGroups(userId: string): Observable<any[]> {
    return this.db.list('/groups', ref => ref.orderByChild(`members/${userId}`).equalTo(true)).snapshotChanges().pipe(
      map(actions => 
        actions.map(a => {
          const group = a.payload.val() as any;
          group.key = a.key;
          group.members = group.members ? Object.keys(group.members) : [];  // Transforme les membres en tableau d'IDs
          return group;
        })
      )
    );
  }
  
  // Récupérer les messages d'un groupe
  getGroupMessages(groupId: string): Observable<any[]> {
    return this.db.list(`/groups/${groupId}/messages`).valueChanges();
  }

  // Envoyer un message à un groupe
  sendGroupMessage(text: string, senderId: string, groupId: string) {
    const groupMessagesRef = this.db.list(`/groups/${groupId}/messages`);
    return groupMessagesRef.push({
      text: text,
      senderId: senderId,
      createdAt: new Date().toISOString()
    });
  }

  // Créer un groupe
  createGroup(name: string, userId: string): Promise<string> {
    const groupRef = this.db.list('/groups');
    const newGroupKey = groupRef.push({ name: name, members: { [userId]: true } }).key;

    if (newGroupKey) {
      return Promise.resolve(newGroupKey);
    } else {
      return Promise.reject('Erreur lors de la création du groupe : ID de groupe introuvable.');
    }
  }

  // Supprimer un groupe
  deleteGroup(groupId: string) {
    return this.db.object(`/groups/${groupId}`).remove();
  }

  // Ajouter un membre à un groupe
  addMemberToGroup(groupId: string, memberId: string) {
    return this.db.object(`/groups/${groupId}/members/${memberId}`).set(true);
  }

  // Supprimer un membre d'un groupe
  removeMemberFromGroup(groupId: string, memberId: string) {
    return this.db.object(`/groups/${groupId}/members/${memberId}`).remove();
  }

}

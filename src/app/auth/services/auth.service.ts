import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';  // Importer AngularFireDatabase

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {}

  // Sign in with email and password
  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Sign up with email, password, and pseudo
  signUp(email: string, password: string, pseudo: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;

        // Après la création de l'utilisateur, mettre à jour le profil avec le pseudo
        return user?.updateProfile({
          displayName: pseudo
        }).then(() => {
          // Enregistrer l'utilisateur dans la base de données
          return this.db.object(`/users/${user.uid}`).set({
            displayName: pseudo,
            email: user.email,
            isOnline: false, // Par défaut, l'utilisateur est hors ligne
            lastSeen: new Date().toISOString() // Ajouter une date de dernière connexion
          }).then(() => {
            return userCredential; // Retourner les informations de l'utilisateur
          });
        });
      });
  }

  // Sign out
  signOut() {
    return this.afAuth.signOut();
  }

  // Get current user (returns an observable)
  getUser() {
    return this.afAuth.authState; // Returns an observable that can be subscribed to
  }
}

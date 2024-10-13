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
    if (!email || !password || !pseudo) {
      console.error('Email, password, and pseudo must be provided');
      return Promise.reject('Invalid input');
    }
  
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
  
        if (user) {
          return user.updateProfile({
            displayName: pseudo
          }).then(() => {
            return this.db.object(`/users/${user.uid}`).set({
              displayName: pseudo,
              email: user.email,
              isOnline: false,
              lastSeen: new Date().toISOString()
            });
          });
        } else {
          throw new Error('User not defined');
        }
      })
      .catch(error => {
        console.error('Error signing up:', error);
        return Promise.reject(error);
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

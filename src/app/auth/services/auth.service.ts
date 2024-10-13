import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  // Sign in with email and password
  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Sign up with email, password, and pseudo
  signUp(email: string, password: string, pseudo: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // After the user is created, update the profile with the pseudo
        return userCredential.user?.updateProfile({
          displayName: pseudo
        }).then(() => {
          return userCredential;
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

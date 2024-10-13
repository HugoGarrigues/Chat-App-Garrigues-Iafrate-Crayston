import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importer Router
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  protected pseudo: string = '';
  protected email: string = '';
  protected password: string = '';
  errorMessage: string = ''; // Pour gérer les erreurs

  constructor(private authService: AuthService, private router: Router) {} // Injecter le Router

  signUp() {
    if (!this.pseudo || !this.email || !this.password) {
      this.errorMessage = 'All fields are required!';
      return;
    }

    this.authService.signUp(this.email, this.password, this.pseudo)
      .then(result => {
        console.log('User signed up:', result);
        this.router.navigate(['/home']); // Rediriger vers "home" après inscription réussie
      })
      .catch(error => {
        console.error('Sign up error:', error);
        this.errorMessage = 'Sign up failed. Please try again.';
      });
  }
}

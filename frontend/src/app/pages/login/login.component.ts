import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  erreur: string = '';
  succes: string = '';
  loading: boolean = false;
  mode: 'login' | 'register' = 'login';

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) {
      this.router.navigate([this.auth.isAdmin() ? '/admin' : '/dashboard']);
    }
  }

  soumettre(): void {
    this.erreur = '';
    this.succes = '';

    if (!this.username || !this.password || (this.mode === 'register' && !this.confirmPassword)) {
      this.erreur = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.mode === 'register') {
      if (this.password !== this.confirmPassword) {
        this.erreur = 'Les mots de passe ne correspondent pas';
        return;
      }

      this.loading = true;
      this.auth.register(this.username, this.password, 'client').subscribe({
        next: () => {
          this.succes = '✅ Inscription réussie. Veuillez maintenant vous connecter.';
          this.mode = 'login';
          this.password = '';
          this.confirmPassword = '';
          this.loading = false;
        },
        error: (err) => {
          this.erreur = err.error?.message || 'Erreur lors de l\'inscription';
          this.loading = false;
        }
      });
      return;
    }

    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.router.navigate([res.role === 'admin' ? '/admin' : '/dashboard']);
      },
      error: (err) => {
        this.erreur = err.error?.message || 'Identifiants incorrects';
        this.loading = false;
      }
    });
  }
}
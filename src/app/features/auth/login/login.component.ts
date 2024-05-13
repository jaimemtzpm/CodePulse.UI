import { Component, OnDestroy } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  model: LoginRequest;
  loginSubscription!: Subscription;

  constructor(private authService: AuthService, 
              private cookieService: CookieService, 
              private router: Router) {
    this.model = {
      email: '',
      password: ''
    };    
  }

  onFormSubmit(): void {
    this.loginSubscription = this.authService.login(this.model)
          .subscribe({
            next: (response) => {
              // Set Auth Cookie
              this.cookieService.set('Authorization', `Bearer ${response.token}`, undefined, '/', undefined, true, 'Strict');   
              
              this.authService.setUser({
                email: response.email,
                roles: response.roles
              });              

              this.router.navigateByUrl('/');
            }
          });
          
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }
}

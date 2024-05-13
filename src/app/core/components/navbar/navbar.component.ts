import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/features/auth/models/user.model';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userSubscription!: Subscription;
  user?: User;
  constructor(private authService: AuthService,
              private router: Router
  ){}
  
  ngOnInit(): void {
    this.userSubscription = this.authService.user().subscribe({
      next: (response) => {
        this.user = response;
      }
    });  

    this.user = this.authService.getUser();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}

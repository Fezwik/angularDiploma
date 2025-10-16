import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserInfoType} from "../../../../types/user-info.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false
  userInfo: string | null = '';

  constructor(private authService: AuthService,
              private router: Router,) {
    this.isLogged = this.authService.getIsLoggedIn();
  }


  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    })
    this.authService.getUserInfo()
      .subscribe(data => {
        this.authService.userName.next((data as UserInfoType).name)
      })
    this.authService.userName
      .subscribe(data => {
        this.userInfo = data
      })
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: (data: DefaultResponseType) => {
          this.doLogout()
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.doLogout()
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    localStorage.removeItem("userName");
    console.log('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}

import { Component, OnInit } from '@angular/core';
import { User } from './models/User';
import { UserService } from './services/user.service';
import { Observable } from 'rxjs';
import { ENDPOINTS } from 'src/config/endpoints';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public userLogged$: Observable<User>;
  public user: User;
  public userRegistration: User;
  public identity: any;
  public token: string;
  public errorMessage: string;
  public alertRegister: string;
  public getImageUserUrl: string;

  constructor(private userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.userRegistration = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit() {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.userLogged$ = this.userService.getUserLogged();
    this.userLogged$.subscribe((userLogged: User) => {
      Object.assign(this.user, userLogged);
      console.log(this.user);
    });

    this.userService.setUserLogged(this.identity);
    this.getImageUserUrl = `${this.userService.url}${ENDPOINTS.USER.getImageUser}/`;;
  }

  public onSubmitLogin() {
    this.userService.logOn(this.user).subscribe(
      (response: any) => {
        let identity = response.user;
        this.identity = identity;

        if (this.identity._id) {
          localStorage.setItem('identity', JSON.stringify(identity));

          this.userService.logOn(this.user, 'true').subscribe(
            (response: any) => {
              let token = response.token;
              this.token = token;

              if (this.token.length <= 0) {
                console.log('El token no se ha generado correctamente');
              } else {
                localStorage.setItem('token', JSON.stringify(token));
                this.userService.setUserLogged(this.identity);
              }
            },
            error => {
              let err = <any>error;

              if (err !== null) {
                this.errorMessage = err.error.message;
                console.log(error);
              }
            }
          );

          // Cnseguir el token del usuario
        } else {
          console.log('El usuario no está correctamente identificado');
        }
      },
      error => {
        let err = <any>error;

        if (err !== null) {
          this.errorMessage = err.error.message;
          console.log(error);
        }
      }
    );
  }

  public logout(): void {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.identity = undefined;
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.userService.setUserLogged(this.user);
  }

  public onSubmitRegister() {
    this.userService.signUp(this.userRegistration).subscribe(
      (response: any) => {
        const user = response.user;
        this.userRegistration = user;

        if (!user._id) {
          this.alertRegister = 'El usuario no se ha registrado correctamente';
        } else {
          this.alertRegister = 'El registro se ha realizado correctamente, identifícate con: ' + this.userRegistration.email;
          this.userRegistration = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      (error) => {
        const err = <any>error;

        if (err !== null) {
          this.alertRegister = err.error.message;
          console.log(error);
        }
      }
    );
  }
}

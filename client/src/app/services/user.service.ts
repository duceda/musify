import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ENDPOINTS } from 'src/config/endpoints';
import { map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private httpOptionsWithAuth = {
    headers:
      new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.getToken()
      })
  };

  private userLogged$ = new Subject<User>();
  public url: string;
  public identity;
  public token;

  constructor(private _http: HttpClient) {
    this.url = ENDPOINTS.baseUrl;
  }

  // Si no le pasamos el getHash nos devolverá el objeto en crudo del usuario
  // si le pasamos el getHash nos devuelve el token
  public logOn(userToLogin: any, gethash = null) {
    if (gethash !== null) {
      userToLogin.gethash = gethash;
    }

    let params = userToLogin;
    let url = this.url + ENDPOINTS.USER.login;

    // Al tener el back en NodeJs se le pasa este contentType, sino se podría pasar otro
    return this._http.post(url, params, this.httpOptions);
  }

  public signUp(userToRegister: any) {
    let params = userToRegister;
    let url = this.url + ENDPOINTS.USER.register;

    return this._http.post(url, params, this.httpOptions);
  }

  public getIdentity() {
    let identity = JSON.parse(localStorage.getItem('identity'));

    if (identity) {
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  public getToken() {
    let token = JSON.parse(localStorage.getItem('token'));

    if (token) {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }

  public updateUser(userToUpdate: any) {
    let params = userToUpdate;
    let url = `${this.url}${ENDPOINTS.USER.update}/${userToUpdate._id}`;

    return this._http.put(url, params, this.httpOptionsWithAuth);
  }

  public setUserLogged(user: User) {
    this.userLogged$.next(user);
  }

  public getUserLogged(): Observable<User> {
    return this.userLogged$.asObservable();
  }
}

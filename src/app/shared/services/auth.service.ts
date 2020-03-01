import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userAuthentication = true;
  private _userId = '2';
  constructor() {}

  get userAuthentication() {
    return this._userAuthentication;
  }
  get userId() {
    return this._userId;
  }

  login() {
    this._userAuthentication = true;
  }

  logout() {
    this._userAuthentication = false;
  }
}

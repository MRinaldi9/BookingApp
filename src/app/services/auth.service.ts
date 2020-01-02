import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private _userAuthentication = false;
	constructor() {}

	get userAuthentication() {
		return this._userAuthentication;
	}

	login() {
		this._userAuthentication = true;
	}

	logout() {
		this._userAuthentication = false;
	}
}

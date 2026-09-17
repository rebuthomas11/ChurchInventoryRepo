import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginRequest, ILoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  private apiUrl="https://localhost:7242/api/Auth";

  login(request:ILoginRequest):Observable<ILoginResponse>{
    console.log(request);
    return this.http.post<ILoginResponse>(`${this.apiUrl}/login`,request);
  }

  saveLoginDetails(response: ILoginResponse, rememberMe: boolean): void {

    const storage = rememberMe
      ? localStorage
      : sessionStorage;

    storage.setItem('token', response.token);
    storage.setItem('userId', response.userId.toString());
    storage.setItem('username', response.username);
    storage.setItem('loginName', response.loginName);
    storage.setItem('userRole', response.userRole);
  }

  getToken(): string | null {
    return localStorage.getItem('token')
      ?? sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUsername(): string | null {
    return localStorage.getItem('username')
      ?? sessionStorage.getItem('username');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole')
      ?? sessionStorage.getItem('userRole');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('loginName');
    localStorage.removeItem('userRole');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('loginName');
    sessionStorage.removeItem('userRole');
  }
}

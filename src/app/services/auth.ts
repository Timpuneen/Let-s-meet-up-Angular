import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthResponse, LoginRequest, SignupRequest, User } from '../models/user.model';
import { TokenService } from './token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth'; 
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    //check token on service init
    if (this.tokenService.hasToken()) {
      this.loadCurrentUser();
    }
  }

  signup(data: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup/`, data).pipe(
      tap(response => {
        this.tokenService.setTokens(response.tokens.access, response.tokens.refresh);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    console.log('Sending login request:', data);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, data).pipe(
      tap(response => {
        console.log('Login response:', response);
        this.tokenService.setTokens(response.tokens.access, response.tokens.refresh);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadCurrentUser(): void {
    const token = this.tokenService.getAccessToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<User>(`${this.apiUrl}/me/`, { headers }).subscribe({
        next: user => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
    }
  }
}
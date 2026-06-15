import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient); 
  
  // Ajustado para a porta 3001 conforme o final do seu código Express
  private apiUrl = 'http://localhost:3001'; 

  login(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, dados);
  }
}
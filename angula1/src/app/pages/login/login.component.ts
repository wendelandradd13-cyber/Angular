import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Alterado de 'email' para 'nome' para bater com o const { nome, senha } da API
  dadosLogin = {
    nome: '', 
    senha: ''
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  aoEnviarFormulario() {
    this.authService.login(this.dadosLogin).subscribe({
      next: (resposta) => {
        console.log('Login efetuado com sucesso!', resposta);
        // Opcional: Salvar os dados do admin logado se precisar
        // localStorage.setItem('usuario', JSON.stringify(resposta));
        
        this.router.navigate(['/home']);
      },
      error: (erro) => {
        console.error('Erro ao conectar com a API:', erro);
        // Exibe a mensagem exata que veio da sua API (ex: "O nome de usuário ou senha está incorreto...")
        alert(erro.error?.message || 'Falha ao entrar.');
      }
    });
  }
}
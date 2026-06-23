import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CardComponent } from "../../components/card/card.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CardComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  listaVeiculos: any[] = [];
  veiculoSelecionado: any = null;
  dadosTabela: any = null;

  // Mapa para o select continuar funcionando ao trocar de veículo
  vins: { [key: string]: string } = {
    "Ranger": "2FRHDUYS2Y63NHD22454",
    "Mustang": "2RFAASDY54E4HDU34874",
    "Territory": "2FRHDUYS2Y63NHD22455",
    "Bronco Sport": "2RFAASDY54E4HDU34875"
  };

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3001/vehicles').subscribe({
      next: (dados) => {
        this.listaVeiculos = dados.vehicles;

        if (this.listaVeiculos.length > 0) {
          this.veiculoSelecionado = this.listaVeiculos[0];
          this.buscarDadosPorVin(this.vins[this.veiculoSelecionado.vehicle]);
        }
      },
      error: (erro) => console.error('Erro ao conectar com a API:', erro)
    });
  }

  aoMudarVeiculo(evento: any): void {
    const nomeVeiculo = evento.target.value;
    this.veiculoSelecionado = this.listaVeiculos.find(v => v.vehicle === nomeVeiculo);
    this.buscarDadosPorVin(this.vins[nomeVeiculo]);
  }

  aoDigitarVin(evento: any): void {
    const vinDigitado = evento.target.value.toUpperCase().trim();

    // SE O CAMPO ESTIVER VAZIO: Limpa tudo e força os tracinhos a aparecerem
    if (vinDigitado.length === 0) {
      this.dadosTabela = null; // Deixar null faz o HTML ativar o ?? '---' na hora!
      return;
    }

    // Se você estiver apenas digitando (mas ainda não chegou em 20 letras)
    if (!this.dadosTabela) {
      this.dadosTabela = {};
    }
    this.dadosTabela.vinCodigo = vinDigitado;

    // Se o VIN atingir exatamente 20 caracteres, faz a busca na API
    if (vinDigitado.length === 20) {
      this.buscarDadosPorVin(vinDigitado);
    } else {
      // Se tiver texto mas não tiver 20 letras, limpa os números antigos e deixa os tracinhos
      this.dadosTabela.odometro = null;
      this.dadosTabela.nivelCombustivel = null;
      this.dadosTabela.status = null;
      this.dadosTabela.lat = null;
      this.dadosTabela.long = null;
    }
  }
  
  // SUBSTITUA ESTE MÉTODO TAMBÉM (Melhorado para atualizar o input mesmo em caso de erro):
  buscarDadosPorVin(codigoVin: string): void {
    if (!codigoVin) return;

    this.http.post<any>('http://localhost:3001/vehicleData', { vin: codigoVin }).subscribe({
      next: (dados) => {
        this.dadosTabela = dados;
        this.dadosTabela.vinCodigo = codigoVin; // Mantém o código no input
      },
      error: (erro) => {
        console.warn('VIN inválido ou não cadastrado na API.');
        // Se errar o VIN, limpa os dados mantendo apenas o texto digitado
        this.dadosTabela = {
          vinCodigo: codigoVin,
          odometro: '---',
          nivelCombustivel: '---',
          status: 'Inexistente',
          lat: '---',
          long: '---'
        };
      }
    });
  }
}
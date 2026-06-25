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

  // 🔥 O MAPA FIXO FOI APAGADO! Agora tudo vem da API.

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3001/vehicles').subscribe({
      next: (dados) => {
        this.listaVeiculos = dados.vehicles;

        if (this.listaVeiculos.length > 0) {
          // Seleciona o primeiro veículo da lista vinda da API
          this.veiculoSelecionado = this.listaVeiculos[0];
          
          // 🔍 PEGANDO DA API: Busca os dados usando o VIN real que veio do banco!
          // (Geralmente a propriedade se chama 'vin'. Se no seu banco for outro nome, mude aqui)
          this.buscarDadosPorVin(this.veiculoSelecionado.vin);
        }
      },
      error: (erro) => console.error('Erro ao conectar com a API:', erro)
    });
  }

  aoMudarVeiculo(evento: any): void {
    const nomeVeiculo = evento.target.value;
    
    // Procura na lista o veículo que tem o mesmo nome selecionado
    this.veiculoSelecionado = this.listaVeiculos.find(v => v.vehicle === nomeVeiculo);
    
    if (this.veiculoSelecionado) {
      // 🔍 PEGANDO DA API: Passa o VIN real do veículo encontrado na lista
      this.buscarDadosPorVin(this.veiculoSelecionado.vin);
    }
  }

  aoDigitarVin(evento: any): void {
    const vinDigitado = evento.target.value.toUpperCase().trim();

    if (vinDigitado.length === 0) {
      this.dadosTabela = null; 
      return;
    }

    if (!this.dadosTabela) {
      this.dadosTabela = {};
    }
    this.dadosTabela.vinCodigo = vinDigitado;

    if (vinDigitado.length === 20) {
      this.buscarDadosPorVin(vinDigitado);
    } else {
      this.dadosTabela.odometro = null;
      this.dadosTabela.nivelCombustivel = null;
      this.dadosTabela.status = null;
      this.dadosTabela.lat = null;
      this.dadosTabela.long = null;
    }
  }
  
  buscarDadosPorVin(codigoVin: string): void {
    if (!codigoVin) return;

    this.http.post<any>('http://localhost:3001/vehicleData', { vin: codigoVin }).subscribe({
      next: (dados) => {
        this.dadosTabela = dados;
        this.dadosTabela.vinCodigo = codigoVin; 
      },
      error: (erro) => {
        console.warn('VIN inválido ou não cadastrado na API.');
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
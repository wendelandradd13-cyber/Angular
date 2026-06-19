import { Component, inject} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from "../../components/card/card.component";

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private router = inject(Router);

  
}

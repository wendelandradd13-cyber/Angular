import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    {
        path: "login", // 1. Criamos o caminho explícito do login
        loadComponent: () => {
            return import("./pages/login/login.component")
            .then(c => c.LoginComponent)
        }
    },
    {
        path: "", // 2. Se a pessoa entrar na raiz vazia, redireciona automático para o /login
        pathMatch: "full",
        redirectTo: "login"
    },
    {
        path: "home",
        pathMatch: "full",
        canActivate: [authGuard],
        loadComponent: () => {
            return import("./pages/home/home.component")
            .then(c => c.HomeComponent)
        },
    },
    {
        path: "dashboard",
        pathMatch: "full",
        canActivate: [authGuard],
        loadComponent: () => {
            return import("./pages/dashboard/dashboard.component")
            .then(c => c.DashboardComponent)
        },
    },
    
];
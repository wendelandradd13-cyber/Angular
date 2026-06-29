import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');

  if (usuarioLogado) {
    return true;
  } else {
    // MODIFICADO: Troquei '/login' por '/' para bater com a sua rota atual
    router.navigate(['/']); 
    return false;
  }
};
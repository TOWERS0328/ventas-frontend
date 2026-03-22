import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>store</mat-icon>
      <span style="margin-left: 8px; font-weight: 600;">Sistema de Ventas</span>
      <span style="flex: 1"></span>
      <button mat-button routerLink="/ventas">
        <mat-icon>list</mat-icon> Ventas
      </button>
      <button mat-button routerLink="/ventas/nueva">
        <mat-icon>add</mat-icon> Nueva Venta
      </button>
    </mat-toolbar>

    <main style="padding: 24px; max-width: 1200px; margin: 0 auto;">
      <router-outlet />
    </main>
  `
})
export class AppComponent {
  title = 'ventas-frontend';
}

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../models/venta.model';

@Component({
  selector: 'app-venta-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatCardModule, MatSnackBarModule,
    MatTooltipModule, MatChipsModule, CurrencyPipe, DatePipe
  ],
  template: `
    <div class="list-container">
      <div class="header-row">
        <div>
          <h2 class="page-title">
            <mat-icon>receipt_long</mat-icon>
            Registro de Ventas
          </h2>
          <p class="subtitle">{{ dataSource.data.length }} venta(s) registrada(s)</p>
        </div>
        <button mat-raised-button color="primary" (click)="nuevaVenta()">
          <mat-icon>add</mat-icon> Nueva Venta
        </button>
      </div>

      <mat-card class="total-card" appearance="outlined">
        <mat-card-content>
          <div class="total-info">
            <mat-icon color="primary">payments</mat-icon>
            <div>
              <span class="total-label">Total General de Ventas</span>
              <span class="total-value">{{ totalGeneral | currency:'COP':'symbol':'1.0-0' }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-content>
          <mat-form-field appearance="outline" style="width: 100%">
            <mat-label>Buscar por nombre</mat-label>
            <input matInput [(ngModel)]="filtro" (input)="aplicarFiltro()" placeholder="Ej: Camisa...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <div class="table-responsive">
            <table mat-table [dataSource]="dataSource" matSort class="ventas-table">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>#</th>
                <td mat-cell *matCellDef="let v">{{ v.id }}</td>
              </ng-container>
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Producto</th>
                <td mat-cell *matCellDef="let v"><strong>{{ v.nombre }}</strong></td>
              </ng-container>
              <ng-container matColumnDef="precio">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Precio Unit.</th>
                <td mat-cell *matCellDef="let v">{{ v.precio | currency:'COP':'symbol':'1.0-0' }}</td>
              </ng-container>
              <ng-container matColumnDef="cantidad">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Cantidad</th>
                <td mat-cell *matCellDef="let v"><mat-chip>{{ v.cantidad }}</mat-chip></td>
              </ng-container>
              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Total</th>
                <td mat-cell *matCellDef="let v">
                  <strong style="color: #1976d2;">{{ v.total | currency:'COP':'symbol':'1.0-0' }}</strong>
                </td>
              </ng-container>
              <ng-container matColumnDef="fechaCreacion">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha</th>
                <td mat-cell *matCellDef="let v">{{ v.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</td>
              </ng-container>
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let v">
                  <button mat-icon-button color="primary" (click)="editar(v.id)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmarEliminar(v)" matTooltip="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="columnas"></tr>
              <tr mat-row *matRowDef="let row; columns: columnas;" class="venta-row"></tr>
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data" colspan="7">
                  <mat-icon>inbox</mat-icon>
                  <p>No se encontraron ventas</p>
                </td>
              </tr>
            </table>
          </div>
          <mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .list-container { display: flex; flex-direction: column; gap: 16px; }
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .page-title { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 1.5rem; }
    .subtitle { color: #666; margin: 4px 0 0 0; }
    .total-card { background: linear-gradient(135deg, #e3f2fd, #bbdefb); }
    .total-info { display: flex; align-items: center; gap: 16px; }
    .total-info mat-icon { font-size: 40px; height: 40px; width: 40px; }
    .total-label { display: block; font-size: 0.85rem; color: #555; }
    .total-value { font-size: 1.6rem; font-weight: 700; color: #1565c0; }
    .table-responsive { overflow-x: auto; }
    .ventas-table { width: 100%; }
    .venta-row:hover { background: #f5f5f5; }
    .no-data { text-align: center; padding: 40px; color: #999; }
  `]
})
export class VentaListComponent implements OnInit, AfterViewInit {
  columnas = ['id', 'nombre', 'precio', 'cantidad', 'total', 'fechaCreacion', 'acciones'];
  dataSource = new MatTableDataSource<Venta>();
  filtro = '';
  totalGeneral = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ventaService: VentaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargarVentas();
    this.cargarTotal();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarVentas() {
    this.ventaService.getVentas().subscribe({
      next: (ventas) => this.dataSource.data = ventas,
      error: () => this.snackBar.open('Error al cargar ventas', 'Cerrar', { duration: 3000 })
    });
  }

  cargarTotal() {
    this.ventaService.getTotalGeneral().subscribe({
      next: (res) => this.totalGeneral = res.totalGeneral
    });
  }

  aplicarFiltro() {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }

  nuevaVenta() {
    this.router.navigate(['/ventas/nueva']);
  }

  editar(id: number) {
    this.router.navigate(['/ventas/editar', id]);
  }

  confirmarEliminar(venta: Venta) {
    const confirmado = confirm(`¿Eliminar la venta de "${venta.nombre}"?`);
    if (confirmado) {
      this.ventaService.eliminarVenta(venta.id!).subscribe({
        next: () => {
          this.snackBar.open('Venta eliminada', 'OK', { duration: 3000 });
          this.cargarVentas();
          this.cargarTotal();
        },
        error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-venta-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule,
    MatDividerModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="form-container">
      <div *ngIf="cargando" class="loading-center">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Cargando venta...</p>
      </div>
      <mat-card appearance="outlined" *ngIf="!cargando">
        <mat-card-header>
          <mat-icon mat-card-avatar color="accent">edit</mat-icon>
          <mat-card-title>Editar Venta #{{ ventaId }}</mat-card-title>
          <mat-card-subtitle>Modifique los datos y guarde los cambios</mat-card-subtitle>
        </mat-card-header>
        <mat-divider></mat-divider>
        <mat-card-content style="padding-top: 24px;">
          <form [formGroup]="ventaForm" (ngSubmit)="guardar()">
            <div class="form-grid">
              <mat-form-field appearance="outline" style="grid-column: 1 / -1;">
                <mat-label>Nombre del Producto</mat-label>
                <input matInput formControlName="nombre">
                <mat-icon matSuffix>inventory_2</mat-icon>
                <mat-error *ngIf="ventaForm.get('nombre')?.hasError('required')">
                  El nombre es obligatorio
                </mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Precio Unitario</mat-label>
                <input matInput type="number" formControlName="precio"
                       min="0.01" step="0.01" (input)="calcularTotal()">
                <span matTextPrefix>$&nbsp;</span>
                <mat-error *ngIf="ventaForm.get('precio')?.hasError('required')">
                  El precio es obligatorio
                </mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Cantidad</mat-label>
                <input matInput type="number" formControlName="cantidad"
                       min="1" step="1" (input)="calcularTotal()">
                <mat-icon matSuffix>production_quantity_limits</mat-icon>
                <mat-error *ngIf="ventaForm.get('cantidad')?.hasError('required')">
                  La cantidad es obligatoria
                </mat-error>
              </mat-form-field>
            </div>
            <div class="total-preview" *ngIf="totalCalculado > 0">
              <span>Total calculado:</span>
              <strong>{{ totalCalculado | number:'1.0-0' }} COP</strong>
            </div>
            <mat-divider style="margin: 16px 0"></mat-divider>
            <div class="form-actions">
              <button mat-stroked-button type="button" (click)="cancelar()">
                <mat-icon>arrow_back</mat-icon> Cancelar
              </button>
              <button mat-raised-button color="accent" type="submit"
                      [disabled]="ventaForm.invalid || guardando">
                <mat-icon>save</mat-icon>
                {{ guardando ? 'Actualizando...' : 'Actualizar Venta' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 700px; margin: 0 auto; }
    .loading-center { display: flex; flex-direction: column; align-items: center; padding: 60px; gap: 16px; color: #666; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .total-preview {
      background: #fff3e0; border: 1px solid #ffcc80;
      border-radius: 8px; padding: 16px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 1.1rem;
    }
    .total-preview strong { color: #e65100; font-size: 1.4rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; }
  `]
})
export class VentaEditComponent implements OnInit {
  ventaForm: FormGroup;
  ventaId!: number;
  totalCalculado = 0;
  cargando = true;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.ventaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.ventaId = Number(this.route.snapshot.paramMap.get('id'));
    this.ventaService.getVentaById(this.ventaId).subscribe({
      next: (venta) => {
        this.ventaForm.patchValue({
          nombre: venta.nombre,
          precio: venta.precio,
          cantidad: venta.cantidad
        });
        this.calcularTotal();
        this.cargando = false;
      },
      error: () => {
        this.snackBar.open('No se encontró la venta', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/ventas']);
      }
    });
  }

  calcularTotal() {
    const precio = this.ventaForm.get('precio')?.value || 0;
    const cantidad = this.ventaForm.get('cantidad')?.value || 0;
    this.totalCalculado = precio * cantidad;
  }

  guardar() {
    if (this.ventaForm.invalid) return;
    this.guardando = true;
    this.ventaService.actualizarVenta(this.ventaId, this.ventaForm.value).subscribe({
      next: () => {
        this.snackBar.open('✅ Venta actualizada correctamente', 'OK', { duration: 3000 });
        this.router.navigate(['/ventas']);
      },
      error: () => {
        this.snackBar.open('❌ Error al actualizar', 'Cerrar', { duration: 3000 });
        this.guardando = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/ventas']);
  }
}

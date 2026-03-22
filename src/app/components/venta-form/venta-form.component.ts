import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatDividerModule
  ],
  template: `
    <div class="form-container">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-icon mat-card-avatar color="primary">add_shopping_cart</mat-icon>
          <mat-card-title>Nueva Venta</mat-card-title>
          <mat-card-subtitle>Complete los datos del producto</mat-card-subtitle>
        </mat-card-header>
        <mat-divider></mat-divider>
        <mat-card-content style="padding-top: 24px;">
          <form [formGroup]="ventaForm" (ngSubmit)="guardar()">
            <div class="form-grid">
              <mat-form-field appearance="outline" style="grid-column: 1 / -1;">
                <mat-label>Nombre del Producto</mat-label>
                <input matInput formControlName="nombre" placeholder="Ej: Camisa azul talla M">
                <mat-icon matSuffix>inventory_2</mat-icon>
                <mat-error *ngIf="ventaForm.get('nombre')?.hasError('required')">
                  El nombre es obligatorio
                </mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Precio Unitario</mat-label>
                <input matInput type="number" formControlName="precio"
                       placeholder="0.00" min="0.01" step="0.01"
                       (input)="calcularTotal()">
                <span matTextPrefix>$&nbsp;</span>
                <mat-error *ngIf="ventaForm.get('precio')?.hasError('required')">
                  El precio es obligatorio
                </mat-error>
                <mat-error *ngIf="ventaForm.get('precio')?.hasError('min')">
                  El precio debe ser mayor a 0
                </mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Cantidad</mat-label>
                <input matInput type="number" formControlName="cantidad"
                       placeholder="1" min="1" step="1"
                       (input)="calcularTotal()">
                <mat-icon matSuffix>production_quantity_limits</mat-icon>
                <mat-error *ngIf="ventaForm.get('cantidad')?.hasError('required')">
                  La cantidad es obligatoria
                </mat-error>
                <mat-error *ngIf="ventaForm.get('cantidad')?.hasError('min')">
                  La cantidad debe ser al menos 1
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
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="ventaForm.invalid || guardando">
                <mat-icon>save</mat-icon>
                {{ guardando ? 'Guardando...' : 'Guardar Venta' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 700px; margin: 0 auto; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .total-preview {
      background: #e8f5e9; border: 1px solid #a5d6a7;
      border-radius: 8px; padding: 16px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 1.1rem;
    }
    .total-preview strong { color: #2e7d32; font-size: 1.4rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; }
  `]
})
export class VentaFormComponent {
  ventaForm: FormGroup;
  totalCalculado = 0;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.ventaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
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
    this.ventaService.crearVenta(this.ventaForm.value).subscribe({
      next: () => {
        this.snackBar.open('✅ Venta registrada correctamente', 'OK', { duration: 3000 });
        this.router.navigate(['/ventas']);
      },
      error: () => {
        this.snackBar.open('❌ Error al guardar la venta', 'Cerrar', { duration: 3000 });
        this.guardando = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/ventas']);
  }
}

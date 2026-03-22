import { Routes } from '@angular/router';
import { VentaListComponent } from './components/venta-list/venta-list.component';
import { VentaFormComponent } from './components/venta-form/venta-form.component';
import { VentaEditComponent } from './components/venta-edit/venta-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: 'ventas', pathMatch: 'full' },
  { path: 'ventas', component: VentaListComponent },
  { path: 'ventas/nueva', component: VentaFormComponent },
  { path: 'ventas/editar/:id', component: VentaEditComponent },
  { path: '**', redirectTo: 'ventas' }
];

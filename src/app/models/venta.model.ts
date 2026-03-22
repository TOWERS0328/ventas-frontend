export interface Venta {
  id?: number;
  nombre: string;
  precio: number;
  cantidad: number;
  total?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

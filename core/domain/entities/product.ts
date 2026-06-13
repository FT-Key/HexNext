export interface AtributoVariante {
  id: string;
  nombre: string;
  valor: string;
  codigoColor: string | null;
}

export interface EspecificacionTecnica {
  id: string;
  nombre: string;
  valor: string;
}

export interface ProductProps {
  id: string;
  sku: string;
  nombre: string;
  slug: string;
  descripcion: string;
  marca: string;
  precio: number;
  precioComparativa: number | null;
  stock: number;
  categoriaId: string;
  productoPadreId: string | null;
  atributos: AtributoVariante[];
  especificaciones: EspecificacionTecnica[];
  imagenes: string[];
  destacado: boolean;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  public readonly id: string;
  public readonly sku: string;
  public readonly nombre: string;
  public readonly slug: string;
  public readonly descripcion: string;
  public readonly marca: string;
  public readonly precio: number;
  public readonly precioComparativa: number | null;
  public readonly stock: number;
  public readonly categoriaId: string;
  public readonly productoPadreId: string | null;
  public readonly atributos: AtributoVariante[];
  public readonly especificaciones: EspecificacionTecnica[];
  public readonly imagenes: string[];
  public readonly destacado: boolean;
  public readonly activo: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.sku = props.sku;
    this.nombre = props.nombre;
    this.slug = props.slug;
    this.descripcion = props.descripcion;
    this.marca = props.marca;
    this.precio = props.precio;
    this.precioComparativa = props.precioComparativa;
    this.stock = props.stock;
    this.categoriaId = props.categoriaId;
    this.productoPadreId = props.productoPadreId;
    this.atributos = props.atributos;
    this.especificaciones = props.especificaciones;
    this.imagenes = props.imagenes;
    this.destacado = props.destacado;
    this.activo = props.activo;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get tieneStock(): boolean {
    return this.stock > 0;
  }

  get descuento(): number | null {
    if (this.precioComparativa === null || this.precioComparativa <= this.precio) {
      return null;
    }
    return Math.round((1 - this.precio / this.precioComparativa) * 100);
  }
}

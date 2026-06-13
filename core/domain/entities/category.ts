export interface CategoryProps {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  categoriaPadreId: string | null;
  orden: number;
  activo: boolean;
}

export class Category {
  public readonly id: string;
  public readonly nombre: string;
  public readonly slug: string;
  public readonly descripcion: string | null;
  public readonly categoriaPadreId: string | null;
  public readonly orden: number;
  public readonly activo: boolean;
  public readonly children: Category[];

  constructor(props: CategoryProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.slug = props.slug;
    this.descripcion = props.descripcion;
    this.categoriaPadreId = props.categoriaPadreId;
    this.orden = props.orden;
    this.activo = props.activo;
    this.children = [];
  }

  get esRaiz(): boolean {
    return this.categoriaPadreId === null;
  }

  addChild(child: Category): void {
    this.children.push(child);
  }
}

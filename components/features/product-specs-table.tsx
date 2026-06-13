import type { EspecificacionTecnica } from "@/core/domain/entities/product";

interface ProductSpecsTableProps {
  especificaciones: EspecificacionTecnica[];
}

export function ProductSpecsTable({ especificaciones }: ProductSpecsTableProps) {
  if (especificaciones.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay especificaciones técnicas disponibles.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <tbody>
          {especificaciones.map((spec, index) => (
            <tr
              key={spec.id}
              className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}
            >
              <td className="px-4 py-3 font-medium text-muted-foreground">
                {spec.nombre}
              </td>
              <td className="px-4 py-3 font-mono">{spec.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

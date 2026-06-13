import { redirect } from "next/navigation";
import { getCategories } from "@/shared/utils/get-categories";

export default async function CatalogPage() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold">Catálogo</h1>
        <p className="mt-2 text-muted-foreground">
          No hay categorías disponibles.
        </p>
      </div>
    );
  }

  redirect(`/categorias/${categories[0].slug}`);
}

import { getCategories } from "@/shared/utils/get-categories";
import { CategoryNav } from "@/components/features/category-nav";

export default async function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <div className="container mx-auto flex-1 px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border bg-card p-4">
            <CategoryNav categories={categories} />
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryNode {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  categoriaPadreId: string | null;
  orden: number;
  activo: boolean;
  children: CategoryNode[];
}

interface CategoryNavProps {
  categories: CategoryNode[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  return (
    <nav className="space-y-1">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Categorías
      </p>
      {categories.map((category) => (
        <CategoryTreeItem key={category.id} category={category} depth={0} />
      ))}
    </nav>
  );
}

function CategoryTreeItem({
  category,
  depth,
}: {
  category: CategoryNode;
  depth: number;
}) {
  const pathname = usePathname();
  const href = `/categorias/${category.slug}`;
  const isActive = pathname === href;
  const hasChildren = category.children.length > 0;

  return (
    <div>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-primary/10 font-medium text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            isActive ? "bg-primary" : "bg-muted-foreground/30"
          )}
        />
        <span>{category.nombre}</span>
        {hasChildren && (
          <svg
            className={cn(
              "ml-auto size-3.5 shrink-0 transition-transform",
              isActive && "rotate-90"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </Link>
      {hasChildren &&
        category.children.map((child) => (
          <CategoryTreeItem
            key={child.id}
            category={child}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}

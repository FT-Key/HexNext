import { AdminSidebar } from "@/components/features/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b bg-card px-6">
          <h1 className="text-lg font-semibold">Panel de Administración</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

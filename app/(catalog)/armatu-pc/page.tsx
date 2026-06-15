import { getPcBuilderData } from "@/shared/utils/get-pc-builder-data";
import { PcBuilder } from "@/components/features/pc-builder";

export default async function ArmaTuPcPage() {
  const data = await getPcBuilderData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Armá tu PC</h1>
        <p className="mt-2 text-muted-foreground">
          Seleccioná los componentes para tu PC. El sistema valida la compatibilidad automáticamente.
        </p>
      </div>
      <PcBuilder
        slots={data.slots}
        productsByCategory={data.productsByCategory}
      />
    </div>
  );
}

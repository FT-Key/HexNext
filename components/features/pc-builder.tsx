"use client";

import { useState, useMemo, useCallback } from "react";
import type { ProductProps, EspecificacionTecnica } from "@/core/domain/entities/product";
import type { PcBuilderSlot } from "@/core/use-cases/catalog/get-pc-builder-data.use-case";
import { PcComponentSlot } from "./pc-component-slot";
import { PcBuildSummary } from "./pc-build-summary";

function getSpecValue(especificaciones: EspecificacionTecnica[], nombre: string): string | null {
  const spec = especificaciones.find(
    (s) => s.nombre.toLowerCase() === nombre.toLowerCase()
  );
  return spec?.valor ?? null;
}

function extractNumber(valor: string | null): number | null {
  if (!valor) return null;
  const match = valor.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

interface CompatibilityResult {
  compatible: boolean;
  message: string;
}

function checkCpuMotherCompatibility(cpu: ProductProps, mother: ProductProps): CompatibilityResult {
  const cpuSocket = getSpecValue(cpu.especificaciones, "Socket");
  const moboSocket = getSpecValue(mother.especificaciones, "Socket");
  if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
    return {
      compatible: false,
      message: `Socket incompatible: CPU ${cpuSocket} ≠ Mother ${moboSocket}`,
    };
  }
  return { compatible: true, message: "" };
}

function checkMotherRamCompatibility(mother: ProductProps, ram: ProductProps): CompatibilityResult {
  const moboRamType = getSpecValue(mother.especificaciones, "Tipo de RAM");
  const ramType = getSpecValue(ram.especificaciones, "Tipo");
  if (moboRamType && ramType && moboRamType !== ramType) {
    return {
      compatible: false,
      message: `RAM incompatible: Mother ${moboRamType} ≠ RAM ${ramType}`,
    };
  }
  return { compatible: true, message: "" };
}

function checkPsuCaseCompatibility(psu: ProductProps, pcCase: ProductProps): CompatibilityResult {
  const psuFormFactor = getSpecValue(psu.especificaciones, "Factor");
  const caseMotherCompat = getSpecValue(pcCase.especificaciones, "Mother compatible");
  if (psuFormFactor && caseMotherCompat) {
    const formFactors = caseMotherCompat.split(",").map((s) => s.trim().toLowerCase());
    if (psuFormFactor === "SFX" && !formFactors.includes("itx")) {
      return {
        compatible: false,
        message: `Fuente SFX incompatible con gabinete que solo soporta ATX`,
      };
    }
    if (psuFormFactor === "ATX" && !formFactors.some((f) => ["atx", "matx"].includes(f))) {
      return {
        compatible: false,
        message: `Fuente ATX incompatible con gabinete ITX`,
      };
    }
  }
  return { compatible: true, message: "" };
}

function checkGpuCaseCompatibility(gpu: ProductProps, pcCase: ProductProps): CompatibilityResult {
  const gpuLength = extractNumber(getSpecValue(gpu.especificaciones, "Largo"));
  const caseMaxGpu = extractNumber(getSpecValue(pcCase.especificaciones, "GPU máx."));
  if (gpuLength && caseMaxGpu && gpuLength > caseMaxGpu) {
    return {
      compatible: false,
      message: `GPU de ${gpuLength}mm no entra en gabinete (máx. ${caseMaxGpu}mm)`,
    };
  }
  return { compatible: true, message: "" };
}

function checkPowerBudget(
  cpuTdp: number | null,
  gpuTdp: number | null,
  psuWattage: number | null
): CompatibilityResult {
  const totalTdp = (cpuTdp ?? 0) + (gpuTdp ?? 0) + 100;
  if (psuWattage && totalTdp > psuWattage) {
    return {
      compatible: false,
      message: `Consumo estimado ${totalTdp}W supera capacidad de fuente ${psuWattage}W`,
    };
  }
  if (psuWattage && totalTdp > psuWattage * 0.9) {
    return {
      compatible: true,
      message: `Consumo estimado ${totalTdp}W está cerca del límite (${psuWattage}W)`,
    };
  }
  return { compatible: true, message: "" };
}

function validateBuild(
  selected: Record<string, ProductProps | null>
): Record<string, { compatible: boolean; message: string }> {
  const result: Record<string, { compatible: boolean; message: string }> = {};
  for (const slotId of Object.keys(selected)) {
    result[slotId] = { compatible: true, message: "" };
  }

  const cpu = selected.cpu;
  const mother = selected.motherboard;
  const ram = selected.ram;
  const gpu = selected.gpu;
  const psu = selected.psu;
  const pcCase = selected.case;

  if (cpu && mother) {
    result.cpu = checkCpuMotherCompatibility(cpu, mother);
    result.motherboard = result.cpu;
  }

  if (mother && ram) {
    const ramCheck = checkMotherRamCompatibility(mother, ram);
    if (!ramCheck.compatible) {
      result.motherboard = ramCheck;
      result.ram = ramCheck;
    }
  }

  if (psu && pcCase) {
    const psuCaseCheck = checkPsuCaseCompatibility(psu, pcCase);
    if (!psuCaseCheck.compatible) {
      result.psu = psuCaseCheck;
      result.case = psuCaseCheck;
    }
  }

  if (gpu && pcCase) {
    const gpuCaseCheck = checkGpuCaseCompatibility(gpu, pcCase);
    if (!gpuCaseCheck.compatible) {
      result.gpu = gpuCaseCheck;
      result.case = gpuCaseCheck;
    }
  }

  if (cpu && gpu && psu) {
    const cpuTdp = extractNumber(getSpecValue(cpu.especificaciones, "TDP"));
    const gpuTdp = extractNumber(getSpecValue(gpu.especificaciones, "TDP"));
    const psuWattage = extractNumber(getSpecValue(psu.especificaciones, "Potencia"));
    const powerCheck = checkPowerBudget(cpuTdp, gpuTdp, psuWattage);
    if (!powerCheck.compatible) {
      result.psu = powerCheck;
    }
  }

  return result;
}

function calculateTotal(selected: Record<string, ProductProps | null>): number {
  return Object.values(selected).reduce((sum, p) => sum + (p ? p.precio : 0), 0);
}

function calculateEstimatedPower(selected: Record<string, ProductProps | null>): number {
  let total = 100;
  const cpu = selected.cpu;
  const gpu = selected.gpu;
  if (cpu) {
    total += extractNumber(getSpecValue(cpu.especificaciones, "TDP")) ?? 0;
  }
  if (gpu) {
    total += extractNumber(getSpecValue(gpu.especificaciones, "TDP")) ?? 0;
  }
  return total;
}

interface Props {
  slots: PcBuilderSlot[];
  productsByCategory: Record<string, ProductProps[]>;
}

export function PcBuilder({ slots, productsByCategory }: Props) {
  const [selected, setSelected] = useState<Record<string, ProductProps | null>>({});
  const [slotSelectorOpen, setSlotSelectorOpen] = useState<string | null>(null);

  const compatibility = useMemo(() => validateBuild(selected), [selected]);
  const totalPrice = useMemo(() => calculateTotal(selected), [selected]);
  const estimatedPower = useMemo(() => calculateEstimatedPower(selected), [selected]);

  const hasIncompatibilities = useMemo(
    () => Object.values(compatibility).some((c) => !c.compatible),
    [compatibility]
  );

  const selectProduct = useCallback((slotId: string, product: ProductProps) => {
    setSelected((prev) => ({ ...prev, [slotId]: product }));
    setSlotSelectorOpen(null);
  }, []);

  const clearSlot = useCallback((slotId: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {slots.map((slot) => (
          <PcComponentSlot
            key={slot.id}
            slot={slot}
            products={productsByCategory[slot.id] ?? []}
            selectedProduct={selected[slot.id] ?? null}
            compatibility={compatibility[slot.id] ?? { compatible: true, message: "" }}
            selectorOpen={slotSelectorOpen === slot.id}
            onSelectProduct={(p) => selectProduct(slot.id, p)}
            onClearSlot={() => clearSlot(slot.id)}
            onToggleSelector={() =>
              setSlotSelectorOpen(slotSelectorOpen === slot.id ? null : slot.id)
            }
          />
        ))}
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <PcBuildSummary
          totalPrice={totalPrice}
          estimatedPower={estimatedPower}
          hasIncompatibilities={hasIncompatibilities}
          selectedCount={Object.keys(selected).length}
          totalSlots={slots.length}
        />
      </div>
    </div>
  );
}

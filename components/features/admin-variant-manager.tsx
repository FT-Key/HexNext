"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Variant {
  id: string
  nombre: string
  valor: string
  codigoColor: string | null
}

interface AdminVariantManagerProps {
  variants: Variant[]
  onChange: (variants: Variant[]) => void
}

export function AdminVariantManager({ variants, onChange }: AdminVariantManagerProps) {
  const [newName, setNewName] = useState("")
  const [newValue, setNewValue] = useState("")
  const [newColor, setNewColor] = useState("")

  function addVariant() {
    if (!newName || !newValue) return

    onChange([
      ...variants,
      {
        id: crypto.randomUUID(),
        nombre: newName,
        valor: newValue,
        codigoColor: newColor || null,
      },
    ])

    setNewName("")
    setNewValue("")
    setNewColor("")
  }

  function removeVariant(id: string) {
    onChange(variants.filter((v) => v.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label>Atributo</Label>
          <Input
            placeholder="Ej: Color"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Valor</Label>
          <Input
            placeholder="Ej: Rojo"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Color (hex)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="#FF0000"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="shrink-0"
              onClick={addVariant}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {variants.length > 0 && (
        <div className="space-y-2">
          {variants.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-3 rounded-2xl border bg-muted/30 px-3 py-2"
            >
              {v.codigoColor && (
                <span
                  className="size-5 shrink-0 rounded-full border"
                  style={{ backgroundColor: v.codigoColor }}
                />
              )}
              <span className="text-sm font-medium">{v.nombre}:</span>
              <span className="text-sm text-muted-foreground">{v.valor}</span>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="ml-auto text-destructive"
                onClick={() => removeVariant(v.id)}
              >
                Quitar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Package, Plus, Check, X, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StepLayout } from '@/components/calculator/wizard/StepLayout'
import { BoxField, fieldInputCls, parseAmount } from '@/components/calculator/wizard/BoxField'

export type Material = {
  id: number
  name: string
  cost: number // what you paid
  qty: number // how much that buys (the purchase amount)
  unit: string // purchase unit
  used: number // how much goes into one product/recipe
  usedUnit?: string // unit for `used`; defaults to `unit` (the purchase unit)
}

const UNITS = ['ea', 'oz', 'g', 'ml', 'lb', 'kg', 'l', 'ft', 'in', 'yd']

// Base factors per measurement dimension (mass→g, volume→ml, length→in, count→ea).
const UNIT_DIM: Record<string, { dim: string; factor: number }> = {
  ea: { dim: 'count', factor: 1 },
  oz: { dim: 'mass', factor: 28.3495 },
  g: { dim: 'mass', factor: 1 },
  lb: { dim: 'mass', factor: 453.592 },
  kg: { dim: 'mass', factor: 1000 },
  ml: { dim: 'volume', factor: 1 },
  l: { dim: 'volume', factor: 1000 },
  in: { dim: 'length', factor: 1 },
  ft: { dim: 'length', factor: 12 },
  yd: { dim: 'length', factor: 36 },
}

/** Per purchase-unit price. */
export function perUnitCost(m: { cost: number; qty: number }) {
  return m.qty > 0 ? m.cost / m.qty : 0
}

/** Cost of the amount used in one product — converts between purchase and used units when they differ. */
export function materialLineCost(m: {
  cost: number
  qty: number
  unit: string
  used: number
  usedUnit?: string
}) {
  if (m.qty <= 0) return 0
  const usedUnit = m.usedUnit ?? m.unit
  const buy = UNIT_DIM[m.unit]
  const use = UNIT_DIM[usedUnit]
  // Same dimension → convert the used amount into purchase units.
  const usedInBuyUnits = buy && use && buy.dim === use.dim ? (m.used * use.factor) / buy.factor : m.used
  return perUnitCost(m) * usedInBuyUnits
}

type MaterialsStepProps = {
  materials: Material[]
  onAdd: (m: Omit<Material, 'id'>) => void
  onUpdate: (id: number, m: Omit<Material, 'id'>) => void
  onRemove: (id: number) => void
}

export function MaterialsStep({ materials, onAdd, onUpdate, onRemove }: MaterialsStepProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [qty, setQty] = useState('')
  const [unit, setUnit] = useState('ea')
  const [used, setUsed] = useState('')
  const [usedUnit, setUsedUnit] = useState('ea')

  const total = materials.reduce((sum, m) => sum + materialLineCost(m), 0)
  const nCost = parseAmount(cost)
  const nQty = parseAmount(qty)
  const nUsed = parseAmount(used)
  const canSubmit = name.trim() !== '' && nCost > 0 && nQty > 0 && nUsed > 0
  const editing = editingId !== null
  const draftPerUnit = perUnitCost({ cost: nCost, qty: nQty })
  const draftLine = materialLineCost({ cost: nCost, qty: nQty, unit, used: nUsed, usedUnit })

  function resetForm() {
    setEditingId(null)
    setName('')
    setCost('')
    setQty('')
    setUnit('ea')
    setUsed('')
    setUsedUnit('ea')
  }

  // Change the purchase unit — keep the "used" unit linked to it unless the maker has diverged.
  function changeUnit(nextUnit: string) {
    setUsedUnit((uu) => (uu === unit ? nextUnit : uu))
    setUnit(nextUnit)
  }

  function startEdit(m: Material) {
    setEditingId(m.id)
    setName(m.name)
    setCost(String(m.cost))
    setQty(String(m.qty))
    setUnit(m.unit || 'ea')
    setUsed(m.used ? String(m.used) : '')
    setUsedUnit(m.usedUnit ?? m.unit ?? 'ea')
  }

  function submit() {
    if (!canSubmit) return
    const data = { name: name.trim(), cost: nCost, qty: nQty, unit, used: nUsed, usedUnit }
    if (editing) onUpdate(editingId!, data)
    else onAdd(data)
    resetForm()
  }

  const left = (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-3.5 h-3.5 rounded-full bg-candy" />
        <span className="type-third text-sm">Materials</span>
      </div>
      <h1 className="type-heading text-page">
        What goes<br />in <span className="text-poppy">it?</span>
      </h1>
      <p className="type-body text-base mt-4 max-w-sm">
        Add what you buy and how much of it goes into one product. We&rsquo;ll work out the
        cost per piece and total it up.
      </p>
    </div>
  )

  const right = (
    <div>
      {/* Add / edit form */}
      <div className="flex items-center justify-between mb-3">
        <p className="type-third text-sm">{editing ? 'Edit material' : 'Add material'}</p>
        {editing && (
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-1 text-xs text-pine/50 hover:text-pine transition-colors"
          >
            <X size={14} strokeWidth={2.5} /> Cancel
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <BoxField label="Material name">
          <input
            className={fieldInputCls}
            placeholder="e.g. Coconut wax"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </BoxField>

        <div className="flex items-stretch gap-3">
          <BoxField label="Cost" className="flex-1">
            <input
              className={fieldInputCls}
              inputMode="decimal"
              placeholder="$ 0.00"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </BoxField>

          <BoxField label="Buys this much" className="flex-1">
            <div className="flex items-center gap-2">
              <input
                className={fieldInputCls}
                inputMode="decimal"
                placeholder="0"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
              <select
                value={unit}
                onChange={(e) => changeUnit(e.target.value)}
                aria-label="Purchase unit"
                className="bg-transparent outline-none text-pine text-base font-sans cursor-pointer"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </BoxField>
        </div>

        <div className="flex items-stretch gap-3">
          <BoxField label="Used per recipe" className="flex-1">
            <div className="flex items-center gap-2">
              <input
                className={fieldInputCls}
                inputMode="decimal"
                placeholder="0"
                value={used}
                onChange={(e) => setUsed(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
              <select
                value={usedUnit}
                onChange={(e) => setUsedUnit(e.target.value)}
                aria-label="Used unit"
                className="bg-transparent outline-none text-pine text-base font-sans cursor-pointer"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </BoxField>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            aria-label={editing ? 'Save material' : 'Add material'}
            className="w-14 h-14 self-center rounded-full bg-pear flex items-center justify-center shrink-0 hover:bg-pear/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {editing ? (
              <Check size={22} className="text-pine" strokeWidth={3} />
            ) : (
              <Plus size={22} className="text-pine" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Per-unit + per-product readout */}
        {draftPerUnit > 0 && (
          <p className="type-body text-sm text-pine/60">
            ≈ <strong className="font-semibold text-pine">${draftPerUnit.toFixed(2)}</strong> per {unit}
            {nUsed > 0 && (
              <>
                {' '}· <strong className="font-semibold text-pine">${draftLine.toFixed(2)}</strong> per product
              </>
            )}
          </p>
        )}
      </div>

      {/* Material list */}
      {materials.length > 0 && (
        <div className="mt-8">
          {materials.map((m, i) => {
            const isEditing = m.id === editingId
            const per = perUnitCost(m)
            return (
              <div
                key={m.id}
                className={cn(
                  'flex items-center gap-4 py-4 px-3 -mx-3 rounded-xl transition-colors',
                  i > 0 && 'border-t border-pine/10',
                  isEditing && 'bg-candy/10',
                )}
              >
                <span className="w-11 h-11 rounded-full bg-candy/40 flex items-center justify-center shrink-0">
                  <Package size={18} className="text-pine" strokeWidth={2} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="type-third text-base normal-case tracking-normal text-pine">{m.name}</p>
                  <p className="type-body text-sm">
                    {m.used} {m.usedUnit ?? m.unit} · ${per.toFixed(2)}/{m.unit}
                  </p>
                </div>
                <span className="type-secondary text-lg">${materialLineCost(m).toFixed(2)}</span>
                <button
                  type="button"
                  aria-label={`Edit ${m.name}`}
                  onClick={() => startEdit(m)}
                  className="p-1 text-pine/40 hover:text-pine transition-colors"
                >
                  <Pencil size={16} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${m.name}`}
                  onClick={() => {
                    if (m.id === editingId) resetForm()
                    onRemove(m.id)
                  }}
                  className="p-1 text-poppy hover:text-poppy/70 transition-colors"
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Total bar */}
      <div className="mt-6 rounded-2xl bg-pine/[0.06] px-6 py-5 flex items-center justify-between">
        <span className="type-third text-base normal-case tracking-normal">Total materials</span>
        <span className="type-heading text-2xl text-pine">${total.toFixed(2)}</span>
      </div>
    </div>
  )

  return <StepLayout left={left} right={right} />
}

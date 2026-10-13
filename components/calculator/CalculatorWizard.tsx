'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { WizardFrame } from '@/components/calculator/wizard/WizardFrame'
import { CATEGORIES, CategoryStep, type CategoryId } from '@/components/calculator/wizard/CategoryStep'
import { MaterialsStep, materialLineCost, type Material } from '@/components/calculator/wizard/MaterialsStep'
import { OverheadStep } from '@/components/calculator/wizard/OverheadStep'
import { LabourStep, type Task } from '@/components/calculator/wizard/LabourStep'
import { CalculatingStep } from '@/components/calculator/wizard/CalculatingStep'
import { SignupGateStep } from '@/components/calculator/wizard/SignupGateStep'
import { calcPricing } from '@/components/calculator/calc'

const TOTAL_STEPS = 6

// Average monthly overhead per category (used to pre-fill step 3).
const OVERHEAD_AVG: Record<CategoryId, number> = {
  soap: 160, jewelry: 120, candles: 180, pottery: 220,
  clothing: 150, food: 200, art: 130, other: 150,
}

let _id = 0
const nextId = () => ++_id

// Example starter materials per category (placeholders — the maker edits/removes them).
// cost = purchase price, qty = how much that buys, used = amount per one product.
const CATEGORY_MATERIALS: Record<CategoryId, Omit<Material, 'id'>[]> = {
  soap: [
    { name: 'Olive oil', cost: 12, qty: 48, unit: 'oz', used: 8 }, // $0.25/oz × 8 = $2.00
    { name: 'Lye', cost: 8, qty: 16, unit: 'oz', used: 2 }, // $0.50/oz × 2 = $1.00
    { name: 'Essential oil', cost: 12, qty: 4, unit: 'oz', used: 0.5 }, // $3.00/oz × 0.5 = $1.50
    { name: 'Mold + label', cost: 6, qty: 12, unit: 'ea', used: 1 }, // $0.50 × 1 = $0.50
  ],
  candles: [
    { name: 'Coconut wax', cost: 24, qty: 128, unit: 'oz', used: 8 }, // $0.1875/oz × 8 = $1.50
    { name: 'Fragrance oil', cost: 12, qty: 4, unit: 'oz', used: 0.5 }, // $3.00/oz × 0.5 = $1.50
    { name: 'Wick + jar', cost: 20, qty: 10, unit: 'ea', used: 1 }, // $2.00 × 1 = $2.00
  ],
  jewelry: [
    { name: 'Beads', cost: 10, qty: 100, unit: 'ea', used: 20 }, // $0.10 × 20 = $2.00
    { name: 'Wire', cost: 8, qty: 120, unit: 'in', used: 12 }, // $0.0667/in × 12 = $0.80
    { name: 'Clasp', cost: 7, qty: 10, unit: 'ea', used: 1 }, // $0.70 × 1 = $0.70
  ],
  pottery: [
    { name: 'Clay', cost: 18, qty: 10, unit: 'lb', used: 1 }, // $1.80/lb × 1 = $1.80
    { name: 'Glaze', cost: 12, qty: 20, unit: 'oz', used: 2 }, // $0.60/oz × 2 = $1.20
  ],
  clothing: [
    { name: 'Fabric', cost: 12, qty: 3, unit: 'yd', used: 1 }, // $4.00/yd × 1 = $4.00
    { name: 'Thread', cost: 3, qty: 10, unit: 'ea', used: 1 }, // $0.30 × 1 = $0.30
    { name: 'Buttons', cost: 5, qty: 40, unit: 'ea', used: 4 }, // $0.125 × 4 = $0.50
  ],
  food: [
    { name: 'Flour', cost: 4, qty: 80, unit: 'oz', used: 8 }, // $0.05/oz × 8 = $0.40
    { name: 'Butter', cost: 6, qty: 16, unit: 'oz', used: 4 }, // $0.375/oz × 4 = $1.50
    { name: 'Sugar', cost: 3, qty: 32, unit: 'oz', used: 4 }, // $0.09375/oz × 4 = $0.375
    { name: 'Packaging', cost: 6, qty: 10, unit: 'ea', used: 1 }, // $0.60 × 1 = $0.60
  ],
  art: [
    { name: 'Canvas', cost: 3.5, qty: 1, unit: 'ea', used: 1 }, // $3.50 × 1 = $3.50
    { name: 'Paint', cost: 20, qty: 20, unit: 'oz', used: 2 }, // $1.00/oz × 2 = $2.00
    { name: 'Varnish', cost: 8, qty: 10, unit: 'oz', used: 1 }, // $0.80/oz × 1 = $0.80
  ],
  other: [
    { name: 'Main material', cost: 3, qty: 1, unit: 'ea', used: 1 }, // $3.00
    { name: 'Packaging', cost: 1, qty: 1, unit: 'ea', used: 1 }, // $1.00
  ],
}

function exampleMaterials(category: CategoryId): Material[] {
  return CATEGORY_MATERIALS[category].map((m) => ({ ...m, id: nextId() }))
}

const SEED_TASKS: Task[] = [
  { id: nextId(), name: 'Mixing & pouring', mins: 10, icon: 'wine' },
  { id: nextId(), name: 'Cure & cut', mins: 6, icon: 'box' },
  { id: nextId(), name: 'Packaging', mins: 4, icon: 'gift' },
]

type WizardState = {
  category: CategoryId | null
  materials: Material[]
  materialsTouched: boolean // once the maker edits materials, stop auto-seeding from category
  overhead: number | null // null = use the category average
  itemsPerMonth: number
  tasks: Task[]
  hourlyRate: number
  marginPct: number
  wholesaleOn: boolean
  wholesalePct: number // % the store keeps
  email: string
}

export function CalculatorWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [state, setState] = useState<WizardState>({
    category: null,
    materials: [],
    materialsTouched: false,
    overhead: null,
    itemsPerMonth: 40,
    tasks: SEED_TASKS,
    hourlyRate: 25,
    marginPct: 54,
    wholesaleOn: true,
    wholesalePct: 50,
    email: '',
  })

  const set = (patch: Partial<WizardState>) => setState((s) => ({ ...s, ...patch }))
  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const back = () => (step === 1 ? router.push('/price') : setStep((s) => s - 1))

  // ── Derived values ──────────────────────────────────────────────────────────
  const categoryAvg = state.category ? OVERHEAD_AVG[state.category] : 150
  const categoryLabel = (CATEGORIES.find((c) => c.id === state.category)?.label ?? 'handmade').toLowerCase()
  const presetNoRent = Math.max(40, categoryAvg - 100)
  const overheadVal = state.overhead ?? categoryAvg

  const materialsTotal = state.materials.reduce((s, m) => s + materialLineCost(m), 0)
  const totalMins = state.tasks.reduce((s, t) => s + t.mins, 0)
  const labourPerItem = (totalMins / 60) * state.hourlyRate
  const overheadPerItem = state.itemsPerMonth > 0 ? overheadVal / state.itemsPerMonth : 0

  const pricing = calcPricing({ materialsTotal, labourPerItem, overheadPerItem, marginPct: state.marginPct })
  const wholesale = Math.round(pricing.retail * (1 - state.wholesalePct / 100))

  // Step 5 — animated "calculating" screen (bare, no footer); auto-advances to step 6.
  if (step === 5) {
    return (
      <CalculatingStep
        materials={pricing.materials}
        labour={pricing.labour}
        overhead={pricing.overhead}
        fees={pricing.fees}
        hourlyRate={state.hourlyRate}
        onDone={() => setStep(6)}
      />
    )
  }

  // ── Per-step config ─────────────────────────────────────────────────────────
  let content: React.ReactNode
  let nextLabel = 'Continue'
  let nextVariant: 'pear' | 'primary' = 'pear'
  let nextDisabled = false
  let hasNext = true

  if (step === 1) {
    content = (
      <CategoryStep
        value={state.category}
        onChange={(category) =>
          setState((s) => ({
            ...s,
            category,
            // Swap in that category's example materials — unless the maker has already edited theirs.
            materials: s.materialsTouched ? s.materials : exampleMaterials(category),
          }))
        }
      />
    )
    nextLabel = "Let's go"
    nextDisabled = !state.category
  } else if (step === 2) {
    content = (
      <MaterialsStep
        materials={state.materials}
        onAdd={(m) =>
          setState((s) => ({
            ...s,
            materials: [...s.materials, { ...m, id: nextId() }],
            materialsTouched: true,
          }))
        }
        onUpdate={(id, m) =>
          setState((s) => ({
            ...s,
            materials: s.materials.map((x) => (x.id === id ? { ...m, id } : x)),
            materialsTouched: true,
          }))
        }
        onRemove={(id) =>
          setState((s) => ({
            ...s,
            materials: s.materials.filter((m) => m.id !== id),
            materialsTouched: true,
          }))
        }
      />
    )
    nextDisabled = state.materials.length === 0
  } else if (step === 3) {
    content = (
      <OverheadStep
        categoryLabel={categoryLabel}
        overhead={overheadVal}
        onOverheadChange={(overhead) => set({ overhead })}
        items={state.itemsPerMonth}
        onItemsChange={(itemsPerMonth) => set({ itemsPerMonth })}
        presetTypical={categoryAvg}
        presetNoRent={presetNoRent}
      />
    )
  } else if (step === 4) {
    content = (
      <LabourStep
        tasks={state.tasks}
        hourlyRate={state.hourlyRate}
        onRateChange={(hourlyRate) => set({ hourlyRate })}
        onAddTask={() => {
          const id = nextId()
          setState((s) => ({
            ...s,
            tasks: [...s.tasks, { id, name: 'New task', mins: 5, icon: 'clock' }],
          }))
          return id
        }}
        onUpdateTask={(id, patch) =>
          setState((s) => ({
            ...s,
            tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
          }))
        }
        onRemoveTask={(id) =>
          setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }))
        }
      />
    )
  } else {
    // Step 6 — sign-up gate: price is blurred until they submit an email, then revealed.
    content = (
      <SignupGateStep
        retail={Math.round(pricing.retail)}
        cost={pricing.totalCost}
        marginPct={state.marginPct}
        wholesale={wholesale}
        email={state.email}
        onEmailChange={(email) => set({ email })}
        onSubmit={async (consent) => {
          try {
            await fetch('/api/lead', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: state.email,
                consent,
                category: CATEGORIES.find((c) => c.id === state.category)?.label ?? 'Other',
                retail: Math.round(pricing.retail),
                cost: pricing.totalCost,
                marginPct: state.marginPct,
                wholesale,
              }),
            })
          } catch (err) {
            // Never hold their price hostage to a network blip.
            console.error('lead save failed', err)
          }
        }}
      />
    )
    hasNext = false
  }

  const footer = hasNext ? (
    <Button
      variant={nextVariant}
      size="lg"
      withChevron
      className="w-full md:w-auto md:min-w-[240px]"
      disabled={nextDisabled}
      onClick={next}
    >
      {nextLabel}
    </Button>
  ) : null

  // Step 6 goes back to Labour (step 4), skipping the transient calculating screen.
  const onBack = step === 6 ? () => setStep(4) : back

  return (
    <WizardFrame step={step} totalSteps={TOTAL_STEPS} onBack={onBack} footer={footer}>
      {content}
    </WizardFrame>
  )
}

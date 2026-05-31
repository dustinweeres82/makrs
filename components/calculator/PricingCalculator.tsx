'use client'
import { useReducer } from 'react'
import { Plus, Trash2, AlertTriangle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type Currency = 'USD' | 'CAD'
type Platform = 'etsy' | 'custom' | 'none'

interface Material  { id: number; name: string; qty: number; cost: number }
interface LabourRow { id: number; name: string; mins: number; units: number; rate: number }
interface OhRow     { id: number; type: string; monthlyCost: number }

interface State {
  currency:    Currency
  platform:    Platform
  productName: string
  materials:   Material[]
  labour:      LabourRow[]
  overhead:    OhRow[]
  monthlyUnits: number
  marginPct:   number
  wholesaleOn: boolean
  wholesalePct: number
}

// Derived unlock state — everything cascades when materials.length > 0
function deriveUnlocks(s: State) {
  const unlocked = s.materials.length > 0
  return { labourOpen: unlocked, overheadOpen: unlocked, marginOpen: unlocked, wholesaleOpen: unlocked }
}

type Action =
  | { type: 'SET_CURRENCY';      currency: Currency }
  | { type: 'SET_PLATFORM';      platform: Platform }
  | { type: 'SET_PRODUCT_NAME';  name: string }
  | { type: 'ADD_MATERIAL' }
  | { type: 'REMOVE_MATERIAL';   id: number }
  | { type: 'UPDATE_MATERIAL';   id: number; field: keyof Material; value: string | number }
  | { type: 'ADD_LABOUR' }
  | { type: 'REMOVE_LABOUR';     id: number }
  | { type: 'UPDATE_LABOUR';     id: number; field: keyof LabourRow; value: string | number }
  | { type: 'ADD_OVERHEAD' }
  | { type: 'REMOVE_OVERHEAD';   id: number }
  | { type: 'UPDATE_OVERHEAD';   id: number; field: keyof OhRow; value: string | number }
  | { type: 'SET_MONTHLY_UNITS'; value: number }
  | { type: 'SET_MARGIN';        pct: number }
  | { type: 'TOGGLE_WHOLESALE' }
  | { type: 'SET_WHOLESALE_PCT'; pct: number }

let _id = 0
const nextId = () => ++_id

const OVERHEAD_TYPES = [
  { value: 'rent',       label: 'Studio rent'      },
  { value: 'electricity',label: 'Electricity'       },
  { value: 'internet',   label: 'Internet'          },
  { value: 'insurance',  label: 'Insurance'         },
  { value: 'software',   label: 'Software / apps'   },
  { value: 'tools',      label: 'Tools & equipment' },
  { value: 'marketing',  label: 'Marketing'         },
  { value: 'packaging',  label: 'Packaging supplies'},
  { value: 'shipping',   label: 'Shipping supplies' },
  { value: 'other',      label: 'Other'             },
]

const initialMaterial = (): Material => ({ id: nextId(), name: '', qty: 1, cost: 0 })
const initialLabour   = (currency: Currency): LabourRow => ({
  id: nextId(), name: '', mins: 30, units: 1, rate: currency === 'CAD' ? 30 : 25,
})

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CURRENCY':   return { ...state, currency: action.currency }
    case 'SET_PLATFORM':   return { ...state, platform: action.platform }
    case 'SET_PRODUCT_NAME': return { ...state, productName: action.name }

    case 'ADD_MATERIAL': {
      const materials = [...state.materials, initialMaterial()]
      return { ...state, materials }
    }
    case 'REMOVE_MATERIAL':
      return { ...state, materials: state.materials.filter(m => m.id !== action.id) }
    case 'UPDATE_MATERIAL':
      return {
        ...state,
        materials: state.materials.map(m =>
          m.id === action.id ? { ...m, [action.field]: action.value } : m
        ),
      }

    case 'ADD_LABOUR': {
      const labour = [...state.labour, initialLabour(state.currency)]
      return { ...state, labour }
    }
    case 'REMOVE_LABOUR':
      return { ...state, labour: state.labour.filter(r => r.id !== action.id) }
    case 'UPDATE_LABOUR':
      return {
        ...state,
        labour: state.labour.map(r =>
          r.id === action.id ? { ...r, [action.field]: action.value } : r
        ),
      }

    case 'ADD_OVERHEAD': {
      const overhead = [...state.overhead, { id: nextId(), type: 'rent', monthlyCost: 0 }]
      return { ...state, overhead }
    }
    case 'REMOVE_OVERHEAD':
      return { ...state, overhead: state.overhead.filter(r => r.id !== action.id) }
    case 'UPDATE_OVERHEAD':
      return {
        ...state,
        overhead: state.overhead.map(r =>
          r.id === action.id ? { ...r, [action.field]: action.value } : r
        ),
      }

    case 'SET_MONTHLY_UNITS': return { ...state, monthlyUnits: Math.max(1, action.value) }
    case 'SET_MARGIN':        return { ...state, marginPct: action.pct }
    case 'TOGGLE_WHOLESALE':  return { ...state, wholesaleOn: !state.wholesaleOn }
    case 'SET_WHOLESALE_PCT': return { ...state, wholesalePct: action.pct }
    default: return state
  }
}

const init: State = {
  currency: 'USD', platform: 'etsy', productName: '',
  materials: [initialMaterial()],
  labour: [], overhead: [],
  monthlyUnits: 50, marginPct: 50,
  wholesaleOn: false, wholesalePct: 50,
}

// ─── Math (Approach B) ────────────────────────────────────────────────────────

function calcRetail(totalCost: number, margin: number, platform: Platform) {
  let pctFees = 0, flatFees = 0
  if (platform === 'etsy') { pctFees = 0.095; flatFees = 0.45 }
  const retail = (totalCost + flatFees) / (1 - margin - pctFees)
  const feesTotal = retail * pctFees + flatFees
  const profit = retail - totalCost - feesTotal
  return { retail, feesTotal, profit, effMargin: profit / retail }
}

function matTotal(ms: Material[]) { return ms.reduce((s, m) => s + m.qty * m.cost, 0) }
function labCPU(r: LabourRow)     { return r.units > 0 ? (r.mins / 60 / r.units) * r.rate : 0 }
function labTotal(rows: LabourRow[]) { return rows.reduce((s, r) => s + labCPU(r), 0) }
function ohCPU(r: OhRow, units: number) { return units > 0 ? r.monthlyCost / units : 0 }
function ohTotal(rows: OhRow[], units: number) { return rows.reduce((s, r) => s + ohCPU(r, units), 0) }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number, currency: Currency) {
  return (currency === 'CAD' ? 'CA' : '') + '$' + Math.abs(n).toFixed(2)
}

function marginColor(pct: number) {
  if (pct < 30) return '#E8A820'
  if (pct < 50) return '#CCD580'
  return '#5a8a1a'
}
function marginHint(pct: number) {
  if (pct < 30) return { text: '30% is the danger zone. sustainable makers need 50%+.', color: 'text-honey' }
  if (pct < 50) return { text: 'okay, but 50%+ is the target.', color: 'text-pine/70' }
  return { text: 'solid. this is where you want to be.', color: 'text-[#5a8a1a]' }
}

// ─── Shared UI primitives ────────────────────────────────────────────────────

function SectionBadge({ variant, children }: { variant: 'required'|'optional'|'next'; children: string }) {
  return (
    <span className={cn(
      'text-[11px] font-medium px-2 py-0.5 rounded-full',
      variant === 'required' && 'bg-candy text-pine',
      variant === 'optional' && 'bg-salt text-pine/40 border border-pine/10',
      variant === 'next'     && 'bg-cornflower text-pine',
    )}>
      {children}
    </span>
  )
}

function MiniLabel({ children }: { children: string }) {
  return <p className="text-[11px] font-medium text-pine/40 mb-1">{children}</p>
}

function MiniInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border border-pine/20 rounded-md px-2 py-1.5 text-[13px] text-pine bg-white focus:outline-none focus:border-pine font-sans"
    />
  )
}

function MiniSelect(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="w-full border border-pine/20 rounded-md px-2 py-1.5 text-[13px] text-pine bg-white focus:outline-none focus:border-pine font-sans cursor-pointer"
    />
  )
}

function DelBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="p-1.5 rounded text-pine/30 hover:text-poppy hover:bg-poppy/8 transition-colors"
    >
      <Trash2 size={14} strokeWidth={2} />
    </button>
  )
}

function AddBtn({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 border-[1.5px] border-pine text-pine text-xs font-semibold rounded-md hover:bg-pine hover:text-white transition-colors font-sans"
    >
      <Plus size={12} strokeWidth={2.5} />
      {children}
    </button>
  )
}

function SectionTotal({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-right text-[13px] font-semibold text-pine mt-2.5 pt-2 border-t border-pine/10">
      {label}: <span className="text-poppy">{value}</span>
    </p>
  )
}

function LockedHint({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 text-xs text-pine/40">
      <ChevronDown size={14} strokeWidth={2} />
      {children}
    </div>
  )
}

// ─── Calculator sections ──────────────────────────────────────────────────────

function MaterialsSection({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const total = matTotal(state.materials)
  const hasRows = state.materials.length > 0

  return (
    <Section>
      <SectionHead
        title="Materials"
        subtitle="what goes into one product"
        badge={<SectionBadge variant="required">required</SectionBadge>}
      />
      <div className="px-4 pb-4">
        {state.materials.map(m => (
          <div key={m.id} className="grid grid-cols-[1fr_60px_80px_28px] gap-1.5 items-end mb-2">
            <div>
              <MiniLabel>item</MiniLabel>
              <MiniInput
                type="text" placeholder="e.g. lavender oil" value={m.name}
                onChange={e => dispatch({ type: 'UPDATE_MATERIAL', id: m.id, field: 'name', value: e.target.value })}
              />
            </div>
            <div>
              <MiniLabel>qty</MiniLabel>
              <MiniInput
                type="number" value={m.qty} min={0.001} step={0.1}
                onChange={e => dispatch({ type: 'UPDATE_MATERIAL', id: m.id, field: 'qty', value: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <MiniLabel>unit cost ($)</MiniLabel>
              <MiniInput
                type="number" value={m.cost} min={0} step={0.01}
                onChange={e => dispatch({ type: 'UPDATE_MATERIAL', id: m.id, field: 'cost', value: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <DelBtn onClick={() => dispatch({ type: 'REMOVE_MATERIAL', id: m.id })} label="remove material" />
          </div>
        ))}
        <AddBtn onClick={() => dispatch({ type: 'ADD_MATERIAL' })}>Add material</AddBtn>
        {hasRows && total > 0 && (
          <SectionTotal label="Materials" value={fmt(total, state.currency)} />
        )}
      </div>
    </Section>
  )
}

function LabourSection({ state, dispatch, unlocked }: { state: State; dispatch: React.Dispatch<Action>; unlocked: boolean }) {
  const floor = state.currency === 'CAD' ? 25 : 20
  const total = labTotal(state.labour)
  const locked = !unlocked

  return (
    <Section locked={locked} upcoming={locked}>
      <SectionHead
        title="Labour"
        subtitle="your time matters. pay yourself."
        badge={locked
          ? <SectionBadge variant="next">up next</SectionBadge>
          : <SectionBadge variant="optional">optional</SectionBadge>
        }
      />
      {locked
        ? <LockedHint>add at least one material to unlock</LockedHint>
        : (
          <div className="px-4 pb-4">
            {state.labour.map(r => {
              const cpu = labCPU(r)
              const belowFloor = r.rate > 0 && r.rate < floor
              return (
                <div key={r.id} className="bg-salt rounded-lg p-2.5 mb-2 border border-pine/10">
                  <div className="grid grid-cols-[1fr_68px_68px_76px] gap-1.5 items-end">
                    <div>
                      <MiniLabel>task name</MiniLabel>
                      <MiniInput
                        type="text" placeholder="e.g. mixing" value={r.name}
                        onChange={e => dispatch({ type: 'UPDATE_LABOUR', id: r.id, field: 'name', value: e.target.value })}
                      />
                    </div>
                    <div>
                      <MiniLabel>time (mins)</MiniLabel>
                      <MiniInput
                        type="number" value={r.mins} min={1} step={5}
                        onChange={e => dispatch({ type: 'UPDATE_LABOUR', id: r.id, field: 'mins', value: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <MiniLabel>units made</MiniLabel>
                      <MiniInput
                        type="number" value={r.units} min={1} step={1}
                        onChange={e => dispatch({ type: 'UPDATE_LABOUR', id: r.id, field: 'units', value: parseFloat(e.target.value) || 1 })}
                      />
                    </div>
                    <div>
                      <MiniLabel>$/hr</MiniLabel>
                      <MiniInput
                        type="number" value={r.rate} min={0} step={1}
                        onChange={e => dispatch({ type: 'UPDATE_LABOUR', id: r.id, field: 'rate', value: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-pine/20">
                    <div>
                      {belowFloor
                        ? <span className="text-[11px] text-honey flex items-center gap-1">
                            <AlertTriangle size={11} strokeWidth={2} /> below min wage. sure?
                          </span>
                        : <span className="text-[11px] text-pine/40">cost per unit</span>
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-pine bg-white border border-pine/20 rounded-full px-2.5 py-0.5">
                        {fmt(cpu, state.currency)}<span className="text-[10px] font-normal text-pine/40"> / unit</span>
                      </span>
                      <DelBtn onClick={() => dispatch({ type: 'REMOVE_LABOUR', id: r.id })} label="remove task" />
                    </div>
                  </div>
                </div>
              )
            })}
            <AddBtn onClick={() => dispatch({ type: 'ADD_LABOUR' })}>Add task</AddBtn>
            {state.labour.length > 0 && total > 0 && (
              <SectionTotal label="Labour" value={fmt(total, state.currency)} />
            )}
          </div>
        )
      }
    </Section>
  )
}

function OverheadSection({ state, dispatch, unlocked }: { state: State; dispatch: React.Dispatch<Action>; unlocked: boolean }) {
  const locked = !unlocked
  const total = ohTotal(state.overhead, state.monthlyUnits)

  return (
    <Section locked={locked} upcoming={locked}>
      <SectionHead
        title="Overhead"
        subtitle="the costs that keep the lights on"
        badge={<SectionBadge variant="optional">optional</SectionBadge>}
      />
      {locked
        ? <LockedHint>unlocks after labour</LockedHint>
        : (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 bg-salt rounded-lg px-3 py-2.5 mb-3 border border-pine/10">
              <p className="text-xs text-pine/70 flex-1">How many units do you make per month? Used to split overhead across products.</p>
              <div className="flex items-center gap-1.5">
                <input
                  type="number" value={state.monthlyUnits} min={1} step={1}
                  onChange={e => dispatch({ type: 'SET_MONTHLY_UNITS', value: parseFloat(e.target.value) || 1 })}
                  className="w-16 text-center border border-pine/20 rounded-md px-2 py-1 text-sm font-semibold text-pine bg-white focus:outline-none focus:border-pine font-sans"
                />
                <span className="text-xs text-pine/40">units/mo</span>
              </div>
            </div>

            {state.overhead.map(r => {
              const cpu = ohCPU(r, state.monthlyUnits)
              return (
                <div key={r.id} className="bg-salt rounded-lg p-2.5 mb-2 border border-pine/10">
                  <div className="grid grid-cols-[1fr_100px_100px] gap-2 items-end">
                    <div>
                      <MiniLabel>type</MiniLabel>
                      <MiniSelect
                        value={r.type}
                        onChange={e => dispatch({ type: 'UPDATE_OVERHEAD', id: r.id, field: 'type', value: e.target.value })}
                      >
                        {OVERHEAD_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </MiniSelect>
                    </div>
                    <div>
                      <MiniLabel>cost per month ($)</MiniLabel>
                      <MiniInput
                        type="number" value={r.monthlyCost} min={0} step={1}
                        onChange={e => dispatch({ type: 'UPDATE_OVERHEAD', id: r.id, field: 'monthlyCost', value: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <MiniLabel>per unit</MiniLabel>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-pine bg-white border border-pine/20 rounded-full px-2.5 py-1">
                          {fmt(cpu, state.currency)}
                        </span>
                        <DelBtn onClick={() => dispatch({ type: 'REMOVE_OVERHEAD', id: r.id })} label="remove overhead" />
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-pine/40 mt-1.5">
                    {fmt(r.monthlyCost, state.currency)}/mo ÷ {state.monthlyUnits} units = <strong>{fmt(cpu, state.currency)}</strong> per unit
                  </p>
                </div>
              )
            })}
            <AddBtn onClick={() => dispatch({ type: 'ADD_OVERHEAD' })}>Add overhead</AddBtn>
            {state.overhead.length > 0 && total > 0 && (
              <SectionTotal label="Overhead per unit" value={fmt(total, state.currency)} />
            )}
          </div>
        )
      }
    </Section>
  )
}

function MarginSection({ state, dispatch, unlocked }: { state: State; dispatch: React.Dispatch<Action>; unlocked: boolean }) {
  const locked = !unlocked
  const hint = marginHint(state.marginPct)
  const mult = state.marginPct > 0 ? (1 / (1 - state.marginPct / 100)).toFixed(1) : '1.0'

  return (
    <Section locked={locked} upcoming={locked}>
      <SectionHead
        title="Margin"
        subtitle="your profit slice, after all costs"
        badge={<SectionBadge variant="required">required</SectionBadge>}
      />
      {locked
        ? <LockedHint>the main event. unlocks after overhead.</LockedHint>
        : (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-poppy">{state.marginPct}%</span>
              <span className="text-xs text-pine/40">retail will be {mult}× your cost</span>
            </div>
            <input
              type="range" min={0} max={95} value={state.marginPct}
              onChange={e => dispatch({ type: 'SET_MARGIN', pct: parseInt(e.target.value) })}
              className="w-full accent-poppy mb-2"
            />
            <div className="h-1 rounded-full bg-pine/10 overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${state.marginPct}%`, background: marginColor(state.marginPct) }}
              />
            </div>
            <p className={cn('text-xs mt-1.5', hint.color)}>{hint.text}</p>
          </div>
        )
      }
    </Section>
  )
}

function WholesaleSection({ state, dispatch, unlocked }: { state: State; dispatch: React.Dispatch<Action>; unlocked: boolean }) {
  const locked = !unlocked

  return (
    <Section locked={locked}>
      <div
        className={cn('flex items-center gap-3 px-4 py-3', !locked && 'cursor-pointer')}
        onClick={locked ? undefined : () => dispatch({ type: 'TOGGLE_WHOLESALE' })}
      >
        {/* toggle */}
        <div className={cn(
          'w-8 h-[18px] rounded-full relative transition-colors duration-200 shrink-0',
          state.wholesaleOn ? 'bg-poppy' : 'bg-pine/20'
        )}>
          <div className={cn(
            'w-3.5 h-3.5 bg-white rounded-full absolute top-[2px] transition-all duration-200',
            state.wholesaleOn ? 'left-[18px]' : 'left-[2px]'
          )} />
        </div>
        <span className="text-sm font-medium text-pine">Selling wholesale too?</span>
      </div>
      {state.wholesaleOn && (
        <div className="px-4 pb-4 pt-0">
          <div>
            <MiniLabel>wholesale % of retail</MiniLabel>
            <MiniInput
              type="number" value={state.wholesalePct} min={30} max={70} style={{ width: 120 }}
              onChange={e => dispatch({ type: 'SET_WHOLESALE_PCT', pct: parseFloat(e.target.value) || 50 })}
            />
          </div>
        </div>
      )}
    </Section>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ children, locked, upcoming }: {
  children: React.ReactNode; locked?: boolean; upcoming?: boolean
}) {
  return (
    <div className={cn(
      'rounded-xl border overflow-hidden',
      locked && upcoming ? 'opacity-45 pointer-events-none bg-salt border-dashed border-pine/10'
        : locked ? 'opacity-45 pointer-events-none bg-white border-pine/20'
        : 'bg-white border-pine/20'
    )}>
      {children}
    </div>
  )
}

function SectionHead({ title, subtitle, badge }: { title: string; subtitle: string; badge: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-pine">{title}</p>
        <p className="text-xs text-pine/40 mt-0.5">{subtitle}</p>
      </div>
      {badge}
    </div>
  )
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ state }: { state: State }) {
  const mTotal = matTotal(state.materials)
  const lTotal = labTotal(state.labour)
  const oTotal = ohTotal(state.overhead, state.monthlyUnits)
  const totalCost = mTotal + lTotal + oTotal
  const hasPrice = mTotal > 0

  const margin = state.marginPct / 100
  const { retail, feesTotal, profit, effMargin } = calcRetail(totalCost, margin, state.platform)

  const wsPct = state.wholesalePct / 100
  const wsPrice = retail * wsPct
  const wsProfit = wsPrice - totalCost
  const wsMgn = wsProfit / wsPrice

  return (
    <div className="bg-white rounded-xl border border-pine/20 p-4 sticky top-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-pine/40 mb-1.5">suggested retail</p>

      {hasPrice
        ? <p className="text-[36px] font-bold text-poppy leading-none">{fmt(retail, state.currency)}</p>
        : (
          <>
            <p className="text-[36px] font-bold text-pine/20 leading-none">—</p>
            <p className="text-[13px] text-pine/40 italic mt-1">start adding materials. the math will follow.</p>
          </>
        )
      }

      {hasPrice && (
        <>
          <hr className="border-pine/10 my-3" />
          <div className="flex flex-col gap-1.5">
            <ResultRow label="total cost"       value={fmt(totalCost, state.currency)} />
            <ResultRow label="platform fees"    value={state.platform === 'none' ? '$0.00' : fmt(feesTotal, state.currency)} />
            <ResultRow label="net profit"       value={fmt(profit, state.currency)} valueClass="text-[#5a8a1a]" />
            <ResultRow label="effective margin" value={(effMargin * 100).toFixed(1) + '%'} />
          </div>

          {state.wholesaleOn && (
            <>
              <hr className="border-pine/10 my-3" />
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-pine/40 mb-1.5">wholesale</p>
              <div className="flex flex-col gap-1.5">
                <ResultRow label="wholesale price"  value={fmt(wsPrice, state.currency)} />
                <ResultRow label="wholesale margin" value={(wsMgn * 100).toFixed(1) + '%'} />
              </div>
            </>
          )}
        </>
      )}

      <button
        disabled={!hasPrice}
        className="w-full mt-4 bg-poppy text-white text-[13px] font-bold uppercase tracking-[0.06em] rounded-lg py-2.5 hover:bg-poppy/90 transition-opacity disabled:opacity-35 disabled:cursor-not-allowed font-sans"
      >
        Save my pricing
      </button>
      <p className="text-[10px] text-pine/40 mt-2.5 leading-relaxed">
        heads up — taxes are on you. this price doesn&apos;t include sales tax, GST, HST, VAT, or income tax.
      </p>
    </div>
  )
}

function ResultRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-pine/40">{label}</span>
      <span className={cn('font-semibold text-pine', valueClass)}>{value}</span>
    </div>
  )
}

// ─── Root component ───────────────────────────────────────────────────────────

export function PricingCalculator() {
  const [state, dispatch] = useReducer(reducer, init)
  const { labourOpen, overheadOpen, marginOpen, wholesaleOpen } = deriveUnlocks(state)

  return (
    <div className="p-7 grid grid-cols-[1fr_300px] gap-5 items-start max-w-[960px]">

      {/* Setup bar */}
      <div className="col-span-2 flex items-center gap-3 bg-white rounded-xl border border-pine/20 px-3.5 py-2.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-pine/40">Shop currency</span>
        <div className="flex bg-salt rounded-md p-0.5">
          {(['USD','CAD'] as Currency[]).map(c => (
            <button
              key={c}
              onClick={() => dispatch({ type: 'SET_CURRENCY', currency: c })}
              className={cn(
                'px-2.5 py-1 rounded text-[13px] font-medium transition-all',
                state.currency === c ? 'bg-pine text-white' : 'text-pine/70 hover:text-pine'
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-pine/40 ml-2">Platform</span>
        <select
          value={state.platform}
          onChange={e => dispatch({ type: 'SET_PLATFORM', platform: e.target.value as Platform })}
          className="border border-pine/20 bg-white rounded-md px-2.5 py-1 text-[13px] text-pine font-sans cursor-pointer focus:outline-none focus:border-pine"
        >
          <option value="etsy">Etsy</option>
          <option value="custom">Custom</option>
          <option value="none">No platform fees</option>
        </select>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-2.5">
        {/* Product name */}
        <Section>
          <SectionHead
            title="What do you make?"
            subtitle="just something you'll recognize"
            badge={<SectionBadge variant="optional">optional</SectionBadge>}
          />
          <div className="px-4 pb-4">
            <input
              type="text"
              placeholder="e.g. lavender soap, 4oz"
              value={state.productName}
              onChange={e => dispatch({ type: 'SET_PRODUCT_NAME', name: e.target.value })}
              className="w-full border border-pine/20 rounded-lg px-3 py-2.5 text-[15px] text-pine bg-salt placeholder:text-pine/30 focus:outline-none focus:border-pine focus:bg-white font-sans transition-colors"
            />
          </div>
        </Section>

        <MaterialsSection state={state} dispatch={dispatch} />
        <LabourSection    state={state} dispatch={dispatch} unlocked={labourOpen} />
        <OverheadSection  state={state} dispatch={dispatch} unlocked={overheadOpen} />
        <MarginSection    state={state} dispatch={dispatch} unlocked={marginOpen} />
        <WholesaleSection state={state} dispatch={dispatch} unlocked={wholesaleOpen} />
      </div>

      {/* Result */}
      <ResultCard state={state} />
    </div>
  )
}

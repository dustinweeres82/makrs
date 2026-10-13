'use client'

import { useState } from 'react'
import { Wine, Package, Gift, Clock, Pencil, Plus, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/Slider'
import { StepLayout } from './StepLayout'

export type TaskIcon = 'wine' | 'box' | 'gift' | 'clock'
export type Task = { id: number; name: string; mins: number; icon: TaskIcon }

const TASK_ICONS: Record<TaskIcon, React.ReactNode> = {
  wine: <Wine size={20} strokeWidth={2} />,
  box: <Package size={20} strokeWidth={2} />,
  gift: <Gift size={20} strokeWidth={2} />,
  clock: <Clock size={20} strokeWidth={2} />,
}

const editInputCls =
  'bg-white border border-pine/20 rounded-lg px-3 py-1.5 text-pine text-base outline-none focus:border-pine font-sans'

type LabourStepProps = {
  tasks: Task[]
  hourlyRate: number
  onRateChange: (n: number) => void
  onAddTask: () => number
  onUpdateTask: (id: number, patch: Partial<Pick<Task, 'name' | 'mins'>>) => void
  onRemoveTask: (id: number) => void
}

export function LabourStep({
  tasks,
  hourlyRate,
  onRateChange,
  onAddTask,
  onUpdateTask,
  onRemoveTask,
}: LabourStepProps) {
  const [editingId, setEditingId] = useState<number | null>(null)

  const totalMins = tasks.reduce((s, t) => s + t.mins, 0)
  const labourPerItem = (totalMins / 60) * hourlyRate

  const left = (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-3.5 h-3.5 rounded-full bg-honey" />
        <span className="type-third text-sm">Labour</span>
      </div>
      <h1 className="type-heading text-page">
        Your time<br />matters<span className="text-poppy">.</span>
      </h1>
      <p className="type-body text-base mt-4 max-w-sm">
        Just log the time. We price it for you.
      </p>
    </div>
  )

  const right = (
    <div>
      <div>
        {tasks.map((t, i) => {
          const isEditing = t.id === editingId
          return (
            <div
              key={t.id}
              className={cn('flex items-center gap-4 py-3', i > 0 && 'border-t border-pine/10')}
            >
              <span className="w-11 h-11 rounded-full bg-honey/25 flex items-center justify-center shrink-0 text-pine">
                {TASK_ICONS[t.icon]}
              </span>

              {isEditing ? (
                <>
                  <input
                    className={cn(editInputCls, 'flex-1 min-w-0')}
                    value={t.name}
                    placeholder="Task name"
                    autoFocus
                    onChange={(e) => onUpdateTask(t.id, { name: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      className={cn(editInputCls, 'w-16 text-center')}
                      inputMode="numeric"
                      value={t.mins}
                      onChange={(e) => onUpdateTask(t.id, { mins: parseInt(e.target.value) || 0 })}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                    />
                    <span className="type-third text-xs text-pine/50">min</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Done editing"
                    onClick={() => setEditingId(null)}
                    className="p-1 text-pine/50 hover:text-pine transition-colors"
                  >
                    <Check size={18} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${t.name}`}
                    onClick={() => {
                      setEditingId(null)
                      onRemoveTask(t.id)
                    }}
                    className="p-1 text-poppy hover:text-poppy/70 transition-colors"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </>
              ) : (
                <>
                  <span className="type-third text-base normal-case tracking-normal text-pine flex-1">
                    {t.name}
                  </span>
                  <span className="type-secondary text-base">{t.mins} min</span>
                  <button
                    type="button"
                    aria-label={`Edit ${t.name}`}
                    onClick={() => setEditingId(t.id)}
                    className="p-1 text-pine/40 hover:text-pine transition-colors"
                  >
                    <Pencil size={16} strokeWidth={2} />
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setEditingId(onAddTask())}
        className="w-full mt-3 rounded-2xl border-2 border-dashed border-pine/20 py-4 flex items-center justify-center gap-2 type-third text-sm text-pine/60 hover:border-pine/40 hover:text-pine transition-colors"
      >
        <Plus size={18} strokeWidth={2.5} />
        Add task
      </button>

      {/* Pay yourself */}
      <div className="mt-5 rounded-2xl bg-honey/20 px-5 py-4 text-center">
        <p className="type-third text-sm text-honey">Pay yourself</p>
        <p className="type-heading text-4xl text-pine mt-0.5">
          ${hourlyRate}
          <span className="text-xl text-pine/40">/hr</span>
        </p>
        <div className="mt-3">
          <Slider value={hourlyRate} onChange={onRateChange} min={0} max={100} fillColor="#E8A820" />
        </div>
        <p className="type-body text-sm mt-3">
          That&rsquo;s <strong className="font-bold text-pine">${labourPerItem.toFixed(2)}</strong> of
          your time in every item.
        </p>
      </div>
    </div>
  )

  return <StepLayout left={left} right={right} />
}

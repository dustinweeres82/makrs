import { AppShell } from '@/components/layout/AppShell'
import { PricingCalculator } from '@/components/calculator/PricingCalculator'

export default function CalculatorPage() {
  return (
    <AppShell title="Pricing Calculator">
      <PricingCalculator />
    </AppShell>
  )
}

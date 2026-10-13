import { SiteHeader } from '@/components/layout/SiteHeader'
import { CalculatorWizard } from '@/components/calculator/CalculatorWizard'

export default function CalculatorStartPage() {
  return (
    <div className="h-screen overflow-y-auto bg-white">
      <SiteHeader />
      <main className="max-w-6xl mx-auto pt-4 md:pt-6 pb-8 md:pb-12">
        <CalculatorWizard />
      </main>
    </div>
  )
}

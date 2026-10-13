/**
 * Two-column step layout: intro (heading + subtext) on the left, the
 * interactive content (form, grid, etc.) on the right. Stacks on mobile.
 */
export function StepLayout({
  left,
  right,
}: {
  left: React.ReactNode
  right: React.ReactNode
}) {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-start">
      <div className="md:sticky md:top-8 self-start">{left}</div>
      <div>{right}</div>
    </div>
  )
}

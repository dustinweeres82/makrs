import { cn } from '@/lib/utils'

/**
 * Brand illustration icons (public/images/icons/icon-*.svg).
 * Hand-drawn multi-tone SVGs with baked-in colours — they render as static
 * artwork and do NOT inherit `currentColor`.
 *
 * Reference an icon by its semantic name (preferred) or by its file number.
 * The number aliases stay valid, so `<Icon name="dropper-bottle" />` and
 * `<Icon name={12} />` resolve to the same file.
 */

// Ordered so the array index + 1 === the icon-N.svg file number.
export const ICON_NAMES = [
  'cinnamon',        // 1
  'lemon',           // 2
  'orange',          // 3
  'berries',         // 4
  'aloe',            // 5
  'lavender',        // 6
  'eucalyptus',      // 7
  'mint',            // 8
  'olive-branch',    // 9
  'vanilla-flower',  // 10
  'spray-bottle',    // 11
  'dropper-bottle',  // 12
  'deodorant',       // 13
  'lip-balm',        // 14
  'lotion-tube',     // 15
  'pump-bottle',     // 16
  'soap-dispenser',  // 17
  'reed-diffuser',   // 18
  'bath-salts',      // 19
  'mug',             // 20
  'perfume-spritz',  // 21
  'balm-jar',        // 22
  'cookie',          // 23
  'to-go-cup',       // 24
  'bathtub',         // 25
  'soap-bar',        // 26
  't-shirt',         // 27
  'necklace',        // 28
  'earrings',        // 29
  'baby-onesie',     // 30
  'earring',         // 31
  'bow',             // 32
  'tote-bag',        // 33
  'hat',             // 34
  'perfume-bottle',  // 35
  'ring',            // 36
  'baby-bib',        // 37
  'bracelet',        // 38
] as const

export type IconSlug = (typeof ICON_NAMES)[number]
export type IconName = IconSlug | number

export const ICON_COUNT = ICON_NAMES.length

/** Resolve a slug or number to its 1-based file number. */
function iconNumber(name: IconName): number {
  if (typeof name === 'number') return name
  return ICON_NAMES.indexOf(name) + 1
}

type IconProps = {
  name: IconName
  /** Rendered box in px (square). */
  size?: number
  /** Accessible label. Omit for purely decorative use (marks it aria-hidden). */
  alt?: string
  className?: string
}

export function Icon({ name, size = 40, alt, className }: IconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/icons/icon-${iconNumber(name)}.svg`}
      width={size}
      height={size}
      alt={alt ?? ''}
      aria-hidden={alt ? undefined : true}
      className={cn('inline-block select-none', className)}
      draggable={false}
    />
  )
}

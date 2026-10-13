// Pricing math for the calculator wizard (Approach B — margin, not markup).
// retail = baseCost / (1 - margin - feeRate); fees are a % of retail.

export const FEE_RATE = 0.099 // blended platform/payment fees (~Etsy)

export const COST_COLORS = {
  materials: '#F5A7BC', // candy
  labour: '#E8A820', // honey
  fees: '#CCD580', // pear
  overhead: '#D6B2CA', // thistle
} as const

export type Pricing = {
  materials: number
  labour: number
  overhead: number
  fees: number
  baseCost: number
  totalCost: number
  retail: number
}

export function calcPricing(input: {
  materialsTotal: number
  labourPerItem: number
  overheadPerItem: number
  marginPct: number
}): Pricing {
  const { materialsTotal, labourPerItem, overheadPerItem, marginPct } = input
  const baseCost = materialsTotal + labourPerItem + overheadPerItem
  const margin = marginPct / 100
  const denom = 1 - margin - FEE_RATE
  const retail = denom > 0.05 ? baseCost / denom : baseCost / 0.05
  const fees = retail * FEE_RATE
  return {
    materials: materialsTotal,
    labour: labourPerItem,
    overhead: overheadPerItem,
    fees,
    baseCost,
    totalCost: baseCost + fees,
    retail,
  }
}

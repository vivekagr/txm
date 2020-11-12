export interface Transaction {
  id?: number
  date: Date
  amount: number
  isCredit: boolean
  narrationText?: string
  referenceText?: string
  notes?: string
}

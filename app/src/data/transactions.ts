export interface Transaction {
  date: Date
  narrationText?: string
  referenceText?: string
  amount: number
  isCredit: boolean
}

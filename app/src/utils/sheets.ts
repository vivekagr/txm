import XLSX from 'xlsx'

import type { Transaction } from 'app/data/transactions'

import { readFileAsArrayBuffer } from './file'
import { parseDate } from './date'
import { cleanData, parseFloatString } from './data'

interface SheetCell {
  encoded?: string
  decoded?: XLSX.CellAddress
}

interface SheetHeaderRow {
  start: SheetCell
  end: SheetCell
}

type SheetTransactionRow = {
  [k: string]: string
}

interface HeaderLookupMap {
  date: string
  narration: string
  debit: string
  credit: string
  reference?: string
}

function isHeaderLookupMap(arg: Partial<HeaderLookupMap>): arg is HeaderLookupMap {
  return !!(arg && arg.date && arg.narration && arg.debit && arg.credit)
}

type StandardHeader = keyof HeaderLookupMap

// type for mapping standard header key to corresponding possible values found in user's sheets
type HeaderLookupMapOptions = Record<StandardHeader, string[]>

const HEADER_LOOKUP_MAP_OPTIONS: HeaderLookupMapOptions = {
  date: ['value dt', 'value date', 'date'],
  narration: ['narration', 'description'],
  reference: ['chq./ref.no.', 'ref no./cheque no.'],
  debit: ['withdrawal amt.', 'debit'],
  credit: ['deposit amt.', 'credit'],
}

// Builds <sheet header value> => <standard name> map
function createLookupMap(headers: string[]): HeaderLookupMap {
  const list = Object.entries(HEADER_LOOKUP_MAP_OPTIONS) as [StandardHeader, string[]][]
  const lookupMap = list.reduce(
    (
      accumulator: Partial<HeaderLookupMap>,
      [standardKey, allowedKeys]: [StandardHeader, string[]]
    ) => {
      const matchedKey = headers.find((v) => allowedKeys.indexOf(v.trim().toLowerCase()) > -1)
      if (matchedKey) {
        accumulator[standardKey] = matchedKey
      }

      return accumulator
    },
    {}
  )

  if (!isHeaderLookupMap) {
    throw Error('Sheet parsing error: unable to build header lookup map')
  }

  return lookupMap as HeaderLookupMap
}

export function extractTransactionsFromSheet(
  sheet: XLSX.Sheet
): { data: SheetTransactionRow[]; headers: string[] } {
  if (!sheet || !sheet['!ref']) {
    throw Error('Sheet parsing error: could not decode the sheet range')
  }

  const sheetRange = XLSX.utils.decode_range(sheet['!ref'])

  const header: SheetHeaderRow = {
    start: { encoded: undefined, decoded: undefined },
    end: { encoded: undefined, decoded: undefined },
  }

  // Find cell that's the header for the date column
  const headerCellIndex = Object.keys(sheet).find((k) => {
    const cellValue = sheet[k].w || sheet[k].v
    if (!cellValue) return false

    return ['date', 'txn date'].indexOf(cellValue.toString().trim().toLowerCase()) > -1
  })

  if (!headerCellIndex) {
    throw Error('Sheet parsing error: coudl not find the date header cell')
  }

  header.start.encoded = headerCellIndex
  header.start.decoded = XLSX.utils.decode_cell(headerCellIndex)

  // calculate the end cell on header row naively by just looking up sheet's last column
  header.end.decoded = {
    r: header.start.decoded.r,
    c: sheetRange.e.c,
  }
  header.end.encoded = XLSX.utils.encode_cell(header.end.decoded)

  // if the sheet's last column isn't valid for the transaction header row,
  // then iterate through the entire row to find the last valid header cell
  if (!sheet[header.end.encoded]) {
    for (let i = sheetRange.s.c; i <= sheetRange.e.c; i += 1) {
      const cell = XLSX.utils.encode_cell({ c: i, r: header.start.decoded.r })
      // if present cell is empty, set previous cell as the last header row cell
      if (!sheet[cell]) {
        header.end.decoded = { c: i - 1, r: header.start.decoded.r }
        header.end.encoded = XLSX.utils.encode_cell(header.end.decoded)
        break
      }
    }
  }

  // Assume that the last row for the entire sheet is the last transaction row
  let lastRowIndex = sheetRange.e.r

  // Vertically scan down from the header beginning cell to find the last transaction row index
  for (let { r } = header.start.decoded; r <= sheetRange.e.r; r += 1) {
    // if the cell being scanned is empty, then the previous row was the last one
    if (!sheet[XLSX.utils.encode_cell({ r, c: header.start.decoded.c })]) {
      lastRowIndex = r - 1
      break
    }
  }

  // Compute transactions cell range and return json
  const transactionsRange = XLSX.utils.encode_range({
    s: header.start.decoded,
    e: { r: lastRowIndex, c: header.end.decoded.c },
  })

  // Build array of header cell strings
  const headerRow = []
  for (let { c } = header.start.decoded; c <= header.end.decoded.c; c += 1) {
    headerRow.push(sheet[XLSX.utils.encode_cell({ c, r: header.start.decoded.r })])
  }

  return {
    data: XLSX.utils.sheet_to_json(sheet, { range: transactionsRange, raw: false }),
    headers: headerRow.map((h) => h.w || h.v),
  }
}

// Clean & transform the given transaction objects into standard transaction object format
export function transformTransactionList(
  headers: string[],
  txs: SheetTransactionRow[]
): Transaction[] {
  const headerLookupMap = createLookupMap(headers)

  // Clean out any rows * characters in date field
  const cleanedTxs = txs.filter(
    (tx: SheetTransactionRow) => !/^\s*\*+\s*$/.test(tx[headerLookupMap.date])
  )

  const transformedTxs = cleanedTxs.map((tx: SheetTransactionRow) => ({
    date: parseDate(cleanData(tx[headerLookupMap.date])),
    narrationText: cleanData(tx[headerLookupMap.narration]),
    referenceText: headerLookupMap.reference ? cleanData(tx[headerLookupMap.reference]) : null,
    amount: parseFloatString(
      cleanData(tx[headerLookupMap.debit]) || cleanData(tx[headerLookupMap.credit])
    ),
    isCredit: !!cleanData(tx[headerLookupMap.credit]),
    notes: null,
  }))

  return transformedTxs
}

export async function parseSheet(file: File): Promise<Transaction[]> {
  // read given file as ArrayBuffer
  const dataArrayBuffer = await readFileAsArrayBuffer(file)
  // read the file as workbook & get the main sheet
  const workbook = XLSX.read(dataArrayBuffer, { type: 'array', raw: true })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  // extract transaction from the sheet (that might contain non-transaction information)
  // and transform+clean it into a usable data
  const { headers, data } = extractTransactionsFromSheet(sheet)
  return transformTransactionList(headers, data)
}

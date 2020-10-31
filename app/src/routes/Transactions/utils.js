import XLSX from 'xlsx'
import { casual } from 'chrono-node'

export function extractTransactionsFromSheet(sheet) {
  const sheetRange = XLSX.utils.decode_range(sheet['!ref'])

  const header = {
    start: { encoded: null, decoded: null },
    end: { encoded: null, decoded: null },
  }

  const headerCell = Object.entries(sheet).find(([, cell]) => {
    const cellValue = cell.w || cell.v
    return cellValue && ['date', 'txn date'].indexOf(cellValue.toString().trim().toLowerCase()) > -1
  })

  if (!headerCell) {
    throw Error("Coudln't find the date header cell")
  }

  const [headerCellIndex] = headerCell
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

const HEADER_MAP = {
  date: ['value dt', 'value date', 'date'],
  narration: ['narration', 'description'],
  reference: ['chq./ref.no.', 'ref no./cheque no.'],
  debit: ['withdrawal amt.', 'debit'],
  credit: ['deposit amt.', 'credit'],
}

// Builds <sheet header value> => <standard name> map
const createLookupMap = (headers) => {
  return Object.entries(HEADER_MAP).reduce((accumulator, [standardKey, allowedKeys]) => {
    const matchedKey = headers.find((v) => allowedKeys.indexOf(v.trim().toLowerCase()) > -1)
    if (matchedKey) {
      accumulator[standardKey] = matchedKey
    }

    return accumulator
  }, {})
}

const cleanData = (s) => {
  const cleaned = (s || '').trim()
  if (cleaned === '-') return ''
  return cleaned
}

const parseFloatString = (n) => parseFloat(n.replace(/,/g, '') || 0)

const customChrono = casual.clone()
customChrono.parsers.unshift({
  pattern: () => /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/,
  extract: (context, match) => {
    let year = match[3]
    if (match[3].length === 2) {
      const todayYear = new Date().getUTCFullYear()
      const todayTwoDigitYear = todayYear % 100
      const todayTwoDigitCentury = parseInt(todayYear / 100, 10)
      const centuryToUse =
        parseInt(match[3], 10) > todayTwoDigitYear ? todayTwoDigitCentury - 1 : todayTwoDigitCentury
      year = String(centuryToUse) + match[3]
    }

    return {
      day: match[1],
      month: match[2],
      year,
    }
  },
})

// Clean & transform the given transaction objects into standard transaction object format
export function transformTransactionList(headers, txs) {
  const headerLookupMap = createLookupMap(headers)

  const transformedTxs = txs.flatMap((tx) => {
    if (/^\*+$/.test(tx[headerLookupMap.date])) return []
    return {
      date: customChrono.parseDate(cleanData(tx[headerLookupMap.date])),
      narrationText: cleanData(tx[headerLookupMap.narration]),
      referenceText: cleanData(tx[headerLookupMap.reference]),
      amount: parseFloatString(
        cleanData(tx[headerLookupMap.debit]) || cleanData(tx[headerLookupMap.credit])
      ),
      isCredit: !!cleanData(tx[headerLookupMap.credit]),
    }
  })

  return transformedTxs
}

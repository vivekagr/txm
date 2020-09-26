import XLSX from 'xlsx';
import { casual } from 'chrono-node';


export function extractTransactionsFromSheet (sheet) {
  let sheetRange = XLSX.utils.decode_range(sheet['!ref']);

  const header = {
    start: { encoded: null, decoded: null },
    end: { encoded: null, decoded: null }
  }

  // find the beginning of the transactions by looking up date header cell
  for (let cell in sheet) {
    if (!sheet.hasOwnProperty(cell) || !sheet[cell]) continue;

    let cellValue = sheet[cell].w || sheet[cell].v;
    if (!cellValue) continue;

    if (['date', 'txn date'].indexOf(cellValue.toString().trim().toLowerCase()) > -1) {
      header.start.encoded = cell;
      header.start.decoded = XLSX.utils.decode_cell(cell);
      break
    }
  }

  if (!header.start.encoded) {
    throw Error('Coudln\'t find the date header cell');
  }

  // calculate the end cell on header row naively by just looking up sheet's last column
  header.end.decoded = {
    r: header.start.decoded.r,
    c: sheetRange.e.c
  };
  header.end.encoded = XLSX.utils.encode_cell(header.end.decoded);

  // if the sheet's last column isn't valid for the transaction header row,
  // then iterate through the entire row to find the last valid header cell
  if (!sheet[header.end.encoded]) {
    for (let i = sheetRange.s.c; i <= sheetRange.e.c; i++) {
      const _cell = XLSX.utils.encode_cell({ c: i, r: header.start.decoded.r });
      // if present cell is empty, set previous cell as the last header row cell
      if (!sheet[_cell]) {
        header.end.decoded = { c: i - 1, r: header.start.decoded.r };
        header.end.encoded = XLSX.utils.encode_cell(header.end.decoded);
        break;
      }
    }
  }

  // Assume that the last row for the entire sheet is the last transaction row
  let lastRowIndex = sheetRange.e.r;

  // Vertically scan down from the header beginning cell to find the last transaction row index
  for (let r = header.start.decoded.r; r <= sheetRange.e.r; r++) {
    // if the cell being scanned is empty, then the previous row was the last one
    if (!sheet[XLSX.utils.encode_cell({ r: r, c: header.start.decoded.c })]) {
      lastRowIndex = r - 1;
      break;
    }
  }

  // Compute transactions cell range and return json
  const transactionsRange = XLSX.utils.encode_range({
    s: header.start.decoded,
    e: { r: lastRowIndex, c: header.end.decoded.c }
  });

  // Build array of header cell strings
  const headerRow = [];
  for (let c = header.start.decoded.c; c <= header.end.decoded.c; c++) {
    headerRow.push(sheet[XLSX.utils.encode_cell({ c: c, r: header.start.decoded.r })]);
  }

  return {
    data: XLSX.utils.sheet_to_json(sheet, { range: transactionsRange, raw: false }),
    headers: headerRow.map(h => h.w || h.v)
  };
}

const HEADER_MAP = {
  date: ['value dt', 'value date', 'date'],
  narration: ['narration', 'description'],
  reference: ['chq./ref.no.', 'ref no./cheque no.'],
  debit: ['withdrawal amt.', 'debit'],
  credit: ['deposit amt.', 'credit']
}

// Builds <sheet header value> => <standard name> map
const createLookupMap = (headers) => {
  const map = {};

  for (const [key, allowedValues] of Object.entries(HEADER_MAP)) {
    for (const h of headers) {
      if (allowedValues.indexOf(h.trim().toLowerCase()) > -1) {
        map[key] = h;
        break;  // break out of internal loop if match is found to prevent multiple matches
      }
    }
  }

  return map;
}

const _clean = s => {
  let _s = (s || '').trim();
  if (_s === '-') return '';
  return _s;
}

const _parseFloat = n => parseFloat(n.replace(/,/g, '') || 0);

var customChrono = casual.clone();
customChrono.parsers.unshift({
  pattern: () => /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/,
  extract: (context, match) => {
    let year = match[3];
    if (match[3].length == 2) {
      const todayYear = (new Date()).getUTCFullYear();
      const todayTwoDigitYear = todayYear % 100;
      const todayTwoDigitCentury = parseInt(todayYear / 100);
      const centuryToUse = parseInt(match[3]) > todayTwoDigitYear ? todayTwoDigitCentury-1 : todayTwoDigitCentury;
      year = String(centuryToUse) + match[3];
    }

    return {
      day: match[1],
      month: match[2],
      year: year
    }
  }
});

// Clean & transform the given transaction objects into standard transaction object format
export function transformTransactionList(headers, txs) {
  const headerLookupMap = createLookupMap(headers);

  const transformedTxs = txs.flatMap(tx => {
    if (/^\*+$/.test(tx[headerLookupMap['date']])) return []
    return {
      date: customChrono.parseDate(_clean(tx[headerLookupMap['date']])),
      narrationText: _clean(tx[headerLookupMap['narration']]),
      referenceText: _clean(tx[headerLookupMap['reference']]),
      amount: _parseFloat(_clean(tx[headerLookupMap['debit']]) || _clean(tx[headerLookupMap['credit']])),
      isCredit: !!_clean(tx[headerLookupMap['credit']])
    }
  })

  return transformedTxs
}

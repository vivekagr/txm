import { casual } from 'chrono-node'

const customChrono = casual.clone()

// Update parser with custom extract function to work with date format present in bank statements
customChrono.parsers.unshift({
  pattern: () => /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/,
  extract: (context, match) => {
    let year = match[3]
    if (match[3].length === 2) {
      const todayYear = new Date().getUTCFullYear()
      const todayTwoDigitYear = todayYear % 100
      const todayTwoDigitCentury = parseInt(String(todayYear / 100), 10)
      const centuryToUse =
        parseInt(match[3], 10) > todayTwoDigitYear ? todayTwoDigitCentury - 1 : todayTwoDigitCentury
      year = String(centuryToUse) + match[3]
    }

    return {
      day: parseInt(match[1], 10),
      month: parseInt(match[2], 10),
      year: parseInt(year, 10),
    }
  },
})

// eslint-disable-next-line import/prefer-default-export
export const parseDate = (d: string): Date => customChrono.parseDate(d)

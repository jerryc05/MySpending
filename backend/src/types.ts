export class Bank {
  id: number
  name: string
  currency: 'USD' | 'CNY'
  balance: number
  constructor(arg: {
    id: typeof Bank.prototype.id
    name: typeof Bank.prototype.name
    currency: typeof Bank.prototype.currency
    balance: typeof Bank.prototype.balance
  }) {
    this.id = arg.id
    this.name = arg.name
    this.currency = arg.currency
    this.balance = arg.balance
  }
}

export class Transaction {
  id: string
  bankId: number
  payee: string
  amount: number
  dateYear: number
  dateMonth: number
  dateDay: number
  fitid: number // financial institution transaction id
  category?: Category | null
  tags?: string[] | null
  memo?: string | null
  gen_id() {
    return `${this.bankId}/${this.fitid}`
  }
  constructor(arg: {
    bankId: typeof Transaction.prototype.bankId
    payee: typeof Transaction.prototype.payee
    amount: typeof Transaction.prototype.amount
    date: [
      typeof Transaction.prototype.dateYear,
      typeof Transaction.prototype.dateMonth,
      typeof Transaction.prototype.dateDay
    ]
    fitid: typeof Transaction.prototype.fitid
    category?: typeof Transaction.prototype.category
    tags?: typeof Transaction.prototype.tags
    memo?: typeof Transaction.prototype.memo
  }) {
    this.bankId = arg.bankId
    this.payee = arg.payee
    this.amount = arg.amount
    this.dateYear = arg.date[0]
    this.dateMonth = arg.date[1]
    this.dateDay = arg.date[2]
    this.fitid = arg.fitid
    this.category = arg.category
    this.tags = arg.tags
    this.memo = arg.memo

    this.id = this.gen_id()
  }
}

export class Category {
  name: string
  parent?: Category | null

  constructor(name: string, parent?: Category | null) {
    this.parent = parent
    this.name = name
  }

  serialize(): string {
    return `${this.parent ? this.parent.serialize() + ':' : ''}${this.name}`
  }
}

export type QfxStmtTrn = {
  DTPOSTED: string
  TRNAMT: number
  FITID: number
  NAME: string
  MEMO: string
}

export function parseQfxDt(input: string) {
  // Parse date and time
  const year = parseInt(input.slice(0, 4), 10)
  const month = parseInt(input.slice(4, 6), 10)
  const day = parseInt(input.slice(6, 8), 10)

  return [year, month, day] as [number, number, number]
}

// export function parseQfxDt(input: string) {
//   // Extract parts
//   const datePart = input.slice(0, 8)
//   const tzPartIdx = input.indexOf('[')
//   const timePart = input.slice(8, tzPartIdx)
//   const offsetPart = input.slice(tzPartIdx + 1, input.indexOf(':'))

//   // Parse date and time
//   const year = parseInt(datePart.slice(0, 4), 10)
//   const month = parseInt(datePart.slice(4, 6), 10) - 1 // Months are 0-based in JS
//   const day = parseInt(datePart.slice(6, 8), 10)
//   const hour = parseInt(timePart.slice(0, 2), 10)
//   const minute = parseInt(timePart.slice(2, 4), 10)
//   const second = parseInt(timePart.slice(4, 6), 10)

//   // Create Date object
//   let date = new Date(Date.UTC(year, month, day, hour, minute, second))

//   // Adjust for timezone offset
//   const offsetHours = parseInt(offsetPart, 10)
//   date.setHours(date.getHours() - offsetHours)

//   return date
// }

// console.log(parseQfxDt('20240127000000.000[-7:MST]'))
// console.log(parseQfxDt('20240125170000[0:UTC]'))

export function parseSTMTTRN(
  stmtTrn: string,
  bankId: typeof Transaction.prototype.bankId
) {
  const NAME_RE = /<NAME>(.+?)(?:<\/NAME>)?\s*$/m
  const TRNAMT_RE = /<TRNAMT>(.+?)(?:<\/TRNAMT>)?\s*$/m
  const DTPOSTED_RE = /<DTPOSTED>(.+?)(?:<\/DTPOSTED>)?\s*$/m
  const FITID_RE = /<FITID>(.+?)(?:<\/FITID>)?\s*$/m
  const MEMO_RE = /<MEMO>(.+?)(?:<\/MEMO>)?\s*$/m

  const memoMatches = stmtTrn.match(MEMO_RE)
  const memo: typeof Transaction.prototype.memo = memoMatches
    ? memoMatches[1]
    : undefined

  return new Transaction({
    bankId,
    payee: stmtTrn.match(NAME_RE)![1],
    amount: parseFloat(stmtTrn.match(TRNAMT_RE)![1]),
    date: parseQfxDt(stmtTrn.match(DTPOSTED_RE)![1]),
    fitid: parseInt(stmtTrn.match(FITID_RE)![1]),
    memo,
  })
}

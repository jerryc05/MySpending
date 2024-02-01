export class Bank {
  id: number
  name: string
  currency: 'USD' | 'CNY'
  balance: number
  constructor(
    id: typeof Bank.prototype.id,
    name: typeof Bank.prototype.name,
    currency: typeof Bank.prototype.currency,
    balance: typeof Bank.prototype.balance
  ) {
    this.id = id
    this.name = name
    this.currency = currency
    this.balance = balance
  }
}

export class Transaction {
  bankId: number
  payee: string
  amount: number
  datePostedYear: number
  datePostedMonth: number
  datePostedDay: number
  fitid: number // financial institution transaction id
  category?: Category | null
  tags?: string[] | null
  memo?: string | null
  id() {
    return `${this.bankId} ${this.fitid}`
  }
  constructor(
    bankId: typeof Transaction.prototype.bankId,
    payee: typeof Transaction.prototype.payee,
    amount: typeof Transaction.prototype.amount,
    datePosted: [
      typeof Transaction.prototype.datePostedYear,
      typeof Transaction.prototype.datePostedMonth,
      typeof Transaction.prototype.datePostedDay
    ],
    fitid: typeof Transaction.prototype.fitid,
    category?: typeof Transaction.prototype.category,
    tags?: typeof Transaction.prototype.tags,
    memo?: typeof Transaction.prototype.memo
  ) {
    this.bankId = bankId
    this.payee = payee
    this.amount = amount
    this.datePostedYear = datePosted[0]
    this.datePostedMonth = datePosted[1]
    this.datePostedDay = datePosted[2]
    this.fitid = fitid
    this.category = category
    this.tags = tags
    this.memo = memo
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
  const month = parseInt(input.slice(4, 6), 10) - 1 // Months are 0-based in JS
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

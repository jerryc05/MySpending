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
  fitid: string // financial institution transaction id
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

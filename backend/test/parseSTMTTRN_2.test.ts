import { expect, test } from 'bun:test'
import { Transaction } from '@/types'
import { parseSTMTTRN } from '@/utils'

const getTrans2 = (bankId: typeof Transaction.prototype.bankId) =>
  parseSTMTTRN(
    `<STMTTRN>
    <TRNTYPE>PAYMENT
    <DTPOSTED>20240122170000[0:UTC]
    <TRNAMT>-353.93
    <FITID>202400000
    <CORRECTFITID>202400000
    <CORRECTACTION>REPLACE
    <NAME>PAYPAL *EBAY US 0789372482 CA
</STMTTRN>`,
    bankId
  )

test(`${parseSTMTTRN.name} 2 constructor`, () => {
  const bankId = Math.floor(Math.random() * 1000)
  expect(getTrans2(bankId)).toEqual(
    new Transaction({
      bankId,
      payee: 'PAYPAL *EBAY US 0789372482 CA',
      amount: -353.93,
      date: [2024, 1, 22],
      fitid: '202400000',
    })
  )
})

test(`${parseSTMTTRN.name} 2 date`, () => {
  const bankId = Math.floor(Math.random() * 1000)
  expect(getTrans2(bankId).dateYear).toBe(2024)
  expect(getTrans2(bankId).dateMonth).toBe(1)
  expect(getTrans2(bankId).dateDay).toBe(22)
})

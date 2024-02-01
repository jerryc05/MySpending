import { expect, test } from 'bun:test'
import { Transaction } from '@/types'
import { parseSTMTTRN } from '@/utils'

const getTrans1 = (bankId: typeof Transaction.prototype.bankId) =>
  parseSTMTTRN(
    `<STMTTRN>
  <TRNTYPE>DEBIT</TRNTYPE>
  <DTPOSTED>20240127000000.000[-7:MST]</DTPOSTED>
  <TRNAMT>-38.62</TRNAMT>
  <FITID>320240280180000000</FITID>
  <REFNUM>320240280180000000</REFNUM>
  <NAME>KROGER ATLANTA GA</NAME>
  <MEMO>MEMO - KROGER ATLANTA GA</MEMO>
</STMTTRN>`,
    bankId
  )

test(`${parseSTMTTRN.name} 1 constructor`, () => {
  const bankId = Math.floor(Math.random() * 1000)
  expect(getTrans1(bankId)).toEqual(
    new Transaction({
      bankId,
      payee: 'KROGER ATLANTA GA',
      amount: -38.62,
      date: [2024, 1, 27],
      fitid: '320240280180000000',
      memo: 'MEMO - KROGER ATLANTA GA',
    })
  )
})

test(`${parseSTMTTRN.name} 1 date`, () => {
  const bankId = Math.floor(Math.random() * 1000)
  expect(getTrans1(bankId).dateYear).toBe(2024)
  expect(getTrans1(bankId).dateMonth).toBe(1)
  expect(getTrans1(bankId).dateDay).toBe(27)
})

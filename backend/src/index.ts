import { argv } from 'process'
import type { QfxStmtTrn } from '@/types'
import { Transaction, parseQfxDt } from '@/types'

const filename = argv[2]
const file = Bun.file(filename)
const content = await file.text()

const STMTTRN_RE = /<STMTTRN>.+?<\/STMTTRN>/gs
const stmtTrnMatches = content.match(STMTTRN_RE)

if (stmtTrnMatches) {
  const trns = stmtTrnMatches.map(stmtTrn => {
    const NAME_RE = /<NAME>(.+?)(?:<\/NAME>)?\s*$/m
    const TRNAMT_RE = /<TRNAMT>(.+?)(?:<\/TRNAMT>)?\s*$/m
    const DTPOSTED_RE = /<DTPOSTED>(.+?)(?:<\/DTPOSTED>)?\s*$/m
    const FITID_RE = /<FITID>(.+?)(?:<\/FITID>)?\s*$/m

    return new Transaction(
      0, //todo
      stmtTrn.match(NAME_RE)![1],
      parseFloat(stmtTrn.match(TRNAMT_RE)![1]),
      parseQfxDt(stmtTrn.match(DTPOSTED_RE)![1]),
      parseInt(stmtTrn.match(FITID_RE)![1])
    )
  })
  console.dir(trns)
}

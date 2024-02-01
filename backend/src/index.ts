import { argv } from 'process'
import { parseSTMTTRN } from '@/utils'

const filename = argv[2]
const file = Bun.file(filename)
const content = await file.text()

const STMTTRN_RE = /<STMTTRN>.+?<\/STMTTRN>/gs
const stmtTrnMatches = content.match(STMTTRN_RE)

if (stmtTrnMatches) {
  const trns = stmtTrnMatches.map(stmtTrn => parseSTMTTRN(stmtTrn, -1))
  console.dir(trns)
}

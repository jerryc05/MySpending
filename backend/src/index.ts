import { argv } from 'process'
import { XMLParser } from 'fast-xml-parser'
import type { QfxStmtTrn } from '@/types'
import { Transaction, parseQfxDt } from '@/types'

const filename = argv[2]
const file = Bun.file(filename)
const content = await file.text()

const banktranlistRe = new RegExp('<BANKTRANLIST>.+</BANKTRANLIST>', 's')
const banktranlistMatch_ = content.match(banktranlistRe)

if (!banktranlistMatch_) {
  throw new Error('No BANKTRANLIST found!')
}
const banktranlistMatch = banktranlistMatch_[0]

const parser = new XMLParser()
const stmtTrnObjList: QfxStmtTrn[] =
  parser.parse(banktranlistMatch).BANKTRANLIST.STMTTRN
const stmtTrnList = stmtTrnObjList.map(
  x => new Transaction(0, x.NAME, x.TRNAMT, parseQfxDt(x.DTPOSTED), x.FITID)
)
console.dir(stmtTrnList)

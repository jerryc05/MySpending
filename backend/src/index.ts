import { argv } from 'process'
import { parseSTMTTRN } from '@/utils'
import { encode } from 'cbor-x'

const filename = argv[2]
const file = Bun.file(filename)
const content = await file.text()

const STMTTRN_RE = /<STMTTRN>.+?<\/STMTTRN>/gs
const stmtTrnMatches = content.match(STMTTRN_RE)

if (!stmtTrnMatches) {
  throw new Error('No STMTTRN matched!')
}

const trns = stmtTrnMatches.map(stmtTrn => parseSTMTTRN(stmtTrn, -1))

const server = Bun.serve({
  fetch(request, server) {
    return new Response(encode(trns).toString('base64'))
  },
})

console.log(`Server running at ${server.url}`)

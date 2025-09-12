const hashTable = new Set<string>
const hashString = '0123456789abcdefghijklmnopqrstuvwxyz'

export default function generateHash(length = 32) {
  for (;;) {
    const hash = [...crypto.getRandomValues(new Uint8Array(length))].map(v => hashString[v % hashString.length]).join('')
    if (hashTable.has(hash)) continue
    hashTable.add(hash)
    return hash
  }
}

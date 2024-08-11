import sha256 from 'crypto-js/sha256.js'
const sha = (password) => {
  const hashDigest = sha256(password)
  let code = hashDigest.words
    .map((item) => {
      if (item < 0) return (4294967296 + item).toString(16)
      else return item.toString(16)
    })
    .join('')
  return code
}
export default sha

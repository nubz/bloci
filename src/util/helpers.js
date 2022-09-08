const formatNumber = num => {
  if (num) {
    const numStripped = num.toString().replace(/,/g, '')
    const numParsed = (parseFloat(numStripped) % 1 !== 0) ? Math.abs(parseFloat(numStripped).toFixed(2)) : Math.abs(parseInt(numStripped))
    return numParsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return 0
}

const sumOfProperty = (list, key) =>
  list.reduce((s, next) => {
    s += next[key]
    return s
  }, 0)

export default {
  formatNumber: formatNumber,
  sumOfProperty: sumOfProperty
}
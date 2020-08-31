// require("dotenv").config({ path: "./config/dev.env" })
const getTransactions = require("./network_info")

const getRB = async () => {
    const data = await getTransactions("txlist", process.env.RB_OPERATOR_ADDRESS)
    const successTX = data.filter (el => el.isError=== "0")
    const fromAddr = successTX.map(el => el.from)
    const fromAddrAll = [... new Set(fromAddr)] 
    return fromAddrAll
}

const getYourRB = async (address) => {
    const data = await getTransactions("txlist", process.env.RB_OPERATOR_ADDRESS)
    const successTX = data.filter (el => el.isError=== "0")
    const yrTransactions = successTX.filter(el => el.from === address)
    const txHashes = yrTransactions.map(el => el.hash)
    return txHashes
}

module.exports = { getRB, getYourRB }
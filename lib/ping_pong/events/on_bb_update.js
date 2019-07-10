const genPingPongTable = require('../util/gen_ping_pong_table')
const genPingPongTableForBBands = require('../util/gen_ping_pong_table_for_bbands')



module.exports = async (instance = {}, args = {}) => {
    const { state = {}, h = {} } = instance
    const { emit } = h
    const pingPongTableForBbands = genPingPongTableForBBands(state)
    const pingPongTable = genPingPongTable(args)


    if(!Object.is(pingPongTable, pingPongTableForBbands)) {
        await emit('exec:adjustTables', {pingPongTable, pingPongTableForBbands})
    } 
}
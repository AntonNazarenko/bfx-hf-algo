const genPingPongTable = require('../util/gen_ping_pong_table')
const genPingPongTableForBBands = require('../util/gen_ping_pong_table_for_bbands')



module.exports = async (instance = {}, args = {}) => {
    const { state = {}, h = {} } = instance

    const pingPongTableForBbands = genPingPongTableForBBands(state)
    const pingPongTable = genPingPongTable(args)


    if(!Object.compare(pingPongTable, pingPongTableForBbands)) {
        // FIRE update event
    } 
}
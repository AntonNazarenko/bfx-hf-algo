/* eslint-env mocha */
'use strict'

const assert = require('assert')
const Iceberg = require('../../lib/iceberg')
const initAO = require('../../lib/host/init_ao')
const createTestHarness = require('../../lib/testing/create_harness')

const params = {
  symbol: 'tBTCUSD',
  price: 21000,
  amount: -0.5,
  sliceAmount: -0.1,
  excessAsHidden: true,
  orderType: 'LIMIT',
  submitDelay: 150,
  cancelDelay: 150,
  _margin: false
}

describe('iceberg:exec', () => {
  it('submits initial orders on startup', (done) => {
    const instance = initAO(Iceberg, params)
    const iTest = createTestHarness(instance, Iceberg)

    iTest.on('self:submit_orders', () => {
      done()
    })

    iTest.trigger('life', 'start')
  })

  it('cancels & submits new orders when an order fills', (done) => {
    const instance = initAO(Iceberg, params)
    const iTest = createTestHarness(instance, Iceberg)
    let cancelled = false

    instance.h.debouncedSubmitOrders = () => {
      instance.h.emitSelf('submit_orders')
    }

    iTest.on('exec:order:cancel:all', () => {
      cancelled = true
    })

    iTest.on('self:submit_orders', () => {
      assert(cancelled)
      done()
    })

    iTest.trigger('orders', 'order_fill', {
      getLastFillAmount: () => { return -0.05 }
    })
  })

  it('stops when remaining amount is dust or less', (done) => {
    const instance = initAO(Iceberg, params)
    const iTest = createTestHarness(instance, Iceberg)
    let cancelled = false
    let submitted = false

    iTest.on('exec:order:cancel:all', () => {
      cancelled = true
    })

    iTest.on('self:submit_orders', () => {
      submitted = true
    })

    iTest.on('exec:stop', () => {
      assert(cancelled)
      assert(!submitted)
      done()
    })

    instance.state.remainingAmount = -0.05000001

    iTest.trigger('orders', 'order_fill', {
      getLastFillAmount: () => { return -0.05 }
    })
  })
})

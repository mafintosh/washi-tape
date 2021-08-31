module.exports = function createPlanner (t, count) {
  let tick = -1
  let draining = false
  let res
  let rej
  let timeout

  const branches = []
  const promise = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })

  promise.plan = function (count) {
    const p = createPlanner(t, count)
    branches.push(p)
    return p
  }

  promise.timeoutAfter = function (ms) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(rej, ms, new Error('Test timed out'))
  }

  yoloInherit(promise, t, drain)
  queueMicrotask(drain)

  return promise

  function drain () {
    tick++

    if (tick < count) {
      return
    }
    if (tick > count) {
      t.same(tick, count, 'plan != count')
      return rej(new Error('Too many assertions. Got ' + tick + ' expected ' + count))
    }

    if (timeout) clearTimeout(timeout)
    if (draining) return
    draining = true

    let error
    ondone()

    function ondone () {
      const next = branches.shift()
      if (next) return next.then(ondone, onerror)
      if (error) rej(error)
      res()
    }

    function onerror (err) {
      if (!error) error = err
      ondone()
    }
  }
}

function yoloInherit (promise, t, done) {
  promise.fail = function (...args) {
    t.fail(...args)
    done()
  }
  promise.pass = function (...args) {
    t.pass(...args)
    done()
  }
  promise.assert =
  promise.true =
  promise.ok = function (...args) {
    t.ok(...args)
    done()
  }
  promise.notok =
  promise.false =
  promise.notOk = function (...args) {
    t.notOk(...args)
    done()
  }
  promise.iferror =
  promise.ifErr =
  promise.ifError =
  promise.error = function (...args) {
    t.error(...args)
    done()
  }
  promise.is =
  promise.strictEquals =
  promise.strictEqual =
  promise.isEqual =
  promise.equals =
  promise.equal = function (...args) {
    t.equal(...args)
    done()
  }
  promise.not =
  promise.isNot =
  promise.notStrictEquals =
  promise.notStrictEqual =
  promise.isInequal =
  promise.doesNotEqual =
  promise.isNotEqual =
  promise.notEquals =
  promise.notEqual = function (...args) {
    t.notEqual(...args)
    done()
  }
  promise.looseEquals =
  promise.looseEqual = function (...args) {
    t.looseEqual(...args)
    done()
  }
  promise.notLooseEquals =
  promise.notLooseEqual = function (...args) {
    t.notLooseEqual(...args)
    done()
  }
  promise.same =
  promise.isEquivalent =
  promise.deepEquals =
  promise.deepEqual = function (...args) {
    t.deepEqual(...args)
    done()
  }
  promise.isInequivalent =
  promise.isNotEquivalent =
  promise.isNotDeeply =
  promise.isNotDeepEqual =
  promise.notSame =
  promise.notDeeply =
  promise.notEquivalent =
  promise.notDeepEquals =
  promise.notDeepEqual = function (...args) {
    t.notDeepEqual(...args)
    done()
  }
  promise.deepLooseEqual = function (...args) {
    t.deepLooseEqual(...args)
    done()
  }
  promise.notDeepLooseEqual = function (...args) {
    t.notDeepLooseEqual(...args)
    done()
  }
  promise.throws = function (...args) {
    t.throws(...args)
    done()
  }
  promise.doesNotThrow = function (...args) {
    t.doesNotThrow(...args)
    done()
  }
  promise.match = function (...args) {
    t.match(...args)
    done()
  }
  promise.doesNotMatch = function (...args) {
    t.doesNotMatch(...args)
    done()
  }
}

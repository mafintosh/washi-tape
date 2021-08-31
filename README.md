# washi-tape

Washi Tape makes a test planner from a Tape instance that makes it easy to plan and await parts of your tests.

```
npm install washi-tape
```

## Usage

``` js
const net = require('net')
const tape = require('tape')
const plan = require('washi-tape')

tape('some test', async function (t) {
  // make a new test instance that requires 3 asserts
  const serverTest = plan(t, 3)

  // do something async and call the required assertions
  const server = net.createServer(function (socket) {
    serverTest.pass('got socket')
    socket.once('data', function (data) {
      serverTest.ok(data instanceof Buffer)
      socket.end()
    })
  })

  server.listen(10000, () => {
    const s = net.connect(10000)
    s.end('hello world', function () {
      serverTest.pass('client socket finished')
    })
  })

  // wait for the server assertions to finish
  await serverTest

  // two assertions afterwards
  const serverClose = plan(t, 2)

  server.on('close', function () {
    serverClose.pass('server emitted close')
  })
  server.close(function () {
    serverClose.pass('can pass event handler to close itself')
  })

  // wait for the final assertions
  await serverClose
})
```

## API

#### `p = plan(t, count)`

Make a plan instance promise that waits `count` asserts before resolving.

`p` inherits all its assertion methods from `tape` so you can call `p.same`, `p.deepEqual` etc.

Once `count` assertions have been called the promise will resolve.

#### `p.same(...), p.pass(...) etc`

The promise returned extends the tape assertion object so you can run all your normal assertions on it.

#### `await p`

Resolves when `count` assertions have run.

#### `p.timeoutAfter(ms)`

Similar to `t.timeoutAfter` but also rejects the promise.

## License

MIT

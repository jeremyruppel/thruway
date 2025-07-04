# thruway

A tiny type-safe dependency-free middleware stack

## installation

```bash
$ npm install thruway
```

## usage

_it's dangerous to go alone, take this :hocho:_

```typescript
import thruway from "thruway"
import assert from "node:assert"
```

`thruway<T, U>()` creates a middleware stack that takes `<T>` as input and
will return `<U>`.

```typescript
// creates a stack that takes a string as input and will eventually return
// a number
const stack = thruway<string, number>()
```

`stack.use()` adds a middleware to the stack. `stack.run()` runs the stack
with the given input.

```typescript
// create a new middleware stack
const stack = thruway<string, string>()

// add a middleware to the stack
stack.use(function (input) {
  assert.equal(input, "ohai")
  return "ohai back"
})

// run it wih input
console.log(await stack.run("ohai")) // "ohai back"
```

you can optionally pass a config object to the stack, which will be passed to
every middleware function.

```typescript
// create a new middleware stack with a config that will be passed to every
// middleware
const stack = thruway<string, string>({
  your: "config",
})

// add a middlware to the stack
stack.use(function (input, { your }) {
  assert.equal(input, "ohai")
  assert.equal(your, "config")
})

// run it wih input
await stack.run("ohai")
```

if you return a value from a middleware, it will stop the execution of the
stack and return that value. if you return nothing (undefined), it will
continue to the next middleware in the stack.

```typescript
// create a new middlware stack
const stack = thruway<string, string>()

// middleware can return nothing (undefined) and it will continue to the next
// middlware in the stack
stack.use(function (input) {
  // returns nothing
})

// middleware can return a value and it will stop the stack execution
stack.use(function (input) {
  assert.equal(input, "ohai")
  return "ohai back"
})

stack.use(function (input) {
  assert.fail("this will not be called")
})

console.log(await stack.run("ohai")) // "ohai back"
```

async works too, obvi.

```typescript
// create a new middleware stack
const stack = thruway<string, string>()

// middleware can be async functions
stack.use(async function (input) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  // NB: returns nothing
})

// or sync functions that return a promise
stack.use(function (input) {
  assert.equal(input, "ohai")
  return new Promise((resolve) => setTimeout(() => resolve("ohai back"), 100))
})

console.log(await stack.run("ohai")) // "ohai back"
```

if you throw an error from a middleware, it will stop the execution of the
stack and throw that error.

```typescript
// create a new middleware stack
const stack = thruway<string, string>()

// middleware can throw an error and it will stop the stack execution
stack.use(function (input) {
  throw new Error("oh noes")
})

stack.use(function (input) {
  assert.fail("this will not be called")
})

try {
  await stack.run("ohai")
} catch (err) {
  console.error(err.message) // "oh noes"
}
```

## license

[MIT License][LICENSE]

[LICENSE]: https://github.com/jeremyruppel/thruway/blob/master/LICENSE

// @ts-check
import { describe, it } from "node:test"
import assert from "node:assert/strict"
import thruway from "./index.mjs"

describe("thruway", function () {
  it("calls the middleware stack with input", async function () {
    /** @type {import("./index.mjs").Thruway<string, void>} */
    const stack = thruway()

    stack.use(function (input) {
      assert.equal(input, "ohai")
    })

    await stack.run("ohai")
  })

  it("calls each middleware in series", async function () {
    /** @type {import("./index.mjs").Thruway<string, void>} */
    const stack = thruway()

    let count = 0

    /** @param {string} input */
    function fn(input) {
      assert.equal(input, "ohai")
      count++
    }

    stack.use(fn)
    stack.use(fn)
    stack.use(fn)

    await stack.run("ohai")

    assert.equal(count, 3)
  })

  it("returns a value from a middleware", async function () {
    /** @type {import("./index.mjs").Thruway<string, string>} */
    const stack = thruway()

    stack.use(function (input) {
      return "ok!"
    })

    assert.equal(await stack.run("ohai"), "ok!")
  })

  it("does not run middleware after a return", async function () {
    /** @type {import("./index.mjs").Thruway<string, string>} */
    const stack = thruway()

    stack.use(function (input) {
      return "ok!"
    })

    stack.use(function () {
      assert.fail("This middleware should not be called")
    })

    assert.equal(await stack.run("ohai"), "ok!")
  })

  it("throws the error thrown by a middleware", async function () {
    /** @type {import("./index.mjs").Thruway<void, void>} */
    const stack = thruway()
    const error = new Error("boom")

    stack.use(function () {
      throw error
    })

    try {
      await stack.run()
    } catch (err) {
      assert.equal(err, error)
    }
  })

  it("works with async functions", async function () {
    /** @type {import("./index.mjs").Thruway<string, string>} */
    const stack = thruway()

    stack.use(async () => "ok!")

    assert.equal(await stack.run("ohai"), "ok!")
  })

  it("works with functions that return a promise", async function () {
    /** @type {import("./index.mjs").Thruway<string, string>} */
    const stack = thruway()

    stack.use(function (input) {
      return new Promise((resolve) => {
        setTimeout(() => resolve("ok!"), 23)
      })
    })

    assert.equal(await stack.run("ohai"), "ok!")
  })

  it("calls all middlware with the optional config", async function () {
    /** @type {import("./index.mjs").Thruway<string, string>} */
    const stack = thruway({ name: "j bone" })

    stack.use(function (input, cfg) {
      assert.deepEqual(cfg, { name: "j bone" })
    })

    assert.equal(await stack.run("ohai"), undefined)
  })
})

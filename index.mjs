// @ts-check

/**
 * @template I the input type
 * @template O the output type
 * @template C the config type
 */
export class Thruway {
  /**
   * @typedef {function(I, C | undefined): O | undefined | Promise<O | undefined>} Middleware
   */

  /**
   * The middlware stack
   * @type {Array<Middleware>}
   * @private
   */
  stack

  /**
   * The optional config
   * @type {C | undefined}
   * @private
   */
  config

  /**
   * @param {C | undefined} config
   */
  constructor(config) {
    this.stack = []
    this.config = config
  }

  /**
   * @param {Middleware} fn
   */
  use(fn) {
    this.stack.push(fn)
  }

  /**
   * @param {I} input
   * @returns {Promise<O | undefined>}
   */
  async run(input) {
    for (const middleware of this.stack) {
      const value = await middleware(input, this.config)

      if (typeof value !== "undefined") {
        return value
      }
    }
  }
}

/**
 * @param {C | undefined} config
 * @returns {Thruway<I, O, C>}
 * @template I the input type
 * @template O the output type
 * @template C the config type
 */
const thruway = (config = undefined) => new Thruway(config)

export default thruway

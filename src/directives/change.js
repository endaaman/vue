var _ = require('../util')
var config = require('../config')

module.exports = {

  acceptStatement: true,
  priority: 900,

  // supporting same tags to v-model
  update: function (handler) {
    if (typeof handler !== 'function') {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Directive v-change="' + this.expression +
        '" expects a function value, ' +
        'got ' + handler
      )
      return
    }

    var el = this.el

    if (el.hasAttribute(config.prefix + 'model')) {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Do not use v-change with v-model. ' +
        'Use $watch or computed property instead.'
      )
      return
    }

    var tag = el.tagName

    if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
      process.env.NODE_ENV !== 'production' && _.warn(
        'v-change does not support element type: ' + tag
      )
      return
    }

    var vm = this.vm
    var radio = false
    var checkbox = false
    var select = false
    var text = false

    var number = false
    var multiple = false
    var lazy = false
    var debounce = false

    this.listener = function () {
      var cachedValue = vm.$value
      if (select && multiple) {
        vm.$value = []
        var options = el.options
        var i = 0
        do {
          if (options[i].selected) {
            vm.$value.push(number
              ? _.toNumber(options[i].value)
              : options[i].value
            )
          }
          i = i + 1
        } while (i < options.length)
      } else if (checkbox) {
        vm.$value = el.checked
      } else if (number) {
        vm.$value = _.toNumber(el.value)
      } else {
        vm.$value = el.value
      }
      handler(vm.$value)
      // restore `$value` of vm.
      vm.$value = cachedValue
    }

    radio = el.type === 'radio'
    checkbox = el.type === 'checkbox'
    select = tag === 'SELECT'
    text = !radio && !checkbox && !select

    if (select) {
      multiple = el.hasAttribute('multiple')
    }

    if (!checkbox) {
      number = this._checkParam('number') != null
    }

    if (text) {
      lazy = this._checkParam('lazy') != null
      debounce = parseInt(this._checkParam('debounce'), 10)
      if (debounce) {
        this.listener = _.debounce(this.listener, debounce)
      }
      if (lazy) {
        this.on('change', this.listener)
      } else {
        // If binding both 'change' and 'input',
        // the callback will be perfomed on blured
        // in spite of the value has been not changed.
        this.on('input', this.listener)
      }
    } else {
      this.on('change', this.listener)
    }
  }
}

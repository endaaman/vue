var _ = require('../../../../src/util')
var Vue = require('../../../../src/vue')

function trigger (target, event, process) {
  var e = document.createEvent('HTMLEvents')
  e.initEvent(event, true, true)
  if (process) process(e)
  target.dispatchEvent(e)
  return e
}

if (_.inBrowser) {
  describe('v-change', function () {

    var el
    beforeEach(function () {
      el = document.createElement('div')
      spyOn(_, 'warn')
    })

    it('text', function () {
      var test = jasmine.createSpy()
      new Vue({
        el: el,
        template: '<input v-change="test($value)">',
        methods: {
          test: test
        }
      })
      el.firstChild.value = '1.1'
      trigger(el.firstChild, 'input')
      expect(test).toHaveBeenCalledWith('1.1')
    })

    it('text + number', function () {
      var test = jasmine.createSpy()
      new Vue({
        el: el,
        template: '<input v-change="test($value)" number>',
        methods: {
          test: test
        }
      })
      el.firstChild.value = '1.1'
      trigger(el.firstChild, 'input')
      expect(test).toHaveBeenCalledWith(1.1)
    })

    it('text + lazy', function () {
      var test = jasmine.createSpy()
      new Vue({
        el: el,
        template: '<input v-change="test($value)" lazy>',
        methods: {
          test: test
        }
      })
      el.firstChild.value = 'a'
      trigger(el.firstChild, 'input')
      expect(test.calls.count()).toBe(0)
      el.firstChild.value = 'aa'
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith('aa')
    })

    it('text + debounce', function (done) {
      var test = jasmine.createSpy()
      new Vue({
        el: el,
        template: '<input v-change="test($value)" debounce="100">',
        methods: {
          test: test
        }
      })

      el.firstChild.value = 'a'
      trigger(el.firstChild, 'input')
      expect(test.calls.count()).toBe(0)
      setTimeout(function () {
        el.firstChild.value = 'b'
        trigger(el.firstChild, 'input')
        expect(test.calls.count()).toBe(0)
      }, 10)
      setTimeout(function () {
        el.firstChild.value = 'c'
        trigger(el.firstChild, 'input')
        expect(test.calls.count()).toBe(0)
      }, 20)
      setTimeout(function () {
        expect(test).toHaveBeenCalledWith('c')
        expect(test.calls.count()).toBe(1)
        done()
      }, 200)
    })

    it('checkbox', function () {
      var test = jasmine.createSpy()
      new Vue({
        el: el,
        template: '<input type="checkbox" v-change="test($value)">',
        methods: {
          test: test
        }
      })
      el.firstChild.checked = true
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith(true)
      el.firstChild.checked = false
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith(false)
    })

    it('radio', function () {
      var test = jasmine.createSpy()
      new Vue({
        el: el,
        template:
          '<input type="radio" v-change="test($value)" name="radio" value="1.1">' +
          '<input type="radio" v-change="test($value)" name="radio" number value="1.1">',
        methods: {
          test: test
        }
      })
      trigger(el.childNodes[0], 'change')
      expect(test).toHaveBeenCalledWith('1.1')
      trigger(el.childNodes[1], 'change')
      expect(test).toHaveBeenCalledWith(1.1)
    })

    it('textarea', function () {
      var test = jasmine.createSpy()
      new Vue({
        el: el,
        template:
          '<textarea v-change="test($value)"></textarea>',
        methods: {
          test: test
        }
      })
      el.firstChild.value = 'a'
      trigger(el.firstChild, 'input')
      expect(test).toHaveBeenCalledWith('a')
    })

    it('select', function () {
      var test = jasmine.createSpy()
      new Vue({
        el: el,
        template:
          '<select v-change="test($value)">' +
            '<option value="a"></option>' +
            '<option>text</option>' +
          '</select>',
        methods: {
          test: test
        }
      })
      var opts = el.firstChild.childNodes
      opts[0].selected = true
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith('a')
      opts[1].selected = true
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith('text')
    })

    it('select + number', function () {
      var test = jasmine.createSpy()
      new Vue({
        el: el,
        template:
          '<select v-change="test($value)" number>' +
            '<option value="1.1"></option>' +
            '<option value="2"></option>' +
          '</select>',
        methods: {
          test: test
        }
      })
      var opts = el.firstChild.childNodes
      opts[0].selected = true
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith(1.1)
      opts[1].selected = true
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith(2)
    })

    it('select + multiple', function () {
      var test = jasmine.createSpy()
      new Vue({
        el: el,
        template:
          '<select v-change="test($value)" multiple>' +
          '<option value="a"></option>' +
          '<option>text</option>' +
          '</select>',
        methods: {
          test: test
        }
      })
      var opts = el.firstChild.childNodes
      opts[0].selected = true
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith(['a'])
      opts[1].selected = true
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith(['a', 'text'])
      opts[0].selected = false
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith(['text'])
    })

    it('select + multiple + number', function () {
      var test = jasmine.createSpy()
      new Vue({
        el: el,
        template:
          '<select v-change="test($value)" multiple number>' +
          '<option value="1.1"></option>' +
          '<option value="2"></option>' +
          '</select>',
        methods: {
          test: test
        }
      })
      var opts = el.firstChild.childNodes
      opts[0].selected = true
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith([1.1])
      opts[1].selected = true
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith([1.1, 2])
      opts[0].selected = false
      trigger(el.firstChild, 'change')
      expect(test).toHaveBeenCalledWith([2])
    })

    it('unbind', function () {
      var test = jasmine.createSpy()
      var vm = new Vue({
        el: el,
        template: '<input v-change="test($value)">',
        methods: {
          test: test
        }
      })
      vm.$destroy()
      el.firstChild.value = 'a'
      trigger(el.firstChild, 'input')
      expect(test.calls.count()).toBe(0)
    })

    it('warn with v-model', function () {
      new Vue({
        el: el,
        data: {
          _test: 'a'
        },
        template: '<input v-model="_test" v-change="test($value)">',
        methods: {
          test: function () {}
        }
      })
      expect(hasWarned(_, 'Do not use v-change with v-model')).toBe(true)
    })

    it('warn invalid tag', function () {
      new Vue({
        el: el,
        template: '<div v-change="test"></div>',
        methods: {
          test: function () {}
        }
      })
      expect(hasWarned(_, 'does not support element type')).toBe(true)
    })

    it('warn non-function values', function () {
      new Vue({
        el: el,
        data: {
          test: 'a'
        },
        template: '<input v-on="test">'
      })
      expect(hasWarned(_, 'expects a function value')).toBe(true)
    })

  })
}

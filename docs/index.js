(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/********************
* DOM Related Objects
*********************/
const coinCounter = () => {

  // DOM Element References
  const coins = document.querySelectorAll('#counter .segment')
  const labels = document.querySelectorAll('#counter .segment .label')
  const form = document.querySelector('#counter form')

  return {
    // Calculate smallest coin denomination distribution
    calculate: function({ denominations, total }) {
      // If a 1 coin doesn't exist, do nothing
      if (!denominations.filter(coin => coin.denom === 1).length) return []

      // Sort denominations by amount descending
      denominations.sort((coin1, coin2) => coin1.denom < coin2.denom ? 1 : -1)

      // Find smallest coin denomination distribution
      while (total > 0) {
        for (let coin = 0; coin < denominations.length; coin++) {
          let denom = denominations[coin].denom

          if (denom <= total) {
            denominations[coin].amount++
            total -= denom
            break
          }
        }
      }

      return denominations
    },

    // Get reference to DOM elements associated with counter
    getDOMElements: function() {
      return { coins, labels, form }
    },

    // Grab coin denomination user inputs from view layer
    getFormData: function(coins, formData) {
      const total = parseInt(formData.get('total'))
      const denominations = []

      for (let coin = 0; coin < coins.length; coin++) {
        denominations.push(
          {
            amount: 0,
            denom: parseInt(formData.get(`${coin}`)),
            elem: coins[coin]
          }
        )
      }

      return { denominations, total }
    },

    // Reset display labels
    resetLabels: function(labels) {
      for (let label = 0; label < labels.length; label++) {
        labels[label].classList.remove('active')
        labels[label].classList.add('hidden')
      }
    },

    // Get coin denominations and begin calculation
    startCalculate: function() {
      const formData = new FormData(form)
      this.resetLabels(labels)
      this.updateLabels(this.calculate(this.getFormData(coins, formData)))
    },

    // Update view to show denomination distribution
    updateLabels: function(denominations) {
      if (denominations.length) {
        denominations.forEach((coin, index) => {
          if (coin.amount > 0) {
            let label = coin.elem.querySelector('.label')

            label.textContent = coin.amount
            label.classList.remove('hidden')
            label.classList.add('active')
          }
        })
      }
    }
  }

}

/********************
* Initializations
*********************/
const counter = coinCounter()

/********************
* Event Listeners
*********************/
const { form } = counter.getDOMElements()
form.addEventListener('submit', event => {
  event.preventDefault()
  counter.startCalculate()
})

document.getElementById('tests').addEventListener('click', event => {
  const counter = document.getElementById('counter')
  const mocha = document.getElementById('mocha')
  const testButton = event.target

  if (testButton.classList.contains('active')) {
    testButton.textContent = 'Tests'
    testButton.classList.remove('active')
    counter.classList.remove('hidden')
    counter.classList.add('active')
    mocha.classList.remove('active')
    mocha.classList.add('hidden')
  }
  else {
    testButton.textContent = 'Go Back'
    testButton.classList.add('active')
    counter.classList.remove('active')
    counter.classList.add('hidden')
    mocha.classList.remove('hidden')
    mocha.classList.add('active')
  }
})

/********************
* Exports
*********************/
module.exports = counter

},{}],2:[function(require,module,exports){
mocha.ui('bdd')
mocha.reporter('html')

const { calculate, getFormData, resetLabels, updateLabels } = require('./main')
const { expect } = chai

describe('Unit Tests - Coin Counter', () => {

  /********************
  * Helper Functions
  *********************/
  const CE = (tagName, attributes, children) => {
    const element = document.createElement(tagName)

    for (let key in attributes) {
      element.setAttribute(key, attributes[key])
    }

    for (let index = 0; index < children.length; index++) {
      let child = children[index]

      child instanceof Element
        ? element.appendChild(child)
        : element.appendChild(document.createTextNode(child))
    }

    return element
  }

  /********************
  * Tests
  *********************/
  describe('calculate function', () => {

    it('Should return the smallest coin denomination distribution', () => {
      const testData = {
        denominations: [
          {
            amount: 0,
            denom: 25
          },
          {
            amount: 0,
            denom: 10
          },
          {
            amount: 0,
            denom: 5
          },
          {
            amount: 0,
            denom: 1
          }
        ],
        total: 39,
        expected: [
          {
            amount: 1,
            denom: 25
          },
          {
            amount: 1,
            denom: 10
          },
          {
            amount: 0,
            denom: 5
          },
          {
            amount: 4,
            denom: 1
          }
        ]
      }

      expect(calculate(testData)).to.deep.equal(testData.expected)
    })

    it('Should account for random denominations', () => {
      const testData = {
        denominations: [
          {
            amount: 0,
            denom: 20
          },
          {
            amount: 0,
            denom: 90
          },
          {
            amount: 0,
            denom: 15
          },
          {
            amount: 0,
            denom: 1
          }
        ],
        total: 105,
        expected: [
          {
            amount: 1,
            denom: 90
          },
          {
            amount: 0,
            denom: 20
          },
          {
            amount: 1,
            denom: 15
          },
          {
            amount: 0,
            denom: 1
          }
        ]
      }

      expect(calculate(testData)).to.deep.equal(testData.expected)
    })

    it('Should check if a 1 coin exists', () => {
      const testData = {
        denominations: [
          {
            amount: 0,
            denom: 2
          },
          {
            amount: 0,
            denom: 77
          },
          {
            amount: 0,
            denom: 99
          },
          {
            amount: 0,
            denom: 9
          }
        ],
        total: 2,
        expected: []
      }

      expect(calculate(testData)).to.deep.equal(testData.expected)
    })

    it('Should handle duplicate denominations', () => {
      const testData = {
        denominations: [
          {
            amount: 0,
            denom: 10
          },
          {
            amount: 0,
            denom: 10
          },
          {
            amount: 0,
            denom: 1
          },
          {
            amount: 0,
            denom: 10
          }
        ],
        total: 50,
        expected: [
          {
            amount: 5,
            denom: 10
          },
          {
            amount: 0,
            denom: 10
          },
          {
            amount: 0,
            denom: 10
          },
          {
            amount: 0,
            denom: 1
          }
        ]
      }

      expect(calculate(testData)).to.deep.equal(testData.expected)
    })

  })

  describe('getFormData function', () => {

    it('Should return the correct coin user inputs', () => {
      const coins = [
        CE('div', {}, ['1']),
        CE('div', {}, ['2']),
        CE('div', {}, ['3']),
        CE('div', {}, ['4'])
      ]
      const formElement = new FormData()

      formElement.append('0', '90')
      formElement.append('1', '60')
      formElement.append('2', '40')
      formElement.append('3', '10')
      formElement.append('total', '200')

      const expected = {
        denominations: [
          {
            amount: 0,
            denom: 90,
            elem: coins[0]
          },
          {
            amount: 0,
            denom: 60,
            elem: coins[1]
          },
          {
            amount: 0,
            denom: 40,
            elem: coins[2]
          },
          {
            amount: 0,
            denom: 10,
            elem: coins[3]
          }
        ],
        total: 200
      }

      expect(getFormData(coins, formElement)).to.deep.equal(expected)

    })

  })

  describe('resetLabels function', () => {

    it('Should hide all of the notification circles', () => {
      const labels = [
        CE('div', {'class': 'label active'}, []),
        CE('div', {'class': 'label active'}, []),
        CE('div', {'class': 'label active'}, []),
        CE('div', {'class': 'label active'}, [])
      ]

      resetLabels(labels)

      let allHidden = true
      for (let label = 0; label < labels.length; label++) {
        if (labels[label].classList.contains('active')) allHidden = false
      }

      expect(allHidden).to.be.true

    })

  })

  describe('updateLabels function', () => {

    it('Should update all of the notification circles and toggle their visibility', () => {
      const coins = [
        CE('div', {}, [
          CE('div', {'class': 'label hidden'}, [])
        ]),
        CE('div', {}, [
          CE('div', {'class': 'label hidden'}, [])
        ]),
        CE('div', {}, [
          CE('div', {'class': 'label hidden'}, [])
        ]),
        CE('div', {}, [
          CE('div', {'class': 'label hidden'}, [])
        ])
      ]

      const denominations = [
        {
          amount: 5,
          denom: 90,
          elem: coins[0]
        },
        {
          amount: 0,
          denom: 60,
          elem: coins[1]
        },
        {
          amount: 0,
          denom: 40,
          elem: coins[2]
        },
        {
          amount: 4,
          denom: 1,
          elem: coins[3]
        }
      ]

      updateLabels(denominations)

      let amountsMatch = true
      const visibleResult = []
      const visibleExpected = [true, false, false, true]

      denominations.forEach(coin => {
        const label = coin.elem.querySelector('.label')

        label.classList.contains('active')
          ? visibleResult.push(true)
          : visibleResult.push(false)

        if (coin.amount) {
          if (parseInt(label.textContent) !== coin.amount) amountsMatch = false
        }
      })

      expect(visibleResult).to.deep.equal(visibleExpected)
      expect(amountsMatch).to.be.true
    })

  })

})

mocha.run()

},{"./main":1}]},{},[1,2]);

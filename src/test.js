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
      const testData = [
        // Default denominations (including 1)
        {
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
        },
        // Random denominations (including 1)
        {
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
        },
        // Random denominations (not including 1)
        {
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
        },
        // Random denominations with duplicates (including 1)
        {
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
      ]

      testData.forEach(test => {
        let result = calculate(test)
        expect(result).to.deep.equal(test.expected)
      })
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

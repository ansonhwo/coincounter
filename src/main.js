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

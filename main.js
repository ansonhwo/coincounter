/********************
* DOM Related Objects
*********************/
const counter = {

  // Initializations
  init: function() {
    this.cacheDOM()
  },

  // Cache DOM elements for future reference
  cacheDOM: function() {
    this.coins = document.querySelectorAll('#counter .segment')
    this.labels = document.querySelectorAll('#counter .segment .label')
    this.form = document.querySelector('#counter form')
    this.submit = document.querySelector('#counter .calculate')
  },

  // Calculate smallest coin denomination distribution
  calculate: function({ denominations, total }) {
    // Sort denominations by amount descending
    denominations.sort((coin1, coin2) => coin1.denom < coin2.denom ? 1 : -1)

    // Find smallest coin denomination distribution
    // Assumption: A 1 coin will always exist
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

    // Update view to show denomination distribution
    denominations.forEach((coin, index) => {
      if (coin.amount > 0) {
        let label = coin.elem.querySelector('.label')

        label.textContent = coin.amount
        label.classList.remove('hidden')
        label.classList.add('active')
      }
    })
  },

  // Grab coin denomination user inputs from view layer
  getFormData: function() {
    const formData = new FormData(counter.form)
    const total = parseInt(formData.get('total'))
    const denominations = []

    for (let coin = 0; coin < this.coins.length; coin++) {
      denominations.push(
        {
          amount: 0,
          denom: parseInt(formData.get(`${coin}`)),
          elem: this.coins[coin]
        }
      )
    }

    return { denominations, total }
  },

  // Reset display labels
  resetLabels: function() {
    for (let label = 0; label < this.labels.length; label++) {
      this.labels[label].classList.remove('active')
      this.labels[label].classList.add('hidden')
    }
  },

  // Get coin denominations and begin calculation
  startCalculate: function() {
    this.resetLabels()
    this.calculate(this.getFormData())
  }

}

/********************
* Initializations
*********************/
counter.init()

/********************
* Event Listeners
*********************/
document.addEventListener('submit', event => {
  event.preventDefault()
  counter.startCalculate()
})

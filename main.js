const counter = {

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
  calculate: function() {
    const denominations = []
    const formData = new FormData(this.form)
    let total = parseInt(formData.get('total'))

    // Reset labels
    for (let label = 0; label < this.labels.length; label++) {
      this.labels[label].classList.remove('active')
      this.labels[label].classList.add('hidden')
    }

    // Associate denominations with their parent elements
    for (let coin = 0; coin < this.coins.length; coin++) {
      denominations.push(
        {
          amount: 0,
          denom: parseInt(formData.get(`${coin}`)),
          elem: this.coins[coin]
        }
      )
    }

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
  }

}

counter.init()

document.addEventListener('submit', event => {
  event.preventDefault()
  counter.calculate()
})

counter.submit.addEventListener('touchstart', event => {
  event.preventDefault()
  counter.calculate()
})

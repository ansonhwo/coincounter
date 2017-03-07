const calculate = document.querySelector('#counter .calculate')
const inputs = document.getElementsByTagName('input')

for (let elem = 0; elem < inputs.length; elem++) {
  inputs[elem].addEventListener('click', event => {
    setTimeout(() => event.target.select(), 1)
  })

  inputs[elem].addEventListener('touchstart', event => {
    setTimeout(() => event.target.select(), 1)
  })
}

calculate.addEventListener('click', event => {
  event.preventDefault()
  console.log('clicked calculate button')
})

calculate.addEventListener('touchstart', event => {
  event.preventDefault()
  console.log('touched calculate button')
})

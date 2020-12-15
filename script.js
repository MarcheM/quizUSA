const modal = document.querySelector(".modal")
const timer = document.getElementById("time")
const stateContainer = document.querySelector(".state_container")
const inputValue = document.querySelector(".user_input")
const scoreBox = document.getElementById("score-box")

const scoreText = document.querySelector(".score-text")
const closeModal = document.querySelector('.close')

const createDivs = () => {
  for (let i = 0; i < 50; i++) {
    let tempDiv = document.createElement("div")
    tempDiv.id = `S${i + 1}`
    tempDiv.classList.add("state")
    tempDiv.innerText = "?"
    stateContainer.appendChild(tempDiv)
  }
}

if (stateContainer.hasChildNodes) {
  createDivs()
}

closeModal.addEventListener("click", () => {
  modal.style.display = "none"
})
class Game {

  constructor() {
    this.singleStates = document.querySelectorAll(".state")
    this.time = 600
    this.states = []
    timer.innerText = `time left: 10:00`

    this.fetchData()
    inputValue.addEventListener("input", (event) => {
      this.check(event)
    })
    scoreBox.innerText = `score: ${this.score}`

  }
  score = 0

  fetchData = () => {
    fetch(`https://quizusa-9fc86-default-rtdb.firebaseio.com/quiz/-MOSOJz8ogddsCk4YGxQ.json`)
      .then(res => res.json())
      .then(quiz => {
        const statesList = quiz
          ? Object
            .keys(quiz)
            .map(key => {
              return {
                ...quiz[key]
              }
            })
          : []
        this.states = statesList
      })
  }

  check = (event) => {
    this.states.map(state => {
      for (const property in state) {
        if (state[property].includes(event.target.value.toLowerCase()) && !state[property].includes("dupablada")) {
          const guessedState = document.getElementById(property)
          guessedState.innerText = state[property][0]
          inputValue.classList.add("input_highlight")
          guessedState.classList.add("showBravo")
          guessedState.classList.add("guessed")
          state[property].push("dupablada")
          this.score += 1
          scoreBox.innerText = `score: ${this.score}/50`
          inputValue.value = ""
          setTimeout(() => {
            guessedState.classList.remove("showBravo")
            inputValue.classList.remove("input_highlight")
          }, 300)
        }
      }
    })
  }

  hidePreviousAnswers = () => {
    Array.from(this.singleStates).map(usState => {
      usState.innerText = "?"
      usState.classList.remove("guessed")
      usState.classList.remove("not-guessed")

    })
  }

  showAnswers = () => {
    this.states.map(state => {
      for (const property in state) {
        const guessedState = document.getElementById(property)
        guessedState.innerText = state[property][0]
        guessedState.classList.add("not-guessed")
      }
    })
  }

  countDown = () => {
    const endOfGame = setInterval(() => {
      if (this.time === 0) {
        inputValue.disabled = true
        this.showScore()
        clearInterval(endOfGame)
        this.showAnswers()
      }
      else if (this.score === 50) {
        inputValue.disabled = true
        this.showScore()
        clearInterval(endOfGame)
      } else {
        this.time -= 1
        let minutes = Math.floor(this.time / 60)
        let seconds = this.time - (minutes * 60)
        let finalSeconds
        if (seconds < 10) {
          finalSeconds = `0${seconds}`
        } else {
          finalSeconds = seconds
        }
        timer.innerText = `time left: ${minutes}:${finalSeconds}`
      }

      document.getElementById("end").addEventListener('click', () => {
        clearInterval(endOfGame)
        inputValue.disabled = true
        this.showAnswers()
        this.showScore()
      })
    }, 1000)
  }

  showScore = () => {
    modal.style.display = "block";
    scoreText.innerText = this.scoreContent()
  }

  scoreContent = () => {
    if (this.score === 50) {
      return `Gratulacje! Odgadłeś wszystkie stany!`
    }
    if (this.score === 1 || this.score === 0) {
      return `Heh... Przynajmniej mała szansa, że następnym razem będzie gorzej!`
    }
    if (this.score < 5) {
      return `Zdobyłeś ${this.score} punkty. Nie wiem co powiedzieć. Musisz z tym żyć...`
    }
    if (this.score / 50 > .8) {
      return `Brawo! Zdobyłeś ${this.score} punktów! Niewiele zabrakło!`
    }
    if (this.score / 50 >= .5) {
      return `${this.score} stanów to dość przyzwoity wynik. Brawo`
    }
    if (this.score / 50 < .5) {
      return `Zdobyłeś ${this.score} punktów`
    }
  }

  play = () => {
    this.score = 0
    this.time = 600
    inputValue.disabled = false
    this.countDown()
  }
}

document.getElementById("start").addEventListener("click", () => {
  let userGame = new Game()
  userGame.play()
  userGame.hidePreviousAnswers()
})



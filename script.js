
const stateContainer = document.querySelector(".state_container")

const createDivs = () => {
  for (let i = 0; i < 50; i++) {
    let tempDiv = document.createElement("div")
    tempDiv.id = `S${i + 1}`
    tempDiv.classList.add("state")
    tempDiv.innerText = "?"
    stateContainer.appendChild(tempDiv)
  }
}

createDivs()
class Game {

  constructor() {
    this.score = 0
    this.time = 0
    this.timer = document.getElementById("time")
    this.states = []
    this.inputValue = document.querySelector(".user_input")
    this.scoreBox = document.getElementById("score-box")
    this.timer.innerText = `time left: 10:00`
    this.singleStates = document.querySelectorAll(".state")
    this.fetchData()
    this.inputValue.addEventListener("input", (event) => {
      this.check(event)
    })

  }


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
        if (state[property].includes(event.target.value.toLowerCase())) {
          const guessedState = document.getElementById(property)
          guessedState.innerText = state[property][0]
          this.inputValue.classList.add("input_highlight")
          guessedState.classList.add("showBravo")
          guessedState.classList.add("guessed")
          state[property] = [null]
          this.score += 1
          this.scoreBox.innerText = `score: ${this.score}/50`
          this.inputValue.value = ""
          setTimeout(() => {
            guessedState.classList.remove("showBravo")
            this.inputValue.classList.remove("input_highlight")
          }, 300)
        }
      }
    })
  }

  hidePreviousAnswers = () => {
    Array.from(this.singleStates).map(usState => {
      usState.innerText = "?"
      usState.classList.remove("guessed")
    })
  }

  countDown = () => {
    const endOfGame = setInterval(() => {
      if (this.time === 0) {
        this.inputValue.disabled = true
        this.showScore()
        clearInterval(endOfGame)
      }
      else if (this.score === 50) {
        this.inputValue.disabled = true
        window.alert(`koniec! Odgadłeś wszystkie stany! GRATULACJE!!!!!`)
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
        this.timer.innerText = `time left: ${minutes}:${finalSeconds}`
      }

      document.getElementById("end").addEventListener('click', () => {
        clearInterval(endOfGame)
        this.inputValue.disabled = true
        this.showScore()
      })
    }, 1000)
  }

  showScore = () => {
    alert(`koniec! Odgadłeś ${this.score} stanów`)
  }


  play = () => {
    this.score = 0
    this.time = 600
    this.inputValue.disabled = false
    this.countDown()
  }
}

document.getElementById("start").addEventListener("click", () => {

  const userGame = new Game()
  userGame.play()
  userGame.hidePreviousAnswers()
})



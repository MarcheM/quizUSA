const states = [
  { S1: ["alabama"] },
  { S2: ["alaska"] },
  { S3: ["arizona"] },
  { S4: ["arkansas", "arkanzas"] },
  { S5: ["connecticut", "conecticut"] },
  { S6: ["dakota płd", "dakota południowa", "south dakota"] },
  { S7: ["dakota płn", "dakota północna", "north dakota"] },
  { S8: ["delaware"] },
  { S9: ["floryda", "florida"] },
  { S10: ["georgia"] },
  { S11: ["hawaje", "hawaii"] },
  { S12: ["idaho"] },
  { S13: ["illinois"] },
  { S14: ["indiana"] },
  { S15: ["iowa"] },
  { S16: ["kalifornia", "california"] },
  { S17: ["kansas"] },
  { S18: ["karolina płd", "karolina południowa", "south carolina"] },
  { S19: ["karolina płn", "karolina północna", "north carolina"] },
  { S20: ["kentucky"] },
  { S21: ["kolorado", "colorado"] },
  { S22: ["luizjana"] },
  { S23: ["maine"] },
  { S24: ["maryland"] },
  { S25: ["massachusetts", "masachusets", "massachussets", "masachusets"] },
  { S26: ["michigan"] },
  { S27: ["minnesota", "minesota"] },
  { S28: ["missisipi", "mississippi", "mississipi", "misisipi"] },
  { S29: ["missouri", "misouri"] },
  { S30: ["montana"] },
  { S31: ["nebraska"] },
  { S32: ["nevada"] },
  { S33: ["new hampshire"] },
  { S34: ["new jersey"] },
  { S35: ["new york", "nowy jork"] },
  { S36: ["nowy meksyk", "new mexico"] },
  { S37: ["ohio"] },
  { S38: ["oklahoma"] },
  { S39: ["oregon"] },
  { S40: ["pensylwania", "pennsylvania"] },
  { S41: ["rhode island"] },
  { S42: ["teksas", "texas"] },
  { S43: ["tennessee", "tennesse"] },
  { S44: ["utah"] },
  { S45: ["vermont", "wermont"] },
  { S46: ["waszyngton", "washington"] },
  { S47: ["wirginia", "virginia"] },
  { S48: ["wirginia zach", "wirginia zachodnia", "west virginia"] },
  { S49: ["wisconsin"] },
  { S50: ["wyoming"] },
]

const stateContainer = document.querySelectorAll(".state_container")[0]

const createDivs = () => {
  for (i = 0; i < 50; i++) {
    let tempDiv = document.createElement("div")
    tempDiv.id = `S${i + 1}`
    tempDiv.classList.add("state")
    tempDiv.innerText = "?"
    stateContainer.appendChild(tempDiv)
  }
}


const restartGame = () => {
  clearInterval(endOfGame)
  inputValue.disabled = true
  score = 0;
  timer.innerText = `time: 10:00`
  Array.from(document.getElementsByClassName("state")).map(state => {
    state.innerText = "?"
  })
}

const inputValue = document.querySelector(".user_input")
let score = 0
createDivs()

inputValue.addEventListener("input", (event) => {
  states.map(state => {
    for (const property in state) {
      if (state[property].includes(event.target.value.toLowerCase())) {
        const guessedState = document.getElementById(property)
        guessedState.innerText = state[property][0]
        inputValue.classList.add("input_highlight")
        guessedState.classList.add("guessed")
        state[property] = [null]
        score += 1
        scoreBox.innerText = `score: ${score}/50`
        inputValue.value = ""
        setTimeout(() => {
          guessedState.classList.remove("guessed")
          inputValue.classList.remove("input_highlight")
        }, 300)
      }
    }
  })
})
const timer = document.getElementById("time")

const countDown = () => {
  let time = 600

  endOfGame = setInterval(() => {
    if (time === 0) {
      inputValue.disabled = true
      window.alert(`koniec! Odgadłeś ${score} stanów`)
      clearInterval(endOfGame)
      score = 0
    }
    else if (score === 50) {
      inputValue.disabled = true
      window.alert(`koniec! Odgadłeś wszystkie stany! GRATULACJE!!!!!`)
      clearInterval(endOfGame)
      score = 0
    } else {
      time = time - 1
      let minutes = Math.floor(time / 60)
      let seconds = time - (minutes * 60)
      if (seconds < 10) {
        finalSeconds = `0${seconds}`
      } else {
        finalSeconds = seconds
      }

      timer.innerText = `time left: ${minutes}:${finalSeconds}`
    }
  }, 1000)
}




const startButton = document.getElementById("button-start")
const endButton = document.getElementById("button-end")
const scoreBox = document.getElementById("score-box")
startButton.addEventListener("click", () => {
  inputValue.disabled = false
  countDown()
})

endButton.addEventListener("click", () => {
  restartGame()
})

scoreBox.innerText = `score: ${score}/50`
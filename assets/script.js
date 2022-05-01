firebase.initializeApp({
    apiKey: 'AIzaSyDB30ee-2KQt8K0KlQzRl-ucXYyzn7H9cM',
    authDomain: 'quizusa-9fc86.firebaseapp.com',
    projectId: 'quizusa-9fc86',
    storageBucket: 'quizusa-9fc86.appspot.com',
    messagingSenderId: '690615835797',
    appId: '1:690615835797:web:79d07e680c3f023bb14f9c'
});

const modal = document.querySelector(".modal");
const timer = document.getElementById("time");
const stateContainer = document.querySelector(".state-container");
const inputValue = document.querySelector("#state-input");
const scoreBox = document.getElementById("score-box");
const endButton = document.querySelector("#end");
const startButton = document.querySelector("#start");
const scoreText = document.querySelector(".score-text");
const closeModal = document.querySelector('.modal-close');

const createDivs = () => {
    for (let i = 0; i < 50; i++) {
        let tempDiv = document.createElement("div");
        tempDiv.id = `S${i + 1}`;
        tempDiv.classList.add("state");
        tempDiv.innerText = "?";
        stateContainer.appendChild(tempDiv);
    }
};

if (stateContainer.hasChildNodes) {
    createDivs();
}

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

class Game {
    constructor() {
        this.singleStates = document.querySelectorAll(".state");
        this.time = 600;
        this.states = [];
        timer.innerText = `czas do końca: 10:00`;
        inputValue.value = "";
        this.fetchData();
        inputValue.addEventListener("input", (event) => {
            this.check(event);
        });
        scoreBox.innerText = `Wynik: ${this.score}/50`;
        const svgMap = document.getElementById('svg-map').contentDocument;
        this.svgStates = svgMap.children[0].querySelectorAll('path');
    }

    score = 0;

    fetchData = async () => await fetch(`https://quizusa-9fc86-default-rtdb.firebaseio.com/quiz/-MOSOJz8ogddsCk4YGxQ.json`)
        .then(res => res.json())
        .then(quiz => {
            return this.states = quiz
                ? Object.keys(quiz).map(key => ({ ...quiz[key] }))
                : [];
        });

    check = (event) => {
        this.states.map(state => {
            for (const property in state) {
                if (state[property].includes(event.target.value.toLowerCase())
                    && !state[property].includes("placeholder")) {
                    const guessedState = document.getElementById(property);
                    guessedState.innerText = state[property][0];
                    inputValue.classList.add("input-highlight");
                    guessedState.classList.add("show-bravo");
                    guessedState.classList.add("guessed");
                    state[property].push("placeholder");
                    this.score += 1;
                    scoreBox.innerText = `Wynik: ${this.score}/50`;
                    inputValue.value = "";
                    setTimeout(() => {
                        guessedState.classList.remove("show-bravo");
                        inputValue.classList.remove("input-highlight");
                    }, 300);

                    Array.from(this.svgStates).map(state => {
                        const stateId = state.id.split('-')[0];
                        if (property === stateId) {
                            state.id.includes('body')
                                ? state.setAttributeNS(null, 'fill', '#212422')
                                : state.setAttributeNS(null, 'fill', '#f4eee2');
                        }
                    });
                }
            }
        });
    };

    hidePreviousAnswers = () => {
        Array.from(this.singleStates).map(usState => {
            usState.innerText = "?";
            usState.classList.remove("guessed");
            usState.classList.remove("not-guessed");
        });
        Array.from(this.svgStates).map(state => {
            state.setAttributeNS(null, 'fill', 'none');
        });
    };

    showAnswers = () => {
        this.states.map(state => {
            for (const property in state) {
                const guessedState = document.getElementById(property);
                guessedState.innerText = state[property][0];
                guessedState.classList.add("not-guessed");
            }
        });
    };

    countTime = (numberOfSecond) => {
        let minutes = Math.floor(numberOfSecond / 60);
        let seconds = numberOfSecond - (minutes * 60);
        let finalSeconds;
        if (seconds < 10) {
            finalSeconds = `0${seconds}`;
        } else {
            finalSeconds = seconds;
        }
        return `${minutes}:${finalSeconds}`;
    };

    countDown = () => {
        const endOfGame = setInterval(() => {
            const handleEnd = () => {
                clearInterval(endOfGame);
                inputValue.disabled = true;
                endButton.disabled = !endButton.disabled;
                startButton.disabled = !startButton.disabled;
                this.showScore();
                this.showAnswers();
                Array.from(this.svgStates).map(state => {
                    state.id.includes('body')
                        ? state.setAttributeNS(null, 'fill', '#212422')
                        : state.setAttributeNS(null, 'fill', '#f4eee2');
                });
            };
            if (this.time === 0 || this.score === 50) {
                handleEnd();
            } else {
                this.time -= 1;
                timer.innerText = `czas do końca: ${this.countTime(this.time)}`;
            }

            document.getElementById("end").addEventListener('click', () => {
                handleEnd();
                endButton.disabled = true;
                startButton.disabled = false;
            });
        }, 1000);
    };

    showScore = () => {
        modal.style.display = "block";
        scoreText.innerText = this.scoreContent();
    };

    scoreContent = () => {
        if (this.score === 50) {
            return `Gratulacje! Odgadłeś wszystkie stany!`;
        }
        if (this.score === 1 || this.score === 0) {
            return `Heh... Przynajmniej mała szansa, że następnym razem będzie gorzej!`;
        }
        if (this.score < 5) {
            return `Zdobyłeś ${this.score} punkty. Nie martw się, w czymś innym musisz być dobry (lub chociaż przeciętny, rajt?)`;
        }
        if (this.score >= 40) {
            return `Brawo! Zdobyłeś ${this.score} punktów! Niewiele zabrakło!`;
        }
        if (this.score > 25) {
            return `${this.score} stanów to dość przyzwoity wynik. Trochę doczytasz i wrócisz`;
        }
        if (this.score < 25) {
            return `Zdobyłeś ${this.score} punktów`;
        }
    };

    play = () => {
        this.score = 0;
        this.time = 600;
        inputValue.disabled = false;
        this.countDown();
        document.querySelector('#state-input').focus();
    };
}

startButton.addEventListener("click", () => {
    let userGame = new Game();
    userGame.play();
    userGame.hidePreviousAnswers();
    endButton.disabled = !endButton.disabled;
    startButton.disabled = !startButton.disabled;
});



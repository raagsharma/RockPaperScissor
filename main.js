/* -------------------------------------------------------------------------- */
/*                                DOM ELEMENTS                                */
/* -------------------------------------------------------------------------- */
const computerScore = document.getElementById("computer-score");
const yourScore = document.getElementById("your-score");
const scoreBoard = document.querySelector("#score-board");
const rulesBtn = document.getElementById("rules-btn");
const nextBtn = document.getElementById("next-btn");
const rulesCloseBtn = document.getElementById("rules-board-close-btn");
const rulesBoard = document.getElementById("rules-board");
const startArea = document.getElementById("start-area");
const playArea = document.getElementById("play-area");
const winArea = document.getElementById("win-area");
const choicesBtns = document.querySelectorAll("#start-area .choices-btn");
const selecteChoices = document.querySelectorAll("#play-area .choices-btn");
const selecteChoicesImg = document.querySelectorAll(
  "#play-area .choices-btn > img"
);
const resultText = document.querySelector("#play-area-main-text > p");
const playAgainBtns = document.querySelectorAll(".play-again-btn");
const playAgainBtn = playAgainBtns[0];

/* -------------------------------------------------------------------------- */
/*                                    STATE                                   */
/* -------------------------------------------------------------------------- */

const choices = ["rock", "paper", "scissors"];
const localStorage = window.localStorage;

const STATE = {
  get game() {
    return localStorage.getItem("gameState") || "start";
  },
  set game(state) {
    localStorage.setItem("gameState", state);
  },
  get round() {
    return localStorage.getItem("roundState") || "";
  },
  set round(state) {
    localStorage.setItem("roundState", state);
  },
  get yourChoice() {
    return localStorage.getItem("yourChoice") || "";
  },
  set yourChoice(choice) {
    localStorage.setItem("yourChoice", choice);
  },
  get computerChoice() {
    return localStorage.getItem("computerChoice") || "";
  },
  set computerChoice(choice) {
    localStorage.setItem("computerChoice", choice);
  },
  get yourScore() {
    return Number(localStorage.getItem("yourScore") || 0);
  },
  set yourScore(score) {
    localStorage.setItem("yourScore", score.toString());
  },
  get computerScore() {
    return Number(localStorage.getItem("computerScore") || 0);
  },
  set computerScore(score) {
    localStorage.setItem("computerScore", score.toString());
  },
  get gameEnd() {
    return Boolean(localStorage.getItem("gameEnd") || false);
  },
  set gameEnd(state) {
    localStorage.setItem("gameEnd", state);
  },
  get winner() {
    return localStorage.getItem("winner") || "";
  },
  set winner(winner) {
    localStorage.setItem("winner", winner);
  },
};

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

const hide = (element) => element.classList.add("hidden");

const show = (element) => element.classList.remove("hidden");

const refresh = () => {
  setYourChoice();
  setComputerChoice();
  setResultText();
  setScore();

  hide(startArea);
  hide(playArea);
  hide(winArea);
  hide(playAgainBtn);
  hide(nextBtn);
  show(scoreBoard);

  if (STATE.game === "start") {
    show(startArea);
  } else if (STATE.game === "play") {
    show(playArea);
    show(nextBtn);
  } else if (STATE.game === "end") {
    show(playArea);
    show(playAgainBtn);

    if (STATE.winner === "you") {
      show(nextBtn);
    }
  }
};

const resetGame = () => {
  STATE.yourScore = 0;
  STATE.computerScore = 0;
  STATE.round = "";
  STATE.game = "start";
  STATE.gameEnd = false;
  STATE.winner = "";
};

const resetPlay = () => {
  if (STATE.game !== "start") {
    STATE.game = "start";
  }
};

const startPlay = () => {
  if (STATE.game !== "play") {
    STATE.game = "play";
  }
};

const endPlay = () => {
  if (STATE.game !== "end") {
    STATE.game = "end";

    if (STATE.yourScore > STATE.computerScore) {
      STATE.winner = "you";
    } else if (STATE.yourScore < STATE.computerScore) {
      STATE.winner = "computer";
    } else {
      STATE.winner = "draw";
    }
  }
};

const increaseScore = () => {
  if (STATE.round === "win") {
    STATE.yourScore = STATE.yourScore + 1;
  } else if (STATE.round === "lose") {
    STATE.computerScore = STATE.computerScore + 1;
  } else {
    STATE.yourScore = STATE.yourScore + 1;
    STATE.computerScore = STATE.computerScore + 1;
  }
};

const checkWin = () => {
  if (STATE.yourChoice === STATE.computerChoice) {
    STATE.round = "draw";
  } else if (
    (STATE.yourChoice === "rock" && STATE.computerChoice === "scissors") ||
    (STATE.yourChoice === "paper" && STATE.computerChoice === "rock") ||
    (STATE.yourChoice === "scissors" && STATE.computerChoice === "paper")
  ) {
    STATE.round = "win";
  } else {
    STATE.round = "lose";
  }
};

const setResultText = () => {
  const result = STATE.round;
  if (result === "win") {
    resultText.innerText = "YOU WIN";
  } else if (result === "lose") {
    resultText.innerText = "YOU LOSE";
  } else {
    resultText.innerText = "TIE UP";
  }
};

const computerChoice = () => {
  const randomNum = Math.floor(Math.random() * 3);
  return choices[randomNum];
};

const setScore = () => {
  computerScore.innerText = STATE.computerScore;
  yourScore.innerText = STATE.yourScore;

  if (STATE.yourScore === 3 || STATE.computerScore === 3) {
    endPlay();
  }
};

const setChoices = (yourChoice, computerChoice) => {
  STATE.yourChoice = yourChoice;
  STATE.computerChoice = computerChoice;
};

const setYourChoice = () => {
  const choice = STATE.yourChoice;

  const yourChoice = selecteChoices[0];
  const yourChoiceImg = selecteChoicesImg[0];

  yourChoice.id = `${choice}-btn`;
  yourChoiceImg.src = `./images/${choice}.png`;
};

const setComputerChoice = () => {
  const choice = STATE.computerChoice;
  const yourChoice = selecteChoices[1];
  const yourChoiceImg = selecteChoicesImg[1];

  yourChoice.id = `${choice}-btn`;
  yourChoiceImg.src = `./images/${choice}.png`;
};

const handleChoiceSelection = (yourChoice) => {
  setChoices(yourChoice, computerChoice());
  startPlay();

  checkWin();

  increaseScore();

  refresh();
};

/* -------------------------------------------------------------------------- */
/*                                  LISTENERS                                 */
/* -------------------------------------------------------------------------- */

rulesBtn.addEventListener("click", () => {
  rulesBoard.classList.remove("hidden");
});

nextBtn.addEventListener("click", () => {
  if (STATE.gameEnd && STATE.winner === "you") {
    hide(scoreBoard);
    hide(nextBtn);
    hide(playArea);
    hide(startArea);
    show(winArea);
  } else {
    resetPlay();
    refresh();
  }
});

rulesCloseBtn.addEventListener("click", () => {
  rulesBoard.classList.add("hidden");
});

choicesBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleChoiceSelection(btn.attributes.name.value);
  });
});

playAgainBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    resetGame();
    refresh();
  });
});

/* -------------------------------------------------------------------------- */
/*                                  INTIALIZE                                 */
/* -------------------------------------------------------------------------- */
refresh();

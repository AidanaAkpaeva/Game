let container = document.getElementById('container');
const URL = 'https://pastebin.com/raw/QRGzxxEy'; //JSON-файл с вопросами

async function game() {
  const response = await fetch(URL);
  const dataJSON = response.json();
  return dataJSON;
}

game().then(dataJSON => {
  console.log(dataJSON)
})

// Конец игры
let gameOver = () => {
  container.innerHTML = '';
  let end = document.createElement('div');
  container.appendChild(end).id = 'end';

  let gameEnd = document.createElement('p');
  end.appendChild(gameEnd).id = 'game-end';

  let playAgain = document.createElement('button');
  playAgain.innerHTML = 'Play again';
  end.appendChild(playAgain).id = 'play-again';
  playAgain.addEventListener("click", () => startGame());
}

let outputRandomQuestions = () => {
  container.innerHTML = '';
  let mainContent = document.createElement('div');
  container.appendChild(mainContent).id = 'main-content';

  let questions__container = document.createElement('div');
  mainContent.appendChild(questions__container).id = 'questions__container';

  // Создание кнопок для подсказок
  let fiftyFiftyBtn = document.createElement('button');
  fiftyFiftyBtn.innerHTML = '50/50';
  mainContent.appendChild(fiftyFiftyBtn).id = 'fiftyFiftyBtn';

  let skipTheQuestionBtn = document.createElement('button');
  skipTheQuestionBtn.innerHTML = 'Skip the question';
  mainContent.appendChild(skipTheQuestionBtn).id = 'skipTheQuestionBtn';

  let nextQuestion = document.createElement('button');

  questions__container.appendChild(nextQuestion).innerHTML = 'Next question';
  nextQuestion.addEventListener("click", () => gameOver());
}

let enterName = () => {
  container.innerHTML = '';

  let startContent = document.createElement('div');
  container.appendChild(startContent).id = 'start__content';

  let inputUserName = document.createElement('input');
  inputUserName.setAttribute('placeholder', 'Enter your name');
  startContent.appendChild(inputUserName).id = 'input__user-name';

  let startBtn = document.createElement('button');
  startBtn.innerHTML = 'Ok';
  startContent.appendChild(startBtn).id = 'start';

  startBtn.addEventListener("click", () => {
    outputRandomQuestions();
  });
}

let startGame = () => {
  container.innerHTML = '';

  let startGameBtn = document.createElement('button');
  container.appendChild(startGameBtn);
  startGameBtn.innerHTML = 'Start'

  startGameBtn.addEventListener("click", () => enterName());
}

startGame();
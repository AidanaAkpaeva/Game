let startContent = document.querySelector('.start__content');
let startBtn = document.querySelector('.start');
let inputUserName = document.getElementById('input__user-name');

let mainContent = document.querySelector('.main-content')
let fiftyFiftyBtn = document.getElementById('fiftyFiftyBtn');
let skipTheQuestionBtn = document.getElementById('skipTheQuestionBtn');

let questionText = document.getElementById('question__text');
let answersList = document.querySelector('.answers__list');

let end = document.querySelector('.end');
let gameEnd = document.getElementById('game-end');
let repeat = document.querySelector('.repeat')

const URL = 'https://raw.githubusercontent.com/AidanaAkpaeva/questions-for-game/main/data.json'; //JSON-файл с вопросами
let userName;
let questionNumber = 0;
let bank = 0;
let userAnswer;

async function game() {
  const response = await fetch(URL);
  const dataJSON = await response.json();
  return dataJSON;
}

game().then(dataJSON => {
  // Счетчик заработанных денег
  let bankCounter = (questionNumber) => {
    if (questionNumber < 4) {
      bank = bank + 100;
    } else if (questionNumber === 4) {
      bank = 500;
    }
    else if (questionNumber > 4 && questionNumber < 12) {
      bank = bank * 2;
    } else if (questionNumber === 12) {
      bank = 125000;
    } else if (questionNumber > 12) {
      bank = bank * 2;
    }

  }

  // 50/50
  let hintFiftyFifty = () => {
    fiftyFiftyBtn.style.display = 'none';
  }

  // Пропустить вопрос
  let hintSkipTheQuestion = () => {
    skipTheQuestionBtn.style.display = 'none';
    outputRandomQuestions();
    bankCounter(questionNumber);
  }

  // Конец игры
  let gameOver = () => {
    startContent.style.display = 'none';
    mainContent.style.display = 'none';
    end.style.display = 'block';
    repeat.addEventListener("click", () => window.location.reload());
  }

  // Вывод рандомных вопросов
  let outputRandomQuestions = () => {
    let random = Math.floor(Math.random() * dataJSON.length);
    let dataQuestion = dataJSON.slice(random - 1, random);

    // Вывод не больше 15 вопросов
    if (questionNumber < 15) {
      questionNumber++;
      answersList.innerHTML = '';

      for (let element = 0; element < dataQuestion.length; element++) {

        //Все варианты ответов
        let allAnswers = [dataQuestion[element].A, dataQuestion[element].B, dataQuestion[element].C, dataQuestion[element].D];

        questionText.innerHTML = questionNumber + '.' + dataQuestion[element].question;
        for (let item = 0; item < allAnswers.length; item++) {
          let answerItem = document.createElement("li");
          answerItem.innerHTML = allAnswers[item];
          answersList.appendChild(answerItem).id = item;

          answerItem.addEventListener("click", function (e) {
            userAnswer = e.target.id;
            userAnswer === dataQuestion[element].answer ?
              (
                outputRandomQuestions(),
                bankCounter(questionNumber)
              )
              : (gameOver(),
                gameEnd.innerHTML = `${userName}, you've lost! You have earned: ${bank}$`)
          })
        }

      }
    } else {
      gameOver();
      gameEnd.innerHTML = `${userName}, сongratulations! You are a millionaire! You have earned: ${bank}$`;
    }
  }

  // Начало игры
  let startGame = () => {
    startContent.style.display = 'block';
    mainContent.style.display = 'none';
    end.style.display = 'none';

    startBtn.addEventListener("click", () => {
      startContent.style.display = 'none';
      mainContent.style.display = 'block';
      end.style.display = 'none';

      userName = inputUserName.value;
      inputUserName.value = '';
      outputRandomQuestions();

      skipTheQuestionBtn.addEventListener("click", () => hintSkipTheQuestion());
      fiftyFiftyBtn.addEventListener("click", () => hintFiftyFifty());
    });
  }

  startGame();
});
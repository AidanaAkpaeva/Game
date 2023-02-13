// 3 этап - вывести подсказки
let container = document.getElementById('container');

const URL = 'https://pastebin.com/raw/QRGzxxEy'; //JSON-файл с вопросами

let questionNumber = 0;
let hint1 = true;
let hint2 = true;

async function game() {
  const response = await fetch(URL);
  const dataJSON = response.json();
  return dataJSON;
}

game().then(dataJSON => {
  // 50/50
  let hintFiftyFifty = (dataQuestion, allAnswers) => {
    hint1 = false;

    delete allAnswers[dataQuestion["answer"]];
    let res = Object.keys(allAnswers);

    let rand1 = Math.floor(Math.random() * (Object.keys(allAnswers).length));
    let rand2 = Math.floor(Math.random() * (Object.keys(allAnswers).length));

    if (rand1 !== rand2) {
      let wrongAnswer1 = document.getElementById(`${res[rand1]}`);
      let wrongAnswer2 = document.getElementById(`${res[rand2]}`);

      wrongAnswer1.style.visibility = 'hidden';
      wrongAnswer2.style.visibility = 'hidden';
    } else {
      rand2 = Math.floor(Math.random() * (Object.keys(allAnswers).length));
      hintFiftyFifty(dataQuestion, allAnswers);
    }
  }

  // Пропустить вопрос
  let hintSkipTheQuestion = () => {
    hint2 = false;
    outputRandomQuestions();
  }

  // Проверка ответа на правильность
  let checkTheAnswer = (answerItem, dataQuestion) => {
    answerItem.addEventListener("click", function (e) {
      userAnswer = e.target.innerHTML;

      userAnswer === dataQuestion[dataQuestion["answer"]] ?
        (
          outputRandomQuestions()
        ) : (
          console.log('No correct!')
        )
    })
  }

  let outputRandomQuestions = () => {
    container.innerHTML = '';

    let mainContent = document.createElement('div');
    container.appendChild(mainContent).id = 'main-content';

    // Создание кнопок для подсказок
    let fiftyFiftyBtn = document.createElement('button');
    fiftyFiftyBtn.innerHTML = '50/50';
    mainContent.appendChild(fiftyFiftyBtn).id = 'fiftyFiftyBtn';

    let skipTheQuestionBtn = document.createElement('button');
    skipTheQuestionBtn.innerHTML = 'Skip the question';
    mainContent.appendChild(skipTheQuestionBtn).id = 'skipTheQuestionBtn';

    if (hint1 === false) {
      fiftyFiftyBtn.style.display = 'none'
    }

    if (hint2 === false) {
      skipTheQuestionBtn.style.display = 'none'
    }

    // Вывод вопросов
    let questions__container = document.createElement('div');
    mainContent.appendChild(questions__container).id = 'questions__container';

    let questionText = document.createElement('span');
    questions__container.appendChild(questionText).id = 'question__text';

    let answersList = document.createElement('ol');
    answersList.setAttribute('type', 'A');
    questions__container.appendChild(answersList).id = 'answers__list';

    let random = Math.floor(Math.random() * dataJSON.length);
    let dataQuestion = dataJSON[random];
    ({ answer, question, ...allAnswers } = dataQuestion);

    if (questionNumber < 15) {
      questionNumber++;
      answersList.innerHTML = '';

      questionText.innerHTML = questionNumber + '.' + dataQuestion["question"];
      for (let key in allAnswers) {
        let answerItem = document.createElement("li");
        answerItem.innerHTML = allAnswers[key];
        answersList.appendChild(answerItem).id = key;
        checkTheAnswer(answerItem, dataQuestion);
      }
    } else {
      console.log('You win!')
    }

    fiftyFiftyBtn.addEventListener("click", () => hintFiftyFifty(dataQuestion, allAnswers));
    skipTheQuestionBtn.addEventListener("click", () => hintSkipTheQuestion());
  }

  outputRandomQuestions();
})

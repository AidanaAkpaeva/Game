// 2 этап - вывести вопросы и варианты ответов, проверка ответов
let container = document.getElementById('container');

const URL = 'https://pastebin.com/raw/QRGzxxEy'; //JSON-файл с вопросами

let questionNumber = 0;

async function game() {
  const response = await fetch(URL);
  const dataJSON = response.json();
  return dataJSON;
}

game().then(dataJSON => {
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
  }

  outputRandomQuestions();
})

// 2 этап - вывести вопросы и варианты ответов, проверка ответов
let container = document.getElementById('container');
const URL = 'http://localhost:8080/question.json';

let questionNumber = 0;

const game = async () => {
  try {
    let response = await fetch(URL);
    const dataJSON = await response.json().then(data => {
      return data;
    });

    // Проверка ответа на правильность
    let checkTheAnswer = (answerItem, dataQuestion) => {
      answerItem.addEventListener("click", function (e) {
        let userAnswer = e.target.innerHTML;
        userAnswer === dataQuestion[dataQuestion["answer"]] ? (outputRandomQuestions()) : messageLose()
      })
    }

    let messageLose = () => {
      container.innerHTML = '';
      let message = document.createElement('div');
      container.appendChild(message);
      message.innerHTML = 'You lose!';
    }

    let messageWin = () => {
      container.innerHTML = '';
      let message = document.createElement('div');
      container.appendChild(message);
      message.innerHTML = 'You win!';
    }

    let outputRandomQuestions = () => {
      container.innerHTML = '';

      let mainContent = document.createElement('div');
      container.appendChild(mainContent).id = 'main-content';

      // Вывод вопросов
      const questions__container = document.createElement('div');
      mainContent.appendChild(questions__container).id = 'questions__container';

      let questionText = document.createElement('span');
      questions__container.appendChild(questionText).id = 'question__text';

      let answersList = document.createElement('ol');
      answersList.setAttribute('type', 'A');
      questions__container.appendChild(answersList).id = 'answers__list';

      let random = Math.floor(Math.random() * dataJSON.length);
      let dataQuestion = dataJSON[random];
      ({answer, question, ...allAnswers} = dataQuestion);

      if (questionNumber < 15) {
        questionNumber++;
        answersList.innerHTML = '';

        questionText.innerHTML = questionNumber + ". " + dataQuestion["question"];
        for (let key in allAnswers) {
          let answerItem = document.createElement("li");
          answerItem.innerHTML = allAnswers[key];
          answersList.appendChild(answerItem).id = key;
          checkTheAnswer(answerItem, dataQuestion);
        }
      } else {
        messageWin(mainContent)
      }
    }
    outputRandomQuestions();
  } catch (err) {
    alert(err)
  }
}

game();


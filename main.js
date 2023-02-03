console.log('Game: "Who Wants to Be a Millionaire?"');

const URL = 'https://pastebin.com/raw/QRGzxxEy'; //JSON-файл с вопросами
let userName;
let questionNumber = 0;
let bank = 0;
let count = 0;
let userAnswer;

async function game() {
  const response = await fetch(URL);
  const dataJSON = await response.json();
  return dataJSON;
}

game().then(dataJSON => {
  // 50/50
  let hintFiftyFifty = (element) => {
    console.log('');
    console.log('You used the "50/50" hint. Choose an answer option:');
    switch (element.answer) {
      case 'A':
        console.log(element.answer + '. ' + element.A);
        console.log('C. ' + element.C);
        break;
      case 'B':
        console.log('A. ' + element.A);
        console.log(element.answer + '. ' + element.B);
        break;
      case 'C':
        console.log(element.answer + '. ' + element.C);
        console.log('D. ' + element.D);
        break;
      case 'D':
        console.log('B. ' + element.B);
        console.log(element.answer + '. ' + element.D);
        break;
      default:
        console.log('error')
        break;
    }
    userAnswer = prompt('Enter your answer: ').toUpperCase();
    correctAnswer(userAnswer, element);
  }

  // Пропустить вопрос
  let hintSkipTheQuestion = () => {
    console.log('');
    console.log('You used the "Skip question" hint. Next question.');
    console.log('');
    outputRandomQuestions();
  }

  // Генерирует случайный вопрос
  let randomQuestions = (element) => {
    console.log(++questionNumber + '.' + element.question);
    console.log('A.' + element.A);
    console.log('B.' + element.B);
    console.log('C.' + element.C);
    console.log('D.' + element.D);
    console.log('');
    console.log('Correct answer: ' + element.answer)
  }

  // Проверка ответа на правильность
  let correctAnswer = (userAnswer, element) => {
    if (userAnswer === element.answer) {
      console.log('Correct!');
      console.log('');

      // Счетчик заработанных денег
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

      outputRandomQuestions();
    }
    else {
      console.log(`${userName}, you've lost! You have earned: ${bank}$`);
    }
  }

  // Вывод рандомных вопросов
  let outputRandomQuestions = () => {
    let random = Math.floor(Math.random() * 547); // всего 547 вопросов

    // Вывод не больше 15 вопросов
    if (count < 15) {
      count++;

      dataJSON.slice(random - 1, random).forEach(function (element) {
        // Можно ли проверить что выводится в консоль?
        console.log('Hints:')
        console.log('1.Hint "50/50"');
        console.log('2.Hint "Skip the question"');
        console.log('');

        console.log('Question:');
        randomQuestions(element);

        // Ввод ответа и делаем буквы заглавными
        console.log('');
        userAnswer = prompt('Enter your answer: ').toUpperCase();

        switch (userAnswer) {
          case '1':
            hintFiftyFifty(element);
            break;
          case '2':
            hintSkipTheQuestion();
          default:
            correctAnswer(userAnswer, element);
            break;
        }
      })
    } else {
      console.log(`${userName}, you've win! You have earned: ${bank}$`);
    }
  }

  userName = prompt('What is your name?');
  console.log('');

  outputRandomQuestions();
});

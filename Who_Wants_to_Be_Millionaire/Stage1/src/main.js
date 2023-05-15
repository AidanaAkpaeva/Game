// 1 этап - вывод всех вопросов на экран
let container = document.getElementById('container');

const URL = 'http://localhost:8080/question.json';

const game = async () => {
  try {
    let response = await fetch(URL);
    const dataJSON = await response.json().then(data => {
      return data;
    });
    container.innerHTML = JSON.stringify(dataJSON);
  } catch (error) {
    alert(error)
  }
}

game();
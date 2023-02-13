// 1 этап - подключить JSON файл
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
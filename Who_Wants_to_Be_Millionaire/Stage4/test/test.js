import path from 'path';
import {StageTest, correct, wrong} from 'hs-test-web-ts';

const pagePath = path.join(import.meta.url, '../../src/index.html');

class Test extends StageTest {
  page = this.getPage(pagePath);

  tests = [
    // Test 1 - check the open page
    this.node.execute(async () => {
      await this.page.open();
      return correct();
    }),

    // Test 2 - check input with id=input__user-name
    this.page.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const inputName = document.getElementById('input__user-name');
      return inputName ? correct() : wrong('Not found input. Use input with id=input__user-name.');
    }),

    // Test 3 - check paragraph with id=game-end
    this.node.execute(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.URL = "http://localhost:8080/question.json";
        this.container = await this.page.findById('container');
        this.index = {'A': 0, 'B': 1, 'C': 2, 'D': 3};

        this.inputNameValue = await this.page.evaluate(async () => {
          let inputName = document.getElementById('input__user-name')
          return inputName.value;
        })

        return fetch(this.URL)
          .then((response) => response.json())
          .then(async (data) => {
            const button = await this.page.findBySelector("button");
            const isEventHappenedBtn = button.waitForEvent("click", 2000);
            await button.click();

            if (await isEventHappenedBtn === true) {
              this.answers = await this.page.findAllBySelector("li");
              let containerText = await this.container.textContent();
              for (let i in data) {
                if (containerText.includes(data[i].question)) {
                  let indexAnswer = this.index[data[i].answer];

                  this.answers.splice(indexAnswer, 1);

                  let random = Math.floor(Math.random() * this.answers.length);
                  let isEventHappened = this.answers[random].waitForEvent("click", 2000);
                  await this.answers[random].click();

                  if (await isEventHappened === true) {
                    let gameEnd = await this.page.findById('game-end')
                    return (gameEnd) ?
                      correct() :
                      wrong("Not found paragraph. Use paragraph with id=game-end.")
                  }
                }
              }
            }
          })
      }
    ),

    // Test 4 - check name
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let gameEnd = await this.page.findById('game-end')
      let gameEndText = await gameEnd.textContent();
      return (!gameEndText.includes(this.inputNameValue.toString())) ?
        correct() :
        wrong("The name entered during the input does not match the one displayed. Entered name: " + this.inputNameValue.toString() + ', what is displayed on the page: ' + gameEndText)
    }),
  ]
}

it("Test stage", async () => {
  await new Test().runTests()
}).timeout(30000);

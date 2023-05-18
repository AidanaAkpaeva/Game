import path from 'path';

const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web-ts';

class Test extends StageTest {
  page = this.getPage(pagePath);

  tests = [
    // Test 1 - check the open page
    this.node.execute(async () => {
      await this.page.open();
      return correct()
    }),

    // Test 2 - check container
    this.page.execute(() => {
      const container = document.getElementById("container");
      return container ?
        correct() :
        wrong("Not found container. You should create a container with id=container")
    }),

    // Test 3 - check start button
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.startButton = await this.page.findById('start');
      return this.startButton ? correct() : wrong(`Not found button with id=start.`);
    }),

    // Test 4 - check input with id=input__user-name
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isEventHappenedStartBtn = this.startButton.waitForEvent("click", 2000);
      await this.startButton.click();

      if (await isEventHappenedStartBtn === true) {
        const inputName = await this.page.findById('input__user-name');

        await inputName.inputText('Ann');

        this.inputNameValue = await this.page.evaluate(async () => {
          let inputName = document.getElementById('input__user-name');
          return inputName.value;
        });
        return inputName ? correct() : wrong('Not found input. Use input with id=input__user-name.');
      }
    }),

    // Test 5 - check the output questions
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const button = await this.page.findBySelector("button");
      const isEventHappenedBtn = button.waitForEvent("click", 2000);
      await button.click();

      this.URL = "http://localhost:8080/question.json";
      this.container = await this.page.findById('container');
      const containerText = await this.container.textContent();

      if (await isEventHappenedBtn === true) {
        return fetch(this.URL)
          .then((response) => response.json())
          .then((data) => {
            let isQuestion = false;
            for (let i in data) {
              if (containerText.includes(data[i].question)) {
                isQuestion = true;
              }
            }
            return isQuestion === true ? correct() : wrong("Questions and answer options are not displayed on the page.");
          });
      }
    }),

    // Test 6 - check switch levels
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.index = {'A': 0, 'B': 1, 'C': 2, 'D': 3};

      this.checkQuestions = async () => {
        return fetch(this.URL)
          .then((response) => response.json())
          .then(async (data) => {
            let containerText = await this.container.textContent();
            const answers = await this.page.findAllBySelector("li");
            let isEventHappened = false;
            for (let i in data) {
              if (containerText.includes(data[i].question)) {
                let indexAnswer = this.index[data[i].answer];
                isEventHappened = answers[indexAnswer].waitForEvent("click", 2000);
                await answers[indexAnswer].click();
              }
            }
            return isEventHappened;
          })
      }
      let isEventHappened = await this.checkQuestions();
      if (isEventHappened === false) {
        return wrong('Does not proceed to the next question. After clicking on the correct answer, the following question should be displayed.');
      } else return correct();
    }),

    // Test 7 - check have a button fiftyFiftyBtn
    this.page.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const fiftyFiftyBtn = document.getElementById('fiftyFiftyBtn');
      return fiftyFiftyBtn ? correct() : wrong('Not found button. Your page must contain a button with id=fiftyFiftyBtn.')
    }),

    // Test 7 - check work a button fiftyFiftyBtn
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.answers = await this.page.findAllBySelector('li');
      this.container = await this.page.findById('container');

      this.fiftyFiftyBtn = await this.page.findById("fiftyFiftyBtn");
      this.isEventHappened = this.fiftyFiftyBtn.waitForEvent("click", 2000);
      await this.fiftyFiftyBtn.click();

      let answersVisible = [];

      if (await this.isEventHappened === true) {
        for (let i in this.answers) {
          let answersStyle = await this.answers[i].getStyles();
          if (answersStyle.visibility !== 'hidden') {
            answersVisible.push(this.answers[i]);
          }
        }
      }

      return fetch(this.URL)
        .then((response) => response.json())
        .then(async (data) => {
          let containerText = await this.container.textContent();
          for (let i in data) {
            if (containerText.includes(data[i].question)) {
              let indexAnswer = this.index[data[i].answer];
              let answersVisibleText = await answersVisible[indexAnswer].textContent();
              return (containerText.includes(answersVisibleText) && answersVisible.length === 2) ?
                correct() :
                wrong("Displayed " + answersVisible.length + " answers. After the click, only two answers should be displayed and one of them should be correct.")
            }
          }
        })
    }),

    // Test 8 - check hide hint FiftyFifty
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      await this.fiftyFiftyBtn.click();
      let answersVisible = [];

      if (await this.isEventHappened === true) {
        for (let i in this.answers) {
          let answersStyle = await this.answers[i].getStyles();
          if (answersStyle.visibility !== 'hidden' || answersStyle.display !== 'none' || answersStyle.overflow !== 'hidden') {
            answersVisible.push(this.answers[i]);
          }
        }
      }

      return fetch(this.URL)
        .then((response) => response.json())
        .then(async (data) => {
          let containerText = await this.container.textContent();
          for (let i in data) {
            if (containerText.includes(data[i].question)) {
              let indexAnswer = this.index[data[i].answer];
              let isEventHappenedBtn = answersVisible[indexAnswer].waitForEvent("click", 2000);
              await answersVisible[indexAnswer].click();
              let btnStyles = await this.fiftyFiftyBtn.getStyles();
              if (await isEventHappenedBtn === true) {
                return (btnStyles.visibility === 'hidden' || btnStyles.display === 'none' || btnStyles.overflow === 'hidden') ?
                  correct() :
                  wrong("After selecting the answer, the button with the hint should be hidden.")
              }
            }
          }
        })
    }),

    // Test 9 - check have a button skipTheQuestionBtn
    this.page.execute(() => {
      const skipTheQuestionBtn = document.getElementById('skipTheQuestionBtn');
      return skipTheQuestionBtn ? correct() : wrong('Not found button. Your page must contain a button with id=skipTheQuestionBtn.')
    }),

    // Test 10 - check work a button skipTheQuestionBtn
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let containerInit = await this.container.textContent();

      this.skipTheQuestionBtn = await this.page.findById("skipTheQuestionBtn");
      const isEventHappened = this.skipTheQuestionBtn.waitForEvent("click", 2000);
      await this.skipTheQuestionBtn.click();

      return fetch(this.URL)
        .then((response) => response.json())
        .then(async (data) => {
          let isQuestion = false;
          for (let i in data) {
            if (containerInit.includes(data[i].question)) {
              if (await isEventHappened === true) {
                let containerText = await this.container.textContent();
                if (containerInit !== containerText)
                  isQuestion = true;
              }
            }
          }
          return isQuestion === true ? correct() : wrong("After clicking on the button with a hint, we move on to the next question.");
        });

    }),

    // Test 11 - check hide hint SkipTheQuestion
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const isEventHappened = this.skipTheQuestionBtn.waitForEvent("click", 2000);
      await this.skipTheQuestionBtn.click();

      if (await isEventHappened === true) {
        const btnStyle = await this.skipTheQuestionBtn.getStyles();
        return (btnStyle.visibility === 'hidden' || btnStyle.display === 'none' || btnStyle.overflow === 'hidden') ?
          correct() :
          wrong("After clicking on the button with the hint, it is not hidden.");
      }
    }),

    // Test 12 - check paragraph with id=game-end
    this.node.execute(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        return fetch(this.URL)
          .then((response) => response.json())
          .then(async (data) => {
            for (let i in data) {
              this.indexAnswer = this.index[data[i].answer];
              this.answers.splice(this.indexAnswer, 1);

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
          })
      }
    ),

    // Test 13 - check name
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      let gameEnd = await this.page.findById('game-end')
      let gameEndText = await gameEnd.textContent();
      return (gameEndText.includes(this.inputNameValue.toString())) ?
        correct() :
        wrong("The name entered during the input does not match the one displayed. Entered name: " + this.inputNameValue.toString() + '. What is displayed on the page: ' + gameEndText)
    }),

    //   Test 14 - check winning
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let playAganBtn = await this.page.findBySelector('button');
      const isEventHappened = playAganBtn.waitForEvent("click", 2000);
      await playAganBtn.click();
      if (await isEventHappened === true) {

        let countQuestions = 0;
        const isEventHappenedStartBtn = this.startButton.waitForEvent("click", 2000);
        await this.startButton.click();

        if (await isEventHappenedStartBtn === true) {
          const button = await this.page.findBySelector("button");
          const isEventHappenedBtn = button.waitForEvent("click", 2000);
          await button.click();

          if (isEventHappenedBtn) {
            this.checkQuestions = async () => {
              return fetch(this.URL)
                .then((response) => response.json())
                .then(async (data) => {
                  let containerText = await this.container.textContent();
                  const answers = await this.page.findAllBySelector("li");
                  let isEventHappened = false;
                  for (let i in data) {
                    if (containerText.includes(data[i].question)) {
                      countQuestions++;

                      let indexAnswer = this.index[data[i].answer];
                      isEventHappened = answers[indexAnswer].waitForEvent("click", 2000);
                      await answers[indexAnswer].click();
                    }
                  }
                  return isEventHappened;
                })
            }
            while (countQuestions < 15) {
              let containerText = await this.container.textContent();
              let isEventHappened = await this.checkQuestions();
              if (await isEventHappened !== true) {
                return wrong("The winning message is not displayed on the page. But found: " + containerText);
              }
            }
            return correct();
          }
        }
      }
    }),

    //   Test 15 - check loss
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let playAganBtn = await this.page.findBySelector('button');
      const isEventHappened = playAganBtn.waitForEvent("click", 2000);
      await playAganBtn.click();
      if (isEventHappened) {
        const isEventHappenedStartBtn = this.startButton.waitForEvent("click", 2000);
        await this.startButton.click();

        if (await isEventHappenedStartBtn === true) {
          const button = await this.page.findBySelector("button");
          const isEventHappenedBtn = button.waitForEvent("click", 2000);
          await button.click();

          if (isEventHappenedBtn) {
            return fetch(this.URL)
              .then((response) => response.json())
              .then(async (data) => {
                for (let i in data) {
                  this.answers.splice(this.indexAnswer, 1);

                  let random = Math.floor(Math.random() * this.answers.length);
                  let isEventHappened = this.answers[random].waitForEvent("click", 2000);
                  await this.answers[random].click();

                  if (await isEventHappened === true) {
                    let containerText = await this.container.textContent();
                    return containerText.includes('lost') || containerText.includes('lose') ?
                      correct() :
                      wrong("The defeat message is not displayed on the page. But found: " + containerText)
                  }
                }
              })
          }
        }
      }
    }),

    // Test 16 - check money counter
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // let countQuestions = 0;
      let playAganBtn = await this.page.findBySelector('button');
      const isEventHappened = playAganBtn.waitForEvent("click", 2000);
      await playAganBtn.click();

      if (isEventHappened) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const button = await this.page.findBySelector("button");
        const isEventHappenedBtn = button.waitForEvent("click", 2000);
        await button.click();

        if (isEventHappenedBtn) {
          this.checkQuestions = async () => {
            return fetch(this.URL)
              .then((response) => response.json())
              .then(async (data) => {
                let containerText = await this.container.textContent();
                let isEventHappened = false;
                for (let i in data) {
                  if (containerText.includes(data[i].question)) {
                    let random = Math.floor(Math.random() * this.answers.length);
                    isEventHappened = this.answers[random].waitForEvent("click", 2000);
                    await this.answers[random].click();
                  }
                }
                return isEventHappened;
              })
          };

          for (let countQuestions = 0; countQuestions < 15; countQuestions++) {
            let isEventHappened = await this.checkQuestions();
            let containerText = await this.container.textContent();

            if (await isEventHappened !== true) {
              if (countQuestions < 4 && (containerText.includes('100$') || containerText.includes('200$') || containerText.includes('300$'))) {
                return correct();
              } else if (countQuestions === 4 && containerText.includes('500$')) {
                return correct();
              } else if (countQuestions > 4 && countQuestions < 12 && (containerText.includes('1000$') || containerText.includes('2000$') || containerText.includes('4000$') || containerText.includes('8000$') || containerText.includes('16000$') || containerText.includes('32000$') || containerText.includes('64000$'))) {
                return correct();
              } else if (countQuestions === 12 && containerText.includes('125000$')) {
                return correct();
              } else if (countQuestions > 15 && containerText.includes('1000000$')) {
                return correct()
              } else return wrong("The money won is displayed incorrectly. What is displayed: " + containerText);
            }
          }
          return correct();
        }
      }
    })
  ]
}

it("Test stage", async () => {
  await new Test().runTests()
}).timeout(30000);

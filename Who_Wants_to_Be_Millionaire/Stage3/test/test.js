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

    // Test 3 - check the output questions
    this.page.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const URL = "http://localhost:8080/question.json";
      const container = document.getElementById("container");
      const containerText = container.textContent;

      return fetch(URL)
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
    }),

    // Test 4 - check switch levels
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.URL = "http://localhost:8080/question.json";
      this.container = await this.page.findById('container');
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

    // Test 5 - check have a button fiftyFiftyBtn
    this.page.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const fiftyFiftyBtn = document.getElementById('fiftyFiftyBtn');
      return fiftyFiftyBtn ? correct() : wrong('Not found button. Your page must contain a button with id=fiftyFiftyBtn.')
    }),

    // Test 6 - check work a button fiftyFiftyBtn
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.URL = "http://localhost:8080/question.json";

      this.answers = await this.page.findAllBySelector('li');
      this.container = await this.page.findById('container');

      this.fiftyFiftyBtn = await this.page.findById("fiftyFiftyBtn");
      this.isEventHappened = this.fiftyFiftyBtn.waitForEvent("click", 2000);
      await this.fiftyFiftyBtn.click();

      let answersVisible = [];
      this.index = {'A': 0, 'B': 1, 'C': 2, 'D': 3}

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

    // Test 7 - check hide hint FiftyFifty
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

    // Test 8 - check have a button skipTheQuestionBtn
    this.page.execute(() => {
      const skipTheQuestionBtn = document.getElementById('skipTheQuestionBtn');
      return skipTheQuestionBtn ? correct() : wrong('Not found button. Your page must contain a button with id=skipTheQuestionBtn.')
    }),

    // Test 9 - check work a button skipTheQuestionBtn
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

    // Test 10 - check hide hint SkipTheQuestion
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
  ]
}

it("Test stage", async () => {
  await new Test().runTests()
}).timeout(30000);

import path from "path";
import {StageTest, correct, wrong} from "hs-test-web-ts";
import {doc} from "mocha/lib/reporters/index.js";

const pagePath = path.join(import.meta.url, "../../src/index.html");

class Test extends StageTest {
  page = this.getPage(pagePath);

  tests = [
    // Test 1 - check the open page
    this.node.execute(async () => {
      await this.page.open();
      return correct();
    }),

    // Test 2 - check the output questions
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

    // Test 3 -  check user answer, switch levels and output no more than 15 question
    this.node.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.URL = "http://localhost:8080/question.json";
      this.container = await this.page.findById('container');
      this.index = {'A': 0, 'B': 1, 'C': 2, 'D': 3};
      let countQuestions = 0;

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
        let isEventHappened = await this.checkQuestions();
        if (isEventHappened !== true) {
          return wrong('The user\'s answer is incorrectly marked or not 15 questions are displayed.');
        }
      }
      return correct();
    }),
  ]
}
;

it("Test stage", async () => {
  await new Test().runTests()
}).timeout(30000);

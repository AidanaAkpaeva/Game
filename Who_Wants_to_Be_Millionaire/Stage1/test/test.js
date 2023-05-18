import path from "path";
import {StageTest, correct, wrong} from "hs-test-web-ts";

const pagePath = path.join(import.meta.url, "../../src/index.html");

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

    // Test 3 - check the function game()
    this.page.execute(() => {
      return typeof game() === "object" ?
        correct() :
        wrong("Not found function game(). Your page must contain a function with 'game()' name.")
    }),

    // Test 4 - check the container for contents
    this.page.execute(async () => {
      const URL = "http://localhost:8080/question.json";

      await new Promise(resolve => setTimeout(resolve, 1000));
      const container = document.getElementById("container");
      const containerText = container.textContent;

      return fetch(URL)
        .then((response) => response.json())
        .then((data) => {
          return containerText !== JSON.stringify(data) ?
            wrong("Expected container text to be questions, but found: " + containerText) :
            correct();
        });
    })
  ]
}

it("Test stage", async () => {
  await new Test().runTests()
}).timeout(30000);

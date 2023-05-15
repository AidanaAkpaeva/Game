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

    // Test 2 - check start button
    this.page.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let startButton = document.getElementById('start');
      return startButton ? correct() : wrong(`Not found button with id=start.` + startButton);
    })]
}

it("Test stage", async () => {
  await new Test().runTests()
}).timeout(30000);

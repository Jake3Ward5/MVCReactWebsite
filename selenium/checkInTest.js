
const {Builder, By, Key, until, UnhandledPromiseRejectionWarning} = require('selenium-webdriver');
var assert = require('assert');



(async function checkIn() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    driver.get('http://localhost:3000');
    await sleep(3000);
    await driver.findElement(By.name('username')).sendKeys('Blanc');
    await driver.findElement(By.name('password')).sendKeys('Berry');
    await sleep(1000);
    await driver.findElement(By.id('submit')).click();
    await sleep(3000);
    await driver.findElement(By.xpath('//*[@id="root"]/div/main/div/table/tbody/tr[1]/td[10]/a')).click();
    await sleep(2000);
    await driver.findElement(By.xpath('//*[@id="checkIn"]')).click();
    await sleep(3000);
    var check = await driver.findElement(By.xpath('//*[@id="checkIn"]')).getText()

    if(check === "check In") {
      console.log("File has been succsessfully Checked Out")
    } else {
      console.log("File has been succsessfully Checked In")
    }
} catch (err) {
    //do a thing
    console.log(err);
  }
  
  finally {
    driver.quit();
  }
})();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

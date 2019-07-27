const {Builder, By, Key, until} = require('selenium-webdriver');
var assert = require('assert');



(async function updateFile() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    driver.get('http://localhost:3000');
    await sleep(3000);
    driver.findElement(By.name('username')).sendKeys('Blanc');
    driver.findElement(By.name('password')).sendKeys('Berry');
    await sleep(1000);
    driver.findElement(By.id('submit')).click();
    await sleep(3000);
    driver.findElement(By.xpath('//*[@id="root"]/div/main/div/table/tbody/tr[1]/td[10]/a')).click();
    await sleep(3000);
    driver.findElement(By.xpath('//*[@id="root"]/div/main/div/div/div[2]/span/div/button[2]/a')).click();
    await sleep(2000)
    driver.findElement(By.name('file_location')).clear();
    driver.findElement(By.name('file_location')).sendKeys('Jeff/Pictures/Different');
    await sleep(500)
    driver.findElement(By.xpath('//*[@id="root"]/div/main/div/div/div[2]/button[2]')).click();
    await sleep(5000)
    let response = await isAlertPresent(driver)
    if(response === "Uploaded File"){
        console.log('Assert true. File has been Created Correctly')
    } else {
        console.log('Assert false. File Failed To be created')
    }

} catch (err) {
    //do a thing
    console.log("Failed To create new file");
    console.log(err);
  }
  
  finally {
    driver.quit();
  }
})();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function isAlertPresent(driver) 
{ 
    try 
    { 
        var response = await driver.switchTo().alert().getText();			 
        return response; 
    }   // try 
    catch (Err) 
    { 
        return false; 
    }   // catch 
}   // isAlertPresent()
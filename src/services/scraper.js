const {By, Key, Builder} = require('selenium-webdriver');
require ('chromedriver');

async function test() {
    let driver = await new Builder().forBrowser('chrome').build();
    
    await driver.get('https://www.google.com');

    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);

    setTimeout(function() {
        driver.quit();
    }, 10000);
}

test();
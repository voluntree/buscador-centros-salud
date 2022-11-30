const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const opts = new chrome.Options();

async function helloSelenium() {
    opts.headless(true);
    let driver = await new webdriver.Builder().
                 forBrowser('chrome')
                 .setChromeOptions(opts)
                 .build();

    await driver.get('https://selenium.dev');

}

helloSelenium();
<<<<<<< Updated upstream
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
=======
const { By, Key, Builder, WebElement } = require("selenium-webdriver");
require("chromedriver");

async function test() {
  let driver = await new Builder().forBrowser("chrome").build();

  await driver.get("https://www.coordenadas-gps.com/");

  const campoDireccion = await driver.findElement(By.id("address"));
  const campoLatitud = await driver.findElement(By.id("latitude"));
  const campoLongitud = await driver.findElement(By.id("longitude"));
  const botonDireccion = await driver.findElement(
    By.xpath("//*[@id=\"wrap\"]/div[2]/div[3]/div[1]/form[1]/div[2]/div/button")
  );
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await campoDireccion.clear();
  await campoDireccion.sendKeys("Camino de Vera 22 Valencia");
  botonDireccion.click();
}

test();
>>>>>>> Stashed changes

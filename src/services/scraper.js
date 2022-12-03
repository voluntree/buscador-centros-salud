const { By } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const opts = new chrome.Options();

export async function getCoordenadasCV(direccion, provincia, municipio) {
    opts.headless(true)
    opts.windowSize({width: 1366, height: 768})
    let driver = await new webdriver.Builder().
                 forBrowser('chrome')
                 .setChromeOptions(opts)
                 .build();

    await driver.get('https://www.coordenadas-gps.com/');
    
    var direccionInput = await driver.findElement(By.id("address"));
    await direccionInput.clear();
    await direccionInput.sendKeys(direccion + " " + provincia + " " + municipio);

    var obtenerCoordenadas = await driver.findElement(By.xpath('//*[@id="wrap"]/div[2]/div[3]/div[1]/form[1]/div[2]/div/button'))
    await obtenerCoordenadas.click();
    await sleep(1000);

    var latitudeInput = await driver.findElement(By.id("latitude"));
    var latitud = await latitudeInput.getAttribute("value");
    console.log(latitud);

    var longitudeInput = await driver.findElement(By.id("longitude"));
    var longitud = await longitudeInput.getAttribute("value");
    console.log(longitud);

    var data = await (await direccionInput.getAttribute("value")).split(",");
    var codigo_postal = data[data.length - 2].substring(1, 6);
    console.log(codigo_postal);
    
    driver.quit()

    return [{latitud: latitud}, {longitud: longitud}, {codigo_postal: codigo_postal}]
}

export async function getTelefonoCV(nombre) {
    opts.windowSize({width: 1920, height: 1080})
    let driver = await new webdriver.Builder().
                 forBrowser('chrome')
                 .setChromeOptions(opts)
                 .build();

    await driver.get('https://www.google.es/');
    var ventanaCookies = await driver.findElement(By.xpath('//*[@id="L2AGLb"]/div'));
    if(ventanaCookies != null){
        console.log("Detectado caja cookies");
        await ventanaCookies.click()
    }

    var barraBusqueda = await driver.findElement(By.name("q"));
    await barraBusqueda.sendKeys(nombre);
    await barraBusqueda.submit();
    await sleep(1000)

    var contenedorTelefono = await driver.findElement(By.xpath('//*[@id="kp-wp-tab-overview"]/div[1]/div/div/div/div/div/div[7]/div/div/div/span[2]/span/a/span/span'))
    if(contenedorTelefono != null){
        var telefono = await contenedorTelefono.getAttribute("innerText");
        console.log(telefono)
    }
    
    driver.quit()
}

getTelefonoCV("CENTRO DE RECONOCIMIENTO DE CONDUCTORES SERMESA MISLATA")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
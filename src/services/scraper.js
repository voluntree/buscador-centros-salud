import { By } from "selenium-webdriver"
import webdriver from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"

const opts = new chrome.Options();

export async function getCoordenadas(codigo_postal, provincia, municipio) {
        opts.headless()
        opts.windowSize({width: 1366, height: 768})
        let driver = await new webdriver.Builder().
                    forBrowser('chrome')
                    .setChromeOptions(opts)
                    .build();
    var latitud = ""
    var longitud = ""
    //var codigo_postal = ""
    try{
        await driver.get('https://www.coordenadas-gps.com/');
        
       
        var direccionInput = await driver.findElement(By.id("address"));
        await direccionInput.clear();
        await direccionInput.sendKeys(codigo_postal + " " + municipio + " "  + provincia);
        console.log("Texto introducido: " + codigo_postal + " " + municipio + " "  + provincia);

        var obtenerCoordenadas = await driver.findElement(By.xpath('//*[@id="wrap"]/div[2]/div[3]/div[1]/form[1]/div[2]/div/button'))
        await obtenerCoordenadas.click();
        console.log("Obtener coordenadas pulsado");
        await sleep(3000);

        var latitudeInput = await driver.findElement(By.id("latitude"));
        latitud = await latitudeInput.getAttribute("value");
        console.log("Latitud: " + latitud);

        var longitudeInput = await driver.findElement(By.id("longitude"));
        longitud = await longitudeInput.getAttribute("value");
        console.log("Longitud: " + longitud);
        
        /*codigo_postal = data[data.length - 2].substring(0, 6).trim();
        console.log("Codigo Postal: " + codigo_postal);*/

        var data = (await direccionInput.getAttribute("value")).split(",");
        console.log("Direccion: " + data)
        driver.quit()
        console.log("Fin");

    }catch(error){
        console.error(error)
        driver.quit()
        console.error("Scraper closed")
    }
    
    var object = {
        latitud: latitud,
        longitud: longitud,
        //codigo_postal: codigo_postal 
    }

    return object
}

export async function getDireccion(latitude, longitude) {
    opts.headless()
    opts.windowSize({width: 1366, height: 1080})
    let driver = await new webdriver.Builder().
                forBrowser('chrome')
                .setChromeOptions(opts)
                .build();
var codigo_postal = ""
try{
    await driver.get('https://www.coordenadas-gps.com/');
    
    var latitudeInput = await driver.findElement(By.id("latitude"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", latitudeInput)
    await sleep(1000)


    await latitudeInput.clear();
    await latitudeInput.sendKeys(latitude)
    console.log(latitude)
    
    var longitudeInput = await driver.findElement(By.id("longitude"));
    await longitudeInput.clear();
    await longitudeInput.sendKeys(longitude)
    console.log(longitude)

    var botonCoordenadas = await driver.findElement(By.xpath('//*[@id="wrap"]/div[2]/div[3]/div[1]/form[2]/div[3]/div/button'))
    await botonCoordenadas.click()
    await sleep(2000)

    var direccionInput = await driver.findElement(By.id("address"));
    var data = (await direccionInput.getAttribute("value")).split(",");
    console.log("Direccion: " + data)

    codigo_postal = data[data.length - 2].substring(0, 6).trim();
    console.log("Codigo Postal: " + codigo_postal);
    
    driver.quit()
    console.log("Fin");

}catch(error){
    console.error(error)
    driver.quit()
    console.error("Scraper closed")
}

return codigo_postal
}

export async function getTelefono(nombre) {
    opts.headless(true)
    opts.windowSize({width: 1920, height: 1080})
    let driver = await new webdriver.Builder()
                .forBrowser('chrome')
                .setChromeOptions(opts)
                .build();
    var telefono = ""
    try{
        await driver.get('https://www.google.es/');
        var ventanaCookies = await driver.findElement(By.xpath('//*[@id="L2AGLb"]/div'));
        if(ventanaCookies != null){
            console.log("Detectado caja cookies");
            await ventanaCookies.click()
        }

        var barraBusqueda = await driver.findElement(By.name("q"));
        await barraBusqueda.sendKeys(nombre);
        await barraBusqueda.submit();
        await sleep(3000)

        var contenedorTelefono = await driver.findElement(By.xpath("//span[contains(@aria-label,'Llamar al número de teléfono')]"))
        if(contenedorTelefono != null){
            telefono = await contenedorTelefono.getAttribute("innerText");
            console.log(telefono)
        }
        
        driver.quit()
    }catch(error){
        console.error(error)
        driver.quit()
        console.error("Scraper closed")
    }
        return telefono
}

export async function getCodigoPostal(municipio, provincia) {
    opts.headless(true)
    opts.windowSize({width: 1920, height: 1080})
    let driver = await new webdriver.Builder()
                .forBrowser('chrome')
                .setChromeOptions(opts)
                .build();
    var codigo_postal = ""
    try{
        await driver.get('https://www.google.es/');
        var ventanaCookies = await driver.findElement(By.xpath('//*[@id="L2AGLb"]/div'));
        if(ventanaCookies != null){
            console.log("Detectado caja cookies");
            await ventanaCookies.click()
        }

        var barraBusqueda = await driver.findElement(By.name("q"));
        await barraBusqueda.sendKeys("codigo postal " + municipio + " " + provincia);
        console.log("codigo postal " + municipio + " " + provincia)
        await barraBusqueda.submit();
        await sleep(4000)

        var contenedorCodigoPostal = await driver.findElement(By.xpath("//div[contains(@class, 'kp-header')]"))
        if(contenedorCodigoPostal != null){
            codigo_postal = await contenedorCodigoPostal.getAttribute("innerText");
            console.log(codigo_postal)
        }
        
        driver.quit()

    }catch(error){
        console.error(error)
        driver.quit()
        console.error("Scraper closed")
    }
        return codigo_postal
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
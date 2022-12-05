
import { By } from "selenium-webdriver"
import webdriver from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"
import chromedriver from "chromedriver";

const opts = new chrome.Options();

export async function getCoordenadas(calle, provincia, municipio) {
    console.log("       - Iniciando scraper en https://www.coordenadas-gps.com/")
        opts.headless()
        opts.windowSize({width: 1366, height: 768})
        opts.excludeSwitches('enable-logging')
        let driver = await new webdriver.Builder()
                    .forBrowser('chrome')
                    .setChromeOptions(opts)
                    .build();
    var latitud = ""
    var longitud = ""
    var codigo_postal = ""
    try{
        await driver.get('https://www.coordenadas-gps.com/');
        await sleep(2000);
       
        var direccionInput = await driver.findElement(By.id("address"));
        await direccionInput.clear();
        await direccionInput.sendKeys(calle + " " + municipio + " "  + provincia);
        console.log("       - Texto introducido: " + calle + " " + municipio + " "  + provincia)

        var obtenerCoordenadas = await driver.findElement(By.xpath('//*[@id="wrap"]/div[2]/div[3]/div[1]/form[1]/div[2]/div/button'))
        await obtenerCoordenadas.click();
        console.log("       - Obteniendo datos")
        await sleep(2000);

        var latitudeInput = await driver.findElement(By.id("latitude"));
        latitud = await latitudeInput.getAttribute("value");
        console.log("       - Latitud: " + latitud)

        var longitudeInput = await driver.findElement(By.id("longitude"));
        longitud = await longitudeInput.getAttribute("value");
        console.log("       - Longitud: " + longitud);
        
        var data = (await direccionInput.getAttribute("value")).split(",");
        console.log("       - Dirección obtenida: " + data)
        codigo_postal = data[data.length - 2].substring(0, 6).trim();

        if(codigo_postal.match(/^[0-9]{5}$/) == null){
            console.log("       \x1b[31m- Dirección sin código postal\x1b[0m")

            var botonCoordenadas = await driver.findElement(By.xpath('//*[@id="wrap"]/div[2]/div[3]/div[1]/form[2]/div[3]/div/button'))
            await botonCoordenadas.click()
            console.log("       - Intentandolo de nuevo")
            await sleep(2000)

            data = (await direccionInput.getAttribute("value")).split(",");
            console.log("       - Direccion obtenida: " + data)

            codigo_postal = data[data.length - 2].substring(0, 6).trim();

            if(codigo_postal.match(/^[0-9]{5}$/) == null){
                console.log("       \x1b[31m- Direccion sin código postal\x1b[0m")
                console.log("       - Intentandolo de nuevo")

                await direccionInput.clear();
                await direccionInput.sendKeys(municipio + " "  + provincia);
                console.log("       - Texto introducido: " + municipio + " "  + provincia);

                var obtenerCoordenadas = await driver.findElement(By.xpath('//*[@id="wrap"]/div[2]/div[3]/div[1]/form[1]/div[2]/div/button'))
                await obtenerCoordenadas.click();
                console.log("       - Obteniendo datos")
                await sleep(2000);

                var latitudeInput = await driver.findElement(By.id("latitude"));
                latitud = await latitudeInput.getAttribute("value");
                console.log("       - Latitud: " + latitud)

                var longitudeInput = await driver.findElement(By.id("longitude"));
                longitud = await longitudeInput.getAttribute("value");
                console.log("       - Longitud: " + longitud);
                
                var data = (await direccionInput.getAttribute("value")).split(",");
                console.log("       - Direccion obtenida: " + data)
                codigo_postal = data[data.length - 2].substring(0, 6).trim();

                if(codigo_postal.match(/^[0-9]{5}$/) == null){
                    codigo_postal = ""
                    console.log("       \x1b[31m- No es posible obtener código postal\x1b[0m")
                }
            }
        }
        console.log("       - Codigo Postal: " + codigo_postal);
        driver.quit()
        console.log("       \x1b[32m- Datos obtenidos con exito\x1b[0m");

    }catch(error){
        driver.quit()
        console.error("     \x1b[31m- Se ha producido un error\x1b[0m")
    }
    
    var object = {
        latitud: latitud,
        longitud: longitud,
        codigo_postal: codigo_postal 
    }

    return object
}

export async function getDireccion(latitude, longitude) {
    console.log("       - Iniciando scraper en https://www.coordenadas-gps.com/")
    opts.headless()
    opts.windowSize({width: 1366, height: 1080})
    opts.excludeSwitches('enable-logging')
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
    console.log("       - Introduciendo latitud: " + latitude)
    
    var longitudeInput = await driver.findElement(By.id("longitude"));
    await longitudeInput.clear();
    await longitudeInput.sendKeys(longitude)
    console.log("       - Introduciendo longitud: " + longitude)

    var botonCoordenadas = await driver.findElement(By.xpath('//*[@id="wrap"]/div[2]/div[3]/div[1]/form[2]/div[3]/div/button'))
    await botonCoordenadas.click()
    console.log("       - Obteniendo datos")
    await sleep(2000)

    var direccionInput = await driver.findElement(By.id("address"));
    var data = (await direccionInput.getAttribute("value")).split(",");
    console.log("       - Direccion: " + data)

    codigo_postal = data[data.length - 2].substring(0, 6).trim();
    console.log("       - Codigo Postal: " + codigo_postal);
    
    driver.quit()
    console.log("       \x1b[32m- Datos obtenidos con exito\x1b[0m");

}catch(error){
    driver.quit()
    console.error("      \x1b[31m- Se ha producido un error\x1b[0m")
}

return codigo_postal
}

export async function getTelefono(nombre) {
    console.log("       - Iniciando scraper en https://www.google.es/")
    opts.headless(true)
    opts.windowSize({width: 1920, height: 1080})
    opts.excludeSwitches('enable-logging')
    let driver = await new webdriver.Builder()
                .forBrowser('chrome')
                .setChromeOptions(opts)
                .build();
    var telefono = ""
    try{
        await driver.get('https://www.google.es/');
        var ventanaCookies = await driver.findElement(By.xpath('//*[@id="L2AGLb"]/div'));

        if(ventanaCookies != null){
            await ventanaCookies.click()
        }

        var barraBusqueda = await driver.findElement(By.name("q"));
        await barraBusqueda.sendKeys(nombre);
        await barraBusqueda.submit();
        console.log("       - Obteniendo datos")
        await sleep(3000)

        var contenedorTelefono = await driver.findElement(By.xpath("//span[contains(@aria-label,'Llamar al número de teléfono')]"))
        if(contenedorTelefono != null){
            telefono = await contenedorTelefono.getAttribute("innerText");
            console.log("       - Telefono: " + telefono)
        }   
        
        driver.quit()
        console.log("       \x1b[32m- Datos obtenidos con exito\x1b[0m");

    }catch(error){
        driver.quit()
        console.error("       \x1b[31m- Se ha producido un error\x1b[0m")
    }
        return telefono
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

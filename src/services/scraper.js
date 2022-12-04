import { By } from "selenium-webdriver"
import webdriver from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"

const opts = new chrome.Options();

export async function getCoordenadas(direccion, provincia, municipio) {
    opts.headless(true)
        opts.windowSize({width: 1366, height: 768})
        let driver = await new webdriver.Builder().
                    forBrowser('chrome')
                    .setChromeOptions(opts)
                    .build();
    try{
        await driver.get('https://www.coordenadas-gps.com/');
        
       
        var direccionInput = await driver.findElement(By.id("address"));
        await direccionInput.clear();
        await direccionInput.sendKeys(direccion + " " + municipio + " "  + provincia);
        console.log("Texto introducido: " + direccion + " " + municipio + " "  + provincia);

        var obtenerCoordenadas = await driver.findElement(By.xpath('//*[@id="wrap"]/div[2]/div[3]/div[1]/form[1]/div[2]/div/button'))
        try{
        await obtenerCoordenadas.click();
        }catch(e){
            var alerta = await driver.switchTo().alert() 
        
            await alerta.accept();
            console.log("Error coordenadas")
            direccionInput = await driver.findElement(By.id("address"));
            await direccionInput.clear();
            await direccionInput.sendKeys(direccion);
            console.log("Texto introducido: " + direccion);

            obtenerCoordenadas = await driver.findElement(By.xpath('//*[@id="wrap"]/div[2]/div[3]/div[1]/form[1]/div[2]/div/button'))
            await obtenerCoordenadas.click();
        }
        
        console.log("Obtener coordenadas pulsado");
        await sleep(2000);

        var latitudeInput = await driver.findElement(By.id("latitude"));
        var latitud = await latitudeInput.getAttribute("value");
        console.log("Latitud: " + latitud);

        var longitudeInput = await driver.findElement(By.id("longitude"));
        var longitud = await longitudeInput.getAttribute("value");
        console.log("Longitud: " + longitud);

        var data = await (await direccionInput.getAttribute("value")).split(",");
        console.log("Direccion: " + data)
        var codigo_postal = data[data.length - 2].substring(0, 6).trim();
        console.log("Codigo Postal: " + codigo_postal);
        
        driver.quit()
        console.log("Fin");

        return [{latitud: latitud}, {longitud: longitud}, {codigo_postal: codigo_postal}]
    }catch(e){
        console.log(e)
        driver.quit()
    }
}

export async function getTelefono(nombre) {
    opts.headless(true)
    opts.windowSize({width: 1920, height: 1080})
    let driver = await new webdriver.Builder()
                .forBrowser('chrome')
                .setChromeOptions(opts)
                .build();
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
            var telefono = await contenedorTelefono.getAttribute("innerText");
            console.log(telefono)
        }
        
        driver.quit()

        return telefono
    }catch(e){
        console.log(e)
        driver.quit()
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
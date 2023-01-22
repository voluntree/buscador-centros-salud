//Imports de librerias o metodos de otros archivos.
import { By } from "selenium-webdriver"
import webdriver from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"
import chromedriver from "chromedriver";

const opts = new chrome.Options(); //Se almacena un objeto options de chrome

//Scraper que obtiene las coordenadas de un centro y el codigo postal
export async function getCoordenadas(calle, provincia, municipio) {

        opts.headless() //Ejecuta el navegador sin interfaz
        opts.windowSize({width: 1366, height: 768}) //Tamaño para la ventana del navegador
        opts.excludeSwitches('enable-logging') //Limpia la salida de consola del navegador
        //Crea el webdriver con el navegador chrome y las opciones anteriores.
        let driver = await new webdriver.Builder()
                    .forBrowser('chrome')
                    .setChromeOptions(opts)
                    .build();
    
        var latitud = ""        //Variable latitud
        var longitud = ""       //Variable longitud
        var codigo_postal = ""  //Variable codigo_postal
    
        try{
            await driver.get('https://www.coordenadas-gps.com/'); //Accede a la pagina coordenadas-gps.com
            await sleep(2000); //Espera 2 segundos para asegurar que la pagina ha cargado correctamente
        
            var direccionInput = await driver.findElement(By.id("address"));//Obtiene el campo address
            await direccionInput.clear(); //Limpia el contenido del campo
            //Introduce la calle, el municipio y la provincia
            await direccionInput.sendKeys(calle + " " + municipio + " "  + provincia);
           
            //Obtiene el boton para obtener las coordenadas
            var obtenerCoordenadas = await driver.findElement(By.xpath('//*[@id="wrap"]/div[2]/div[3]/div[1]/form[1]/div[2]/div/button'))
            await obtenerCoordenadas.click(); //Clica el boton
            await sleep(2000); //Espera 2 segundos para asegurar que ha cargado todo

            //Obtiene el campo latitude
            var latitudeInput = await driver.findElement(By.id("latitude"));
            //Obtiene el valor del campo
            latitud = await latitudeInput.getAttribute("value");

            //Obtiene el campo longitude
            var longitudeInput = await driver.findElement(By.id("longitude"));
            //Obtiene el valor del campo
            longitud = await longitudeInput.getAttribute("value");
            
            //Obtiene el valor del campo address
            var data = (await direccionInput.getAttribute("value")).split(",");
            //Obtiene el codigo postal
            codigo_postal = data[data.length - 2].substring(0, 6).trim();

        if(codigo_postal.match(/^[0-9]{5}$/) == null){ //Si el codigo postal es incorrecto
            codigo_postal = "" //Asigna el valor ""
        }
        
        driver.quit() //Cierra el navegador

    }catch(error){ //En caso de error
        driver.quit() //Cierra el navegador
    }
    
    //Crea el objeto con los datos
    var object = {
        latitud: latitud,
        longitud: longitud,
        codigo_postal: codigo_postal 
    }

    return object //Devuelve el objeto
}

//Scraper que obtiene el codigo postal de una ubicacion
export async function getDireccion(latitude, longitude) {
    opts.headless() //Ejecuta el navegador sin interfaz
    opts.windowSize({width: 1366, height: 1080}) //Tamaño para la ventana del navegador
    opts.excludeSwitches('enable-logging') //Limpia la salida de consola del navegador
    //Crea el webdriver con el navegador chrome y las opciones anteriores.
    let driver = await new webdriver.Builder().
                forBrowser('chrome')
                .setChromeOptions(opts)
                .build();

    var codigo_postal = "" //Variable codigo_postal
    try{
        await driver.get('https://www.coordenadas-gps.com/'); //Accede a la pagina coordenadas-gps.com
        
        //Obtiene el campo latitude
        var latitudeInput = await driver.findElement(By.id("latitude"));
        //Scrollea la pagina hasta el elemento para que se renderice
        await driver.executeScript("arguments[0].scrollIntoView(true);", latitudeInput)
        await sleep(1000) //Espera 1 segundo

        await latitudeInput.clear(); //Limpia el campo latitude
        await latitudeInput.sendKeys(latitude) //Introduce el valor de latitude en el campo
        
        //Obtiene el campo longitude
        var longitudeInput = await driver.findElement(By.id("longitude"));
        await longitudeInput.clear(); //Limpia el campo longitude
        await longitudeInput.sendKeys(longitude) //Introduce el valor de longitude en el campo

        //Obtiene el boton para obtener las coordenadas
        var botonCoordenadas = await driver.findElement(By.xpath('//*[@id="wrap"]/div[2]/div[3]/div[1]/form[2]/div[3]/div/button'))
        await botonCoordenadas.click() //Clica el boton
        await sleep(2000) //Espera 2 segundos

        //Obtiene el campo address
        var direccionInput = await driver.findElement(By.id("address"));
        //Obtiene el valor del campo address
        var data = (await direccionInput.getAttribute("value")).split(",");
        //Obtiene el codigo postal
        codigo_postal = data[data.length - 2].substring(0, 6).trim();
        
        driver.quit() //Cierra el navegador

    }catch(error){
        driver.quit() //Cierra el navegador
    }

    return codigo_postal //Devuelve el codigo postal
}

//Scraper que obtiene el telefono del centro
export async function getTelefono(nombre) {

    opts.headless(true) //Ejecuta el navegador sin interfaz
    opts.windowSize({width: 1920, height: 1080}) //Tamaño para la ventana del navegador
    opts.excludeSwitches('enable-logging') //Limpia la salida de consola del navegador
    //Crea el webdriver con el navegador chrome y las opciones anteriores.
    let driver = await new webdriver.Builder()
                .forBrowser('chrome')
                .setChromeOptions(opts)
                .build();
    
    var telefono = "" //Variable telefono
    try{
        await driver.get('https://www.google.es/'); //Accede a la pagina google.com
        //Obtiene la ventana de cookies
        var ventanaCookies = await driver.findElement(By.xpath('//*[@id="L2AGLb"]/div'));

        if(ventanaCookies != null){ //Comprueba si existe la ventana
            await ventanaCookies.click() //Clica en la ventana
        }

        //Obtiene el campo de busqueda
        var barraBusqueda = await driver.findElement(By.name("q"));
        await barraBusqueda.sendKeys(nombre); //Introduce el nombre del centro 
        await barraBusqueda.submit(); //Envia los datos
        await sleep(3000) //Espera 3 segundos

        //Obtiene el campo del telefono
        var contenedorTelefono = await driver.findElement(By.xpath("//span[contains(@aria-label,'Llamar al número de teléfono')]"))
        if(contenedorTelefono != null){ //Si existe el campo del telefono
            telefono = await contenedorTelefono.getAttribute("innerText"); //Obtiene el telefono
        }   
        
        driver.quit() //Cierra el navegador

    }catch(error){
        driver.quit() //Cierra el navegador
    }
        return telefono //Devuelve el telefono
}

//Funcion que para el programa
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

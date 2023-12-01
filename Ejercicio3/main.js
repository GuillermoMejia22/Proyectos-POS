// Invocación del método createClientAsync del modulo SOAP
import { createClientAsync } from 'soap'

// URL del primer servicio SOAP 
const url1 = "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL";

// Funcion que invoca al servicio SOAP para obtener Lista de Continentes por nombre
async function obtenerListaDeContinentesPorNombre() {
    // Crea un nuevo cliente SOAP desde una URL
    const client = await createClientAsync(url1);
    // Se invoca a la funcion para obtener la lista de continentes por nombre
    const result = await client.ListOfCountryNamesByName;
    // Como la funcion retorna otra funcion, se invoca la funcion retornada y mediante un collback
    // se obtiene el resultado de la Lista de Continentes por nombre o se muestra el error
    result( ( error , result ) => {
        if( error ){
            console.log( error );
        } else {
            console.log( result.ListOfCountryNamesByNameResult.tCountryCodeAndName );
        }
    })
}

// Invocacion de la funcion para obtener Lista de Continentes por nombre
obtenerListaDeContinentesPorNombre();

// URL del segundo servicio SOAP 
const url2 = "http://www.dneonline.com/calculator.asmx?WSDL"

// Funcion que invoca al servicio SOAP para obtener la suma de dos numeros
async function obtenerSuma() {
    // Crea un nuevo cliente SOAP desde una URL
    const client = await createClientAsync(url2);
    // Argumentos que se agregan a la invocacion de la funcion
    const args = { intA: 2, intB: 3 }; 
    // Se invoca a la funcion para obtener la suma de dos numeros
    // Mediante un collback, se obtiene el resultado de la suma de dos numeros  o se muestra el error
    await client.Add( args , ( error , result ) => {
        if( error ) console.log( error );
        console.log( result );
    })
}

// Invocacion de la funcion para obtener la suma de dos numeros
obtenerSuma()
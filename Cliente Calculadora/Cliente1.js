import { createClient } from "soap";

const url = "http://www.dneonline.com/calculator.asmx?wsdl";

createClient(url, function (err, client) {
    if (err) {
        console.error(err);
    } else {
        // Make SOAP request using client object 
        const args = { intA: 100, intB: 2 };
        client.Multiply(args, function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
            }
        });
    }
});
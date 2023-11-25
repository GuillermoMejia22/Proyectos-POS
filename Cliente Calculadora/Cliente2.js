import { createClient } from "soap";

const url = "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL";

createClient(url, function (err, client) {
    if (err) {
        console.error(err);
    } else {
        // Make SOAP request using client object 
        const args = { sCountryISOCode: "MX"};
        client.CountryName(args, function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
            }
        });

        client.CapitalCity(args, function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
            }
        });

        client.CountryCurrency(args, function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
            }
        });

        client.CountryFlag(args, function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
            }
        });
    }
});
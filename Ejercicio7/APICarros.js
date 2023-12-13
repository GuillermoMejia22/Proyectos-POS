import express from 'express';
import { readFile, writeFile } from "fs";
import path from 'path';

const app = express();
const port = 8081;

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const archivo = "database/carros.json";

app.get('/listaCarros', function (req, res) {
    readFile(archivo, 'utf-8', function (err, data) {
        data = JSON.parse(data);
        console.log(data);
        res.json(data);
    });

});

app.get('/listaCarros/:matricula', function (req, res) {
    readFile(archivo, 'utf-8', function (err, data) {
        const matricula = req.params.matricula
        data = JSON.parse(data);
        let elCarro = data.find(elCarro => elCarro.matricula === matricula);
        console.log(elCarro);
        res.json(elCarro);
    });

});

app.post('/nuevoCarro', function (req, res) {
    const carro = req.body;

    // Primero leer el archivo
    readFile(archivo, 'utf-8', function (err, data) {
        data = JSON.parse(data);
        data.push(carro);

        // Actualizar el archivo 
        writeFile(archivo, JSON.stringify(data), function writeJSON(err) {
            if (err) return console.log(err);
        });
        console.log(data);
        res.json(data);
    });
});

app.delete('/eliminaCarro', function (req, res) {
    readFile(archivo, 'utf8', function (err, data) {
        var matricula = req.body.matricula;
        console.log(matricula);
        data = JSON.parse(data);
        data = data.filter(elCarro => elCarro.matricula != matricula);
        writeFile(archivo, JSON.stringify(data), function writeJSON(err) {
            if (err) return console.log(err);
        });
        res.json(data)
    })
})

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}!`));
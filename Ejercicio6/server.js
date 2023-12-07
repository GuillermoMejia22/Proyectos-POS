import express from 'express';
import { readFile, writeFile } from "fs";
import path from 'path';

const app = express();
const port = 8081;

app.use(express.static(path.join(process.cwd(),"public")));
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

const archivo = "database/users.json";

app.get('/listaUsuarios', function (req, res)
{
    readFile(archivo, 'utf-8', function( err, data )
    {
        data = JSON.parse(data);
        console.log(data);
        res.json(data);
    });

});

app.get('/listaUsuarios/:id', function (req, res)
{
    readFile(archivo, 'utf-8', function( err, data )
    {
        const id = req.params.id
        data = JSON.parse(data);
        let elUsuario = data.find(elUsuario => elUsuario.id === id);
        console.log(elUsuario);
        res.json(elUsuario);
    });
    
});

app.post('/nuevoUsuario', function (req, res)
{
    const usuario = req.body;

    // Primero leer el archivo
    readFile(archivo, 'utf-8', function(err, data)
    {
        data = JSON.parse(data);
        data.push(usuario);

        // Actualizar el archivo 
        writeFile(archivo, JSON.stringify(data), function writeJSON(err)
        {
            if(err) return console.log(err);
        });
        console.log(data);
        res.json(data);
    });
});

app.listen(port, () => console.log("Servidor en espera de peticiones"));
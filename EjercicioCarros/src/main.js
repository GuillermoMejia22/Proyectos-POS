import express from 'express';
import { readFile, writeFile } from "fs";
import path from 'path';

const app = express();
const port = 8081;

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const archivo = "database/carros.json";
let datos = null

app.get('/listaCarros', async function (req, res) {
    if( !datos ) datos = await obtenerDatos()
    res.json( datos )
})

app.get('/listaCarros/:matricula', async function (req, res) {
    const matricula = req.params.matricula
    if( !datos ) datos = await obtenerDatos()
    const carro = datos.find(elCarro => elCarro.matricula === matricula)
    res.json( carro ? carro : {} )
})

app.post('/nuevoCarro', async function (req, res) {
    const carro = req.body;
    if( !datos ) datos = await obtenerDatos()
    datos.push(carro);
    await modificarDatos( datos )
    res.json( datos )
})

app.delete('/eliminaCarro', async function (req, res) {
    const matricula = req.body.matricula;
    if( !datos ) datos = await obtenerDatos()
    datos = datos.filter(elCarro => elCarro.matricula != matricula)
    await modificarDatos( datos )
    res.json( datos )
})

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}!`));

async function obtenerDatos(){
    return await new Promise( ( resolver ) => {
        readFile(archivo, 'utf8', function (err, data) {
            if( err ) return resolver( [] )
            return resolver( JSON.parse(data) )
        })
    })
}

async function modificarDatos( nuevosDatos ){
    await new Promise( ( resolver ) => {
        resolver(
            writeFile(archivo, JSON.stringify(nuevosDatos), function writeJSON(err) {
                if (err) console.log(err);
            })
        )
    })
}
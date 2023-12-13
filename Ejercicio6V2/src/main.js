import express from 'express';
import { readFile, writeFile } from "fs";
import path from 'path';

const app = express();
const port = 8081;

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Nombre de la carpeta y del archivo donde se almacenan los datos
const archivo = "database/users.json";
// Variable temporal que almacena los datos del archivo
// Inicialmente, se encuentra en null hasta que se realice una solicitud REST
let datos = null

// Metodo GET que permite obtener los datos del archivo y devolverlos en formato JSON
app.get('/listaUsuarios', async function (req, res) {
    // Si la variable datos es null, se obtiene los datos del archivo
    // mediante la palabra await, se indica que se debe esperar hasta que el proceso de lectura termine
    if( !datos ) datos = await obtenerDatos()
    // Se envian los datos
    res.json( datos )
})

// Metodo GET que permite obtener un usuario mediante su ID y devolverlo en formato JSON
app.get('/listaUsuarios/:id', async function (req, res) {
    // Se obtiene el Id del usuario 
    // Con la clave params, se obtiene los datos de la url
    const id = req.params.id
    // Si la variable datos es null, se obtiene los datos del archivo
    // mediante la palabra await, se indica que se debe esperar hasta que el proceso de lectura termine
    if( !datos ) datos = await obtenerDatos()
    // Se busca el usuario en los datos almacenados
    const usuario = datos.find(elUsuario => elUsuario.id === id)
    // Si el usuario existe, se envia el usuario encontrado, sino es asi, se devuelve un objeto vacio
    res.json( usuario ? usuario : {} )
})

app.post('/nuevoUsuario', async function (req, res) {
    // Se obtiene el usuario
    // Con la clave body, se obtiene los datos del cuerpo de la solicitud, y no de la url
    // como ventaja, los datos se ecuentran mas seguros y se puede agregar mas informacion
    const usuario = req.body;
    // Si la variable datos es null, se obtiene los datos del archivo
    // mediante la palabra await, se indica que se debe esperar hasta que el proceso de lectura termine
    if( !datos ) datos = await obtenerDatos()
    // se agrega el nuevo usuario a la variable temporal
    datos.push(usuario);
    // se actualiza los nuevos datos
    await modificarDatos( datos )
    // Se envian los datos
    res.json( datos )
})

app.delete('/eliminaUsuario', async function (req, res) {
    // Se obtiene el id del usuario
    // Con la clave body, se obtiene los datos del cuerpo de la solicitud, y no de la url
    // como ventaja, los datos se ecuentran mas seguros y se puede agregar mas informacion
    const userId = req.body.id;
    // Si la variable datos es null, se obtiene los datos del archivo
    // mediante la palabra await, se indica que se debe esperar hasta que el proceso de lectura termine
    if( !datos ) datos = await obtenerDatos()
    // Se busca el usuario y se filtra 
    datos = datos.filter(elUsuario => elUsuario.id != userId)
    // se actualiza los nuevos datos
    await modificarDatos( datos )
    // Se envian los datos
    res.json( datos )
})

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}!`));

async function obtenerDatos(){
    // Mediante una promesa, se permite controlar el valor de exito o fracaso de una accion asincrónica
    // con la palabra await, se indica que se debe esperar hasta que el proceso termine
    return await new Promise( ( resolver ) => {
        // Funcion que pemite obtener datos de un archivo
        readFile(archivo, 'utf8', function (err, data) {
            // Si no se logra obtener los datos del archivo, se retorna un arreglo vacio
            if( err ) return resolver( [] )
            // Cuando se obtene los datos del archivo, se resuelve la promesa
            return resolver( JSON.parse(data) )
        })
    })
}

async function modificarDatos( nuevosDatos ){
    // Mediante una promesa, se permite controlar el valor de exito o fracaso de una accion asincrónica
    // con la palabra await, se indica que se debe esperar hasta que el proceso termine
    await new Promise( ( resolver ) => {
        resolver(
            // Funcion que permite escribir en un archivo
            writeFile(archivo, JSON.stringify(nuevosDatos), function writeJSON(err) {
                if (err) console.log(err);
            })
        )
    })
}
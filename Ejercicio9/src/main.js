import express from 'express';
import path from 'path';
import { createConnection } from 'mysql2';

const app = express();
const port = 8081;

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let datos = null

app.get('/listaAutos', async function (req, res) {
    if (!datos) datos = await obtenerDatos()
    res.json(datos)
})

app.get('/listaAutos/:id', async function (req, res) {
    const id = req.params.id
    if (!datos) datos = await obtenerDatos()
    const automovil = datos.find(elAutomovil => elAutomovil.id === id)
    res.json(automovil ? automovil : {})
})

app.post('/agregaAuto', async function (req, res) {
    const auto = req.body;
    if (!datos) datos = await obtenerDatos()
    datos.push(auto);
    await nuevoAutomovil(auto)
    res.json(datos)
})

app.delete('/eliminaAuto', async function (req, res) {
    const autoId = req.body.id;
    if (!datos) datos = await obtenerDatos()
    datos = datos.filter(elAutoId => elAutoId.id != autoId)
    await eliminaAuto(autoId)
    res.json(datos)
})

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}!`));

async function obtenerDatos() {
    return await new Promise((resolver) => {
        var con = createConnection(
            {
                host: "localhost",
                user: "root",
                password: "root",
                database: "automoviles"
            });

        con.query("SELECT * FROM autos", function (err, result, fields) {
            if (err) return resolver([]);

            if (result.length > 0) {
                console.log(result[0].id);
                console.log(result[0].marca);
                console.log(result[0].modelo);
            }

            //return resolver( JSON.parse(result) )
            return resolver(result)
        });
    });
}

async function nuevoAutomovil(nuevosDatos) {
    await new Promise((resolver) => {
        console.log(nuevosDatos.id);
        console.log(nuevosDatos.marca);
        console.log(nuevosDatos.modelo)

        // Establecer una conexión a la bd
        var con = createConnection(
            {
                host: "localhost",
                user: "root",
                password: "root",
                database: "automoviles" // Nombre de la Base de datos
            });
        const sql = "INSERT INTO autos (id, marca, modelo) VALUES ('" + nuevosDatos.id + "','" + nuevosDatos.marca + "','" + nuevosDatos.modelo + "');";
        con.query(sql, function (err, result, fields) {
            if (err) return resolver([]);

            if (result.length > 0) {
                console.log(result[0].id);
                console.log(result[0].marca);
                console.log(result[0].modelo);
            }

            return resolver(result)
        });
    })
}

async function eliminaAuto(idCliente) {
    await new Promise((resolver) => {
        console.log(idCliente);

        // Establecer una conexión a la bd
        var con = createConnection(
            {
                host: "localhost",
                user: "root",
                password: "root",
                database: "automoviles" // Nombre de la Base de datos
            });
        const sql = "Delete from autos where id = '" + idCliente + "';";
        con.query(sql, function (err, result, fields) {
            if (err) return resolver([]);

            if (result.length > 0) {
                console.log(result[0].id);
                console.log(result[0].marca);
                console.log(result[0].modelo);
            }

            return resolver(result)
        });
    })
}

import express from 'express';
import { createConnection } from 'mysql2';
import path from 'path';

const app = express();
const router = express.Router();
const port = 8081;

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let datos = null;

// Metodo GET para obtener el listado de clientes
app.get("/listaClientes", async function (req, res) {
    if (!datos) datos = await obtenerDatos()
    res.json(datos)
})

// Metodo GET para obtener un cliente por el ID
app.get("/listaClientesID", async function (req, res) {
    const id = +req.query.id;
    if (!datos) datos = await obtenerDatos();
    const cliente = datos.find(elCliente => elCliente.id === id)
    res.json( cliente ? cliente : {} )
})

// Metodo POST para agregar un nuevo cliente
app.post('/agregarCliente', async function (req, res) {
    const cliente = req.body;
    if (!datos) datos = await obtenerDatos();
    datos.push(cliente);
    await registrarNuevo(cliente)
    res.json(datos)
})

// Metodo POST para actualizar un cliente
app.post('/actualizarCliente', async function (req, res) {
    const cliente = req.body;
    if (!datos) datos = await obtenerDatos();
    datos.push(cliente);
    await actualizaCliente(cliente);
    res.json(datos);
})

// Metodo DELETE para eliminar un cliente
app.delete('/eliminarCliente', async function (req, res) {
    const clienteId = +req.body.id;
    if (!datos) datos = await obtenerDatos();
    datos = datos.filter(elClienteId => elClienteId.id != clienteId)
    await eliminaCliente(clienteId)
    res.json(datos)
})

// Servidor en espera de peticiones
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}!`));

// Funcion asincrona para la consulta de datos
async function obtenerDatos() {
    return await new Promise((resolver) => {
        var con = createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "root",
            database: "banco"
        })
        con.query("SELECT * FROM clientes", function (err, result, fields) {
            if (err) return resolver([]);
            return resolver(result);
        })
    })
}

// Funcion asincrona para la insercion de un nuevo registro
async function registrarNuevo(nuevoCliente) {
    return await new Promise((resolver) => {
        var con = createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "root",
            database: "banco"
        })
        const sql = "INSERT INTO clientes (nombre, direccion, apellidos, correo, telefono) VALUES (?, ?, ?, ?, ?)";
        const values = [nuevoCliente.nombre, nuevoCliente.direccion, nuevoCliente.apellidos, nuevoCliente.correo, nuevoCliente.telefono];
        con.query(sql, values, function (err, result, fields) {
            if (err) return resolver([]);
            console.log("Registro Agregado Con Exito");
            return resolver(result);
        })
    })
}

async function actualizaCliente(nuevoCliente) {
    return await new Promise((resolver) => {
        var con = createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "root",
            database: "banco"
        });
        // Verificar si existe el ID
        const verificacion = "SELECT * FROM clientes WHERE id = ?";
        con.query(verificacion, [parseInt(nuevoCliente.id, 10)], function (err, result, fields) {
            if (err) return resolver([]);
            if (result.length > 0) {
                let values = [];
                let campos = [];
                // Significa que sí existe ese ID
                if (nuevoCliente.nombre !== "") {
                    values.push(nuevoCliente.nombre);
                    campos.push("nombre");
                }
                if (nuevoCliente.apellidos !== "") {
                    values.push(nuevoCliente.apellidos);
                    campos.push("apellidos");
                }
                if (nuevoCliente.direccion !== "") {
                    values.push(nuevoCliente.direccion);
                    campos.push("direccion");
                }
                if (nuevoCliente.correo !== ""){
                    values.push(nuevoCliente.correo);
                    campos.push("correo");
                }
                if (nuevoCliente.telefono !== "") {
                    values.push(nuevoCliente.telefono);
                    campos.push("telefono");
                }
                const setClause = campos.map(key => `${key} = ?`).join(', ');
                const sql = `UPDATE clientes SET ${setClause} WHERE id = ?`;
                con.query(sql, [...values, parseInt(nuevoCliente.id, 10)], function (err, result, fields) {
                    if (err) return resolver([]);
                    console.log("Registro Actualizado");
                    return resolver(result);
                });
            } else {
                console.log("No hay clientes con ese ID");
                return resolver([]);
            }
        });
    });
}

// Funcion asincrona para eliminar un cliente por ID
async function eliminaCliente(id) {
    return await new Promise((resolver) => {
        var con = createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "root",
            database: "banco"
        })
        con.query("DELETE from clientes WHERE id = " + parseInt(id, 10), function (err, result, fields) {
            if (err) return resolver([]);
            console.log("Registro eliminado con Exito");
            return resolver(result);
        })
    })
}
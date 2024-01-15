import express from 'express'
import path from 'path'
import { createConnection } from 'mysql2';

const app = express();
const port = 8081;

app.use(express.static(path.join(process.cwd(), "public"))); app.use(express.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let datos = null

app.get('/listaLibros', async function (req, res) {
    if (!datos) datos = await obtenerDatos()
    res.json(datos)
})

app.get('/listaLibros/:isbn', async function (req, res) {
    const isbn = req.params.isbn
    if (!datos) datos = await obtenerDatos()
    const libro = datos.find(elLibro => elLibro.isbn === isbn)
    res.json(libro ? libro : {})
})

app.post('/agregaLibro', async function (req, res) {
    const libro = req.body;
    if (!datos) datos = await obtenerDatos()
    datos.push(libro);
    await nuevoLibro(libro)
    res.json(datos)
})

app.delete('/eliminaLibro', async function (req, res) {
    const libroIsbn = req.body.isbn;
    if (!datos) datos = await obtenerDatos()
    datos = datos.filter(libro => libro.isbn != libroIsbn)   
    await eliminaLibro(libroIsbn)
    res.json(datos)
})

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}!`));

async function obtenerDatos() {
    return await new Promise((resolver) => {
        var con = createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "root",
            database: "Libreria"
        });

        con.query("SELECT * FROM libros", function (err, result, fields) {
            if (err) return resolver([]);
            if (result.length > 0) {
                console.log("Consulta con Exito");
            }
            return resolver(result)
        });
    });
}

async function nuevoLibro(nuevosDatos) {
    await new Promise((resolver) => {
        var con = createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "root",
            database: "Libreria"
        });
        // En la BD defini el campo "precio" como un float porque en mysql NO EXISTE el tipo de dato MONEY
        const sql = "INSERT INTO libros values ('" + nuevosDatos.isbn + "','" + nuevosDatos.titulo + "','" + nuevosDatos.nombreAutor + "','" + nuevosDatos.apellidoAutor + "'," + parseFloat(nuevosDatos.precio) + ");"
        con.query(sql, function (err, result, fields) {
            if (err) return resolver([]);
            if (result.length > 0) {
                console.log("Registro agregado con exito");
            }
            return resolver(result)
        });
    })
}

async function eliminaLibro(isbn) {
    await new Promise((resolver) => {
        var con = createConnection(
            {
                host: "localhost",
                port: "3306",
                user: "root",
                password: "root",
                database: "Libreria" 
            });
        const sql = "Delete from libros where isbn = '" + isbn + "';";
        con.query(sql, function (err, result, fields) {
            if (err) return resolver([]);

            if (result.length > 0) {
                console.log("Registro Eliminado con Exito");
            }

            return resolver(result)
        });
    })
}
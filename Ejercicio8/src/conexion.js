import { createConnection } from 'mysql2';

var con = createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "banco",
    port: "3306"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Conectado!");
    var sql = "CREATE TABLE clientes (id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(255), apellidos VARCHAR(255), direccion VARCHAR(255), correo VARCHAR(255), telefono VARCHAR(20))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Tabla creada");
    });
});

// INSERT
function insertaRegistro(nombre, direccion) {
    const sql = "INSERT INTO clientes (nombre, direccion) VALUES ?";
    const values = [
        [nombre, direccion]
    ]; 
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Registro Agregado con Exito");
    });
}

// SELECT
function consulta(){
    con.query("SELECT nombre, direccion FROM clientes", 
        function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
}

// SELECT CON FILTRO
function consultaFiltro(direccion){
    const sql = "SELECT * FROM clientes WHERE direccion = ?";
    con.query(sql, [direccion], function (err, result) {
        if (err) throw err;
        console.log(result);
    });
}

// ORDER BY
function ordenarPor(atributo){
    const sql = `SELECT * FROM clientes ORDER BY ${atributo}`;
    con.query(sql, [atributo], function (err, result) {
        if (err) throw err;
        console.log(result);
    });
}

// DELETE
function eliminarRegistros(direccion){
    const sql = "DELETE FROM clientes WHERE direccion = ?";
    con.query(sql, [direccion], function (err, result) {
        if (err) throw err;
        console.log("Numero de Registros Eliminados: " + result.affectedRows);
    });
}

// UPDATE
function actualizaRegistros(nuevaDireccion, antiguaDireccion){
    const sql = "UPDATE clientes SET direccion = ? WHERE direccion = ?";
    con.query(sql, [nuevaDireccion, antiguaDireccion], function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " registro(s) actualizado(s)");
    });
}

//insertaRegistro("Elizabeth", "France 4");
//consulta();
//consultaFiltro("France 4");
//ordenarPor("nombre");
//eliminarRegistros("France 4");
//actualizaRegistros("Av Mexico", "France 4");
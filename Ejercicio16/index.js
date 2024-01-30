import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"
import { createPool } from "mysql2/promise";

const pool = createPool({
    host: process.env.HOST || "localhost",
    port: process.env.PORT || "3307",
    database: process.env.DATABASE || "libreria",
    user: process.env.USER || "root",
    password: process.env.PASSWORD || "root"
})

// Definición de Schemas
const typeDefs = `#graphql
    type Libro {
        titulo: String
        editorial: String
        autor: String
        genero: String
    }

    type Query {
        libros: [Libro]
        librosPorAutor(autor: String): [Libro]
        librosPorGenero(genero: String): [Libro]
        librosPorEditorial(editorial: String): [Libro]
    }
`;

// Obtener los datos
const resolvers = {
    Query: {
        libros: () => {
            return consultarLibros();
        },
        librosPorAutor: (parent, { autor }) => {
            return consultarLibrosAutor(autor);
        },
        librosPorGenero: (parent, { genero }) => {
            return consultarLibrosGenero(genero);
        },
        librosPorEditorial: (parent, { editorial }) => {
            return consultarLibrosEditorial(editorial);
        }
    },
}

// Crear un servidor de Apollo
const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
}) 

console.log(`Servidor ejecutandose en: ${url}`);

async function consultarLibros() {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select * from libros");
        console.log(resultado);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if(conexion) conexion.release();
    }
}

async function consultarLibrosAutor(autor) {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select * from libros where autor = ?", [autor]);
        console.log(resultado);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if(conexion) conexion.release();
    }
}

async function consultarLibrosGenero(genero) {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select * from libros where genero = ?", [genero]);
        console.log(resultado);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if(conexion) conexion.release();
    }
}

async function consultarLibrosEditorial(editorial) {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select * from libros where editorial = ?", [editorial]);
        console.log(resultado);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if(conexion) conexion.release();
    }
}
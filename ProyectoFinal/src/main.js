import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { createPool } from "mysql2/promise";

const pool = createPool({
    host: process.env.HOST || "localhost",
    port: process.env.PORT || "3306",
    database: process.env.DATABASE || "tesis",
    user: process.env.USER || "root",
    password: process.env.PASSWORD || "root"
})

// Definición de Esquemas
const typeDefs = `
    type UEA {
        id: Int
        nombre: String
        creditos: Int
    }

    type Alumno {
        id_alumno: Int
        nombre: String
        aGraduacion: String
        tituloTesis: String
        division: String
        posgrado: String
    }

    type Profesor {
        id: Int
        nombre: String
        sni: String
        campo: String
        id_campus: String
        participacion: String
    }

    type LineaInvestigacion {
        id: Int
        nombre: String
        id_profesor: Int
    }

    type Posgrado {
        id: Int
        id_nivel: Int
        nombre: String
        anio: String
        creditos: String
        pncp: String
        plan: String
        requisitos: String
    }

    type Query {
        UEAS: [UEA]
        UEAporID(id: Int): [UEA]
        creditosPorUEA(nombre: String): [UEA]
        alumnos: [Alumno]
        alumnosPorDivision(division: String): [Alumno]
        alumnosPorPosgrado(posgrado: String): [Alumno]
        alumnosInscritosPosgrado(posgrado: String): [Alumno]
        profesoresSNI: [Profesor]
        lineasInvestigacionPosgrado(posgrado: String): [LineaInvestigacion]
        ueasLineaInvestigacion(linea_investigacion: String): [UEA]
        programasMaestriaTema(linea_investigacion: String): [Posgrado]
    }
`;

// Obtener los datos
const resolvers = {
    Query: {
        UEAS: () => {
            return consultarUEAS();
        },
        UEAporID: (parent, { id }) => {
            return consultarUEAPorID(id);
        },
        creditosPorUEA: (parent, { nombre }) => {
            return consultarCreditosPorUEA(nombre);
        },
        alumnos: () => {
            return consultarAlumnos();
        },
        alumnosPorDivision: (parent, { division }) => {
            return consultarAlumnosPorDivision(division);
        },
        alumnosPorPosgrado: (parent, { posgrado }) => {
            return consultarAlumnosPorPosgrado(posgrado);
        },
        alumnosInscritosPosgrado: (parent, { posgrado }) => {
            return consultarAlumnosInscritosPosgrado(posgrado);
        },
        profesoresSNI: () => {
            return consultarProfesoresSNI();
        },
        lineasInvestigacionPosgrado: (parent, { posgrado }) => {
            return consultarLineasInvestigacion(posgrado);
        },
        ueasLineaInvestigacion: (parent, { linea_investigacion }) => {
            return consultarUeasEnLineaDeInvestigacion(linea_investigacion);
        },
        programasMaestriaTema: (parent, { linea_investigacion }) => {
            return consultarPosgradosTema(linea_investigacion);
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

console.log(`Servidor ejecutandose en ${url}`);

async function consultarUEAS() {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select * from ueas");
        console.log(resultado[0]);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if (conexion) conexion.release();
    }
}

async function consultarUEAPorID(id) {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select * from ueas where id = ?", [id]);
        console.log(resultado[0]);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if (conexion) conexion.release();
    }
}

async function consultarAlumnosPorDivision(division) {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select * from alumnos where division = ?", [division]);
        console.log(resultado[0]);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if (conexion) conexion.release();
    }
}

async function consultarAlumnos() {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select * from alumnos");
        console.log(resultado[0]);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if (conexion) conexion.release();
    }
}

// Pregunta 1
async function consultarPosgradosTema(linea_investigacion) {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query(
            "SELECT posgrados.* FROM posgrados " +
            "JOIN posgrado_linea_investigacion ON " +
            "posgrados.id = posgrado_linea_investigacion.id_posgrado " +
            "JOIN linea_investigacion ON " +
            "posgrado_linea_investigacion.id_linea_investigacion = linea_investigacion.id " +
            "WHERE linea_investigacion.nombre = ?",
            [linea_investigacion]
        );

        console.log(resultado);
        return resultado[0];
    } catch (error) {
        console.log(error);
        return [];
    } finally {
        if (conexion) conexion.release();
    }
}

// Pregunta 2
async function consultarUeasEnLineaDeInvestigacion(linea_investigacion) {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("SELECT ueas.nombre as nombre, ueas.id as id, ueas.creditos as creditos FROM ueas" +
            " JOIN plan_estudio On ueas.id = plan_estudio.id_uea" +
            " JOIN posgrados on plan_estudio.id_programa_estudio = posgrados.id" +
            " JOIN posgrado_linea_investigacion ON posgrados.id = posgrado_linea_investigacion.id_posgrado" +
            " JOIN linea_investigacion ON posgrado_linea_investigacion.id_linea_investigacion = linea_investigacion.id" +
            " WHERE linea_investigacion.nombre = ?", [linea_investigacion]);
        console.log(resultado);
        return resultado[0];
    } catch (error) {
        console.log(error);
        return [];
    } finally {
        if (conexion) conexion.release();
    }
}

// Pregunta 3
async function consultarCreditosPorUEA(nombre) {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select * from ueas where nombre = ?", [nombre]);
        console.log(resultado[0]);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if (conexion) conexion.release();
    }
}

// Pregunta 4
async function consultarLineasInvestigacion(posgrado) {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select li.id as id, li.nombre as nombre, li.id_profesor as id_profesor from posgrado_linea_investigacion pli" +
            " join linea_investigacion li on pli.id_linea_investigacion = li.id" +
            " join posgrados p on pli.id_posgrado = p.id where p.nombre = ?", [posgrado]);
        console.log(resultado[0]);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if (conexion) conexion.release();
    }
}

// Pregunta 5
async function consultarAlumnosPorPosgrado(posgrado) {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select * from alumnos where posgrado = ?", [posgrado]);
        console.log(`Alumnos Inscritos al Posgrado: ` + posgrado + `: ` + resultado[0].length);
        console.log(resultado[0]);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if (conexion) conexion.release();
    }
}

// Esta función hace lo mismo que la anterior pero emplea un COUNT
async function consultarAlumnosInscritosPosgrado(posgrado) {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query("Select count(ID_ALUMNO) as inscritos from alumnos where posgrado = ?", [posgrado]);
        console.log(resultado[0]);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if (conexion) conexion.release();
    }
}

// Pregunta 6
async function consultarProfesoresSNI() {
    let conexion = null;
    try {
        conexion = await pool.getConnection();
        const resultado = await conexion.query(`Select * from profesores where sni NOT LIKE "C"`);
        console.log(resultado[0]);
        return resultado[0];
    } catch (error) {
        return [];
    } finally {
        if (conexion) conexion.release();
    }
}
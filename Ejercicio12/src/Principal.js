import express from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"

var schema = buildSchema(`
    type Alumno{
        nombre: String
        edad: Int
        carrera: String

        getNombre: String
        getEdad: Int
        getCarrera: String
    }

    type Profesor {
        nombreProf: String
        grado: String

        getNombreProf: String
    }

    type Materia {
        clave: String
        nombreMat: String
        creditos: Int

        getNombreMat: String
    }

    type Query {
        getAlumno(nombre: String, edad: Int, carrera: String): Alumno
        getProfesor(nombreProf: String, grado: String): Profesor
        consultaMateria(clave: String, nombreMat: String, creditos: Int): Materia
    }
`)

class Alumno {
    constructor(nombre, edad, carrera){
        this.nombre = nombre
        this.edad = edad
        this.carrera = carrera
    }

    getNombre(){
        return this.nombre
    }

    getEdad(){
        return this.edad
    }

    getCarrera(){
        return this.carrera
    }
}

class Profesor {
    constructor(nombreProf, grado){
        this.nombreProf = nombreProf
        this.grado = grado
    }

    getNombreProf(){
        return this.nombreProf
    }
}

class Materia {
    constructor(clave, nombreMat, creditos){
        this.clave = clave
        this.nombreMat = nombreMat
        this.creditos = creditos
    }

    getNombreMat(){
        return this.nombreMat
    }
}

var root = {
    getAlumno:({nombre, edad, carrera}) => {
        return new Alumno(nombre, edad, carrera)
    },
    getProfesor:({nombreProf, grado}) => {
        return new Profesor(nombreProf, grado)
    },
    consultaMateria:({clave, nombreMat, creditos}) => {
        return new Materia(clave, nombreMat, creditos)
    }
}

var app = express()

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
)

app.listen(4000)

console.log("Ejecutando un Servidor de API basado en GraphQL");
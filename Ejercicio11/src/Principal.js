import express from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"

// Construir el esquema
var schema = buildSchema(`
  type Alumno
  {
    nombre: String
    edad: Int
    carrera: String
    estatura: Float
    peso: Float
    genero: String
    getNombre: String
    getEdad: Int
    getCarrera: String
    getEstatura: Float
    getPeso: Float
    getGenero: String
    suma(a: Int, b: Int): Int
    getIMC: Float
    getTasaMetabolica: Float
  }

  type Query {
    getAlumno(nombre: String, edad: Int, carrera: String, estatura: Float, peso: Float, genero: String): Alumno
  }
`)

// Definicion de la Clase Alumno
class Alumno {
    constructor(nombre, edad, carrera, estatura, peso, genero) {
        this.nombre = nombre
        this.edad = edad
        this.carrera = carrera
        this.estatura = estatura
        this.peso = peso
        this.genero = genero
    }

    getNombre() {
        return this.nombre
    }

    getEdad() {
        return this.edad
    }

    getCarrera() {
        return this.carrera
    }

    getEstatura() {
        return this.estatura
    }

    getPeso(){
        return this.peso
    }

    getGenero(){
        return this.genero
    }

    suma({ a, b }){
        return a + b
    }

    getIMC(){
        return this.peso / (this.estatura * this.estatura)
    }

    getTasaMetabolica(){
        let tmb = (10 * this.peso) + (6.25 * (this.estatura * 100)) - (5 * this.edad)
        if(this.genero == "Masculino"){
            return tmb + 5
        } else {
            return tmb - 161
        }
    }

    /*
    getEstadoSalud(){
       
    }

    getRecomendacion(){

    }*/

}

var root = {
    getAlumno: ({ nombre, edad, carrera, estatura, peso, genero }) => {
        return new Alumno(nombre, edad, carrera, estatura, peso, genero)
    },
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
console.log("Running a GraphQL API server at localhost:4000/graphql")
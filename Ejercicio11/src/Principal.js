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
    getEstadoSalud: String 
    getRecomendacion: String 
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

    getPeso() {
        return this.peso
    }

    getGenero() {
        return this.genero
    }

    suma({ a, b }) {
        return a + b
    }

    getIMC() {
        return this.peso / (this.estatura * this.estatura)
    }

    getTasaMetabolica() {
        let tmb = (10 * this.peso) + (6.25 * (this.estatura * 100)) - (5 * this.edad)
        if (this.genero == "Masculino") {
            return tmb + 5
        } else {
            return tmb - 161
        }
    }

    getEstadoSalud() {
        let imc = this.getIMC();
        let estado = "Obesidad";
        if(imc < 18.5){
            estado = "Peso inferior al normal";
        } else if(imc >= 18.5 && imc <= 24.9){
            estado = "Normal";
        } else if(imc >= 25 && imc <= 29.9){
            estado = "Peso superior al normal";
        }
        return estado;
    }

    getRecomendacion(){
        let estado = this.getEstadoSalud();
        let recomendacion = "Debido a que tu peso es muy bajo deberías tratar comer más y hacer ejercicio, la cantidad de calorías que deberías consumir son: " + this.getTasaMetabolica();
        if(estado == "Obesidad"){
            recomendacion = "Debido a que tu estado de salud no es muy favorable, se recomienda que lleves una dieta balanceada acompañada de horas de ejercicio, la cantidad de calorías que deberías consumir son: " + this.getTasaMetabolica();
        } else if(estado == "Peso superior al normal"){
            recomendacion = "Debido a que te encuentras un poco pasado de kilos, se recomienda que hagas un poco mas de ejercicio y acompañes eso con una buena alimentación, la cantidad de calorías que deberías consumir son: " + this.getTasaMetabolica();
        } else if(estado == "Normal"){
            recomendacion = "Excelente, sigue asi, recuerda alimentarte sanamente y tambien hacer ejercicio, la cantidad de calorías que deberías consumir son: " + this.getTasaMetabolica();
        }
        return recomendacion;
    }

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
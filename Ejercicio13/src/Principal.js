import express from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"

var schema = buildSchema(`
    type DadoAleatorio{
        numLados: Int!
        
        tirarUna: Int
        tirar(numTiradas: Int): [Int]
    }

    type Query{
        getDado(numLados: Int): DadoAleatorio
    }
`)

class DadoAleatorio {
    constructor(numLados){
        this.numLados = numLados
    }

    tirarUna(){
        return 1 + Math.floor(Math.random() * this.numLados)
    }

    tirar({numTiradas}){
        let salida = []
        for(let i = 0; i < numTiradas; i++){
            salida.push(this.tirarUna())
        }
        return salida
    }

}

var root = {
    getDado:({numLados}) => {
        return new DadoAleatorio(numLados)
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

console.log(`Ejecutando un Servidor de API basado en Graphql en el puerto 4000`);
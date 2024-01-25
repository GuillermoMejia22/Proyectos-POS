import { gql } from "apollo-server-express"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

// Definir el Schema
const schema = gql`
    type Usuario {
        id: ID!
        nombre: String
        edad: Int
        correo: String
    }

    type Automovil {
        matricula: String
        marca: String
        modelo: String
        precio: Float
    }

    type Query {
        usuarios: [Usuario]
        usuario(id: ID!): Usuario
        listaAutomoviles: [Automovil]
        automovil(matricula: String!): Automovil
        precioVenta(modelo: String, cantidad: Int): Float
    }
`

const data = {
    usuarios: [{
        id: '1',
        nombre: "Juan",
        edad: 23,
        correo: "Juan@correo.com"
    },
    {
        id: '2',
        nombre: "Pancho",
        edad: 21,
        correo: "Pancho@correo.com"
    },
    {
        id: '3',
        nombre: "Luis",
        edad: 40,
        correo: "Luis@correo.com"
    }],
    automoviles: [{
        matricula: "1234",
        marca: "Nissan",
        modelo: "GTR",
        precio: 2400000
    },
    {
        matricula: "1235",
        marca: "Tesla",
        modelo: "X",
        precio: 1250000
    },
    {
        matricula: "1236",
        marca: "Dodge",
        modelo: "Charger",
        precio: 3500000
    }]
}

// Definición de Resolvers
const resolvers = {
    Query:{
        usuario:(parent, {id}) => {
            return data.usuarios.find(u => u.id === id)
        },
        usuarios:() => {
            return Object.values(data.usuarios);
        },
        automovil:(parent, {matricula}) => {
            return data.automoviles.find(a => a.matricula === matricula)
        },
        listaAutomoviles:() => {
            return Object.values(data.automoviles);
        },
        precioVenta:(parent, {modelo, cantidad}) => {
            let carro = data.automoviles.find(a => a.modelo == modelo)
            return carro.precio * cantidad;
        }
    },
};

// Definir el servidor e inciarlo
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
})

const { url } = await startStandaloneServer(server, 
    {listen:{port:4000},
});

console.log("Servidor Apollo en espera en puerto 4000");
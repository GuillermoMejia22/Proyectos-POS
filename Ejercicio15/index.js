import { gql } from 'apollo-server-express'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// Definición de Schema
const schema = gql`
    type Usuario {
        id: ID!
        nombre: String!
        correo: String!
    }

    type Query {
        listaUsuarios: [Usuario]!
        usuario(id: ID!): Usuario!
    }

    type Mutation {
        nuevoUsuario(nombre: String!, correo: String!): Usuario!
        eliminaUsuario(id: ID!): [Usuario]!
    }
`

// Definición de datos
const data = {
    usuarios: [
        {
            id: '1',
            nombre: "Juan Perez",
            correo: "Juanito@correo.com"
        },
        {
            id: '2',
            nombre: "Pancho Pantera",
            correo: "Pancho@correo.com"
        },
    ]
}

// Resolvedores
const resolvers = {
    Query: {
        listaUsuarios:() => {
            return Object.values(data.usuarios);
        },
        usuario:(parent, { id }) => {
            return data.usuarios.find(u => u.id === id);
        },
    },
    Mutation: {
        nuevoUsuario:(parent, args) => {
            let idCuenta = data.usuarios.length + 1
            const usuario =
            {
                id: `${idCuenta++}`,
                nombre: args.nombre,
                correo: args.correo,
            }
            data.usuarios.push(usuario);
            return usuario;
        },
        eliminaUsuario:(parent, args) => {
            data.usuarios = data.usuarios.filter(u => u.id != args.id)
            return data.usuarios
        }
    }
}

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
})

const { url } = await startStandaloneServer(server, {
    listen: {port:4000},
});

console.log("Servidor Apollo en http://localhost:4000");
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'

const typeDefs = `
    #Comentario

    type Libro {
        titulo: String
        autor: String
    }

    type Autor {
        nombre: String
        apellido: String
    }

    type Libreria {
        nombre: String
        direccion: String
        horario: String
    }

    type Query {
        libros: [Libro]
        autores: [Autor]
        librerias: [Libreria]
    }
`;

// Definicion de Datos
const libros = [
    {
        titulo: "La torre oscura",
        autor: "Stephen King"
    },
    {
        titulo: "Resident Evil Zero hour",
        autor: "Stephanie Perry"
    },
    {
        titulo: "It",
        autor: "Stephen King"
    }
];

const librerias = [
    {
        nombre: "Gandhi",
        direccion: "Av Pinos",
        horario: "L a V de 7AM a 7PM"
    },
    {
        nombre: "El sotano",
        direccion: "Viveros MB",
        horario: "L a V de 8AM a 8AM"
    },
    {
        nombre: "El sotano kids",
        direccion: "Viveros MB",
        horario: "L a V de 6AM a 12PM"
    }
];

const autores = [
    {
        nombre: "Stephen",
        apellido: "King"
    },
    {
        nombre: "Stephanie",
        apellido: "Perry"
    },
    {
        nombre: "Paulo",
        apellido: "Coelho"
    }
];

const resolvers = {
    Query: {
        libros: () => libros,
        autores: () => autores,
        librerias: () => librerias,
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`Servidor ejecutandose en ${url}`);
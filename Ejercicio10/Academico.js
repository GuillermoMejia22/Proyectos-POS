import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
} from 'graphql';

var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            curso: {
                type: GraphQLString,
                resolve() {
                    return 'Programacion Orientada a Servicios';
                },
            },
            clave: {
                type: GraphQLString,
                resolve() {
                    return 'POS-123';
                },
            },
            profesor: {
                type: GraphQLString,
                resolve() {
                    return 'Maricela';
                },
            },
            horario: {
                type: GraphQLString,
                resolve() {
                    return 'Lunes, Miercoles y Viernes de 5:30 a 7:00pm';
                },
            },
            creditos: {
                type: GraphQLInt,
                resolve() {
                    return 9;
                },
            },
            calificacion: {
                type: GraphQLFloat,
                resolve() {
                    return 9.9;
                },
            },
        },
    }),
});

var source = '{ curso, clave, profesor, horario, creditos, calificacion }';
graphql({ schema, source }).then((result) => {
    console.log(result);
});
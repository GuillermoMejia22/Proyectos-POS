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
            saludo: {
                type: GraphQLString,
                resolve() {
                    return 'Mundo';
                },
            },
            nombre: {
                type: GraphQLString,
                resolve() {
                    return 'Guillermo';
                },
            },
            profesion: {
                type: GraphQLString,
                resolve() {
                    return 'Estudiante';
                },
            },
            cubiculo: {
                type: GraphQLInt,
                resolve() {
                    return 12;
                },
            },
            estatura: {
                type: GraphQLFloat,
                resolve() {
                    return 1.71;
                },
            },
        },
    }),
});

var source = '{ saludo, nombre, profesion, cubiculo, estatura }';
graphql({ schema, source }).then((result) => {
    console.log(result);
});
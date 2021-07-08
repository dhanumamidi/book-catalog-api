import express from 'express';
import {makeExecutableSchema} from 'graphql-tools';
import { BookService } from './services/book.service';

const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const app =  express();
const port = 4000;

app.use(cors())
app.set('port', (process.env.PORT || port));

let typeDefs: any = [`
  type Query {
    hello: String
  }
`];

let helloMessage: String = 'World!';

let bookService = new BookService();

typeDefs = bookService.configTypeDefs();

let resolvers = bookService.configResolvers();

const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        graphiql: true
    })
);
app.listen(app.get('port'), () => console.log(`Node Graphql API listening on port ${app.get('port')}!`));

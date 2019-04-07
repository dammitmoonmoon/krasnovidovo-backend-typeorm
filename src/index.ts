import { ApolloServer }  from 'apollo-server';
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Person} from "./entity";
import {buildSchema} from "type-graphql";
import {PersonResolver} from "./resolvers/personResolver";
import {parseCVSToPostgres} from "./csvToPostgres/getDataFromCsv";

export interface Context {
    person: Person;
}

async function bootstrap(parse?: boolean) {
    try {
        await createConnection();

        parse && parseCVSToPostgres();

        const schema = await buildSchema({
            resolvers: [PersonResolver],
            validate: false,
        });

        const server = new ApolloServer({ schema });
        const { url } = await server.listen(4000);
        console.log(`Server is running, GraphQL Playground available at ${url}`);
    } catch (err) {
        console.error(err);
    }
}

bootstrap();

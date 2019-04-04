import { ApolloServer }  from 'apollo-server';
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Person} from "./entity";
import {setDummyPerson} from "./helpers/setDummyData";
import {buildSchema} from "type-graphql";
import {PersonResolver} from "./resolvers/personResolver";

export interface Context {
    person: Person;
}

async function bootstrap() {
    try {
        await createConnection();
        const schema = await buildSchema({
            resolvers: [PersonResolver],
        });

        const server = new ApolloServer({ schema });
        const { url } = await server.listen(4000);
        console.log(`Server is running, GraphQL Playground available at ${url}`);
    } catch (err) {
        console.error(err);
    }
}


bootstrap();

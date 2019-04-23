import { ApolloServer }  from 'apollo-server';
import "reflect-metadata";
import {createConnection} from "typeorm";
import {buildSchema} from "type-graphql";
import {AssociateResolver} from "./modules/Associates/AssociateResolver";
import {parseCVSToPostgres} from "./parsing/rp5parser/rawDataConversion/getDataFromCsv";
import {RP5MeteoDataResolver} from "./modules/RP5MeteoData";


async function bootstrap(parse?: boolean) {
    try {
        await createConnection();

        parse && parseCVSToPostgres();

        const schema = await buildSchema({
            resolvers: [AssociateResolver, RP5MeteoDataResolver],
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

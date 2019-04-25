import { ApolloServer }  from 'apollo-server-express';
import "reflect-metadata";
import {createConnection} from "typeorm";
import {buildSchema} from "type-graphql";
import {AssociateResolver} from "./modules/Associates/resolvers/AssociateResolver";
import {RP5MeteoDataResolver} from "./modules/RP5MeteoData";
import {UserResolver} from "./modules/User/resolvers/UserResolver";
import * as express from "express";
import * as cors from "cors";
import * as session from "express-session";
import * as Redis from 'ioredis';
import * as connectRedis from 'connect-redis';

const redis = new Redis();
const RedisStore = connectRedis(session);


const SESSION_SECRET = "asdklfjqo31";

async function bootstrap() {
    try {
        await createConnection();

        const schema = await buildSchema({
            resolvers: [AssociateResolver, RP5MeteoDataResolver, UserResolver],
            validate: false,
        });

        const server = new ApolloServer(
            {
                schema,
                context: ({req}) => ({
                    redis,
                    req
                })});

        const app = express();

        app.use(
            cors({
                credentials: true,
                origin: [
                    "http://localhost:4000",
                    "http://localhost:3000",
                ]
            })
        );
        app.use(
            session({
                store: new RedisStore({}),
                name: "qid",
                secret: SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
                }
            })
        );

        server.applyMiddleware({app});

        app.listen({ port: 4000 }, () =>
            console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
        );

    } catch (err) {
        console.error(err);
    }
}

bootstrap();

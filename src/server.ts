import { ApolloServer }  from 'apollo-server-express';
import {createConnection} from "typeorm";
import {buildSchema} from "type-graphql";
import {AssociateResolver} from "./modules/Associates/resolvers/AssociateResolver";
import {RP5MeteoDataResolver} from "./modules/RP5MeteoData";
import {UserResolver} from "./modules/User/resolvers/UserResolver";
import express from "express";
import cors from "cors";
import session from "express-session";
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import {ImageFileResolver} from "./modules/ImageLoader/resolver/ImageFileResolver";
import path from "path";
import {HOST, PATH, TARGET_FOLDER} from "./modules/ImageLoader/config";

const redis = new Redis();
const RedisStore = connectRedis(session);


const SESSION_SECRET = "asdklfjqo31";

async function bootstrap() {
    try {
        await createConnection();

        const schema = await buildSchema({
            resolvers: [
                AssociateResolver,
                RP5MeteoDataResolver,
                UserResolver,
                ImageFileResolver,
            ],
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

        app.use(express.static(PATH));

        app.use(
            cors({
                credentials: true,
                origin: true,
            }
        ));
        app.use(
            session({
                store: new RedisStore({}),
                name: "sessionId",
                secret: SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 1000 * 60 * 60 * 2, // 2 hours
                    sameSite: true,
                }
            })
        );

        server.applyMiddleware({app, cors: false});

        app.listen({ port: 4000 }, () =>
            console.log(`🚀 Server ready at  ${HOST}${server.graphqlPath}`)
        );

    } catch (err) {
        console.error(err);
    }
}

bootstrap();

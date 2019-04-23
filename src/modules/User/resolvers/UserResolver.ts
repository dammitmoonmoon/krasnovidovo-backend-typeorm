import {Arg, Ctx, Mutation, Resolver} from "type-graphql";
import {RegisterUserInput, User, UserLoginInput} from "../entities/User";
import {getRepository, Repository} from "typeorm";
import * as bcrypt from "bcrypt";
import {Redis} from "ioredis";
import {Request} from "express";

interface Context {
    redis: Redis;
    req: Request;
}

@Resolver(of => User)
export class UserResolver {
    private readonly repository: Repository<User>;
    constructor() {
        this.repository = getRepository(User);
    }

    @Mutation(returns => User, { nullable: false })
    async registerUser(
        @Arg("input")
            registerUserData: RegisterUserInput,
    ): Promise<User> {
        const { username, password, email } = registerUserData;
        const userAlreadyExists = await this.repository.findOne({
            where: { email },
            select: ['id']
        });

        if (userAlreadyExists) {
            throw new Error('User already exists')
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.repository.create({
            username,
            email,
            password: hashedPassword
        });
        return await this.repository.save(user);
    }

    //add context somehow
    @Mutation(returns => String, { nullable: false })
    async login(
        @Arg("input")
            loginInput: UserLoginInput,
        @Ctx() ctx: Context
    ): Promise<string> {
        const { username, password } = loginInput;
        const user = await this.repository.findOne({
            where: { username },
        });

        if (!user) {
            throw new Error('No such user')
        };

        const valid = await bcrypt.compare(password, user.password)

        if (!valid) {
            throw new Error('Wrong password')
        };

        console.log('ctx.req.session', ctx.req.session);
        if (ctx.req.session) {
            ctx.req.session.userId = user.id;
        }
        console.log('ctx.req.session', ctx.req.session);


        return 'Found ya'
    }
}

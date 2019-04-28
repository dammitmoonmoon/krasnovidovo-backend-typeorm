import {Arg, Ctx, ID, Mutation, Query, Resolver} from "type-graphql";
import {RegisterUserInput, User, UserLoginInput} from "../entities/User";
import {DeleteResult, getRepository, Repository} from "typeorm";
import bcrypt from "bcrypt";
import {Redis} from "ioredis";
import {Request} from "express";
import {ApolloError} from "apollo-server-errors";
import {customErrors, ErrorTitles} from "../../../common/errors";
import {userSessionIdPrefix} from "../../../common/constants";

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

    private throwCustomError(error: ErrorTitles) {
        const {message, code} = customErrors[error];
        throw new ApolloError(message, code);
    }

    private async getUserBySession(ctx: Context): Promise<User|null> {
        const userId =  ctx.req.session.userId;

        const currentUser = await this.repository.findOne({
            where: {id: userId}
        });

        return currentUser || null;
    }

    @Mutation(returns => User, { nullable: false })
    async registerUser(
        @Arg("input")
            registerUserData: RegisterUserInput,
    ): Promise<User> {
        const { username, password, email, role } = registerUserData;
        const userAlreadyExists = await this.repository.findOne({
            where: { email },
            select: ['id']
        });

        if (userAlreadyExists) {
            this.throwCustomError(ErrorTitles.AlreadyExists);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.repository.create({
            username,
            email,
            role,
            password: hashedPassword,
        });
        return await this.repository.save(user);
    }

    @Mutation(returns => User, { nullable: false })
    async login(
        @Arg("input")
            loginInput: UserLoginInput,
        @Ctx() ctx: Context
    ): Promise<User> {
        const { username, password } = loginInput;
        const user = await this.repository.findOne({
            where: { username },
        });

        if (!user) {
            this.throwCustomError(ErrorTitles.UserNotFound);
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            this.throwCustomError(ErrorTitles.PasswordInvalid);
        }

        ctx.req.session.userId = user.id;

        if (ctx.req.sessionID) {
            await ctx.redis.lpush(`${userSessionIdPrefix}${user.id}`, ctx.req.sessionID);
        }

        return user;
    }

    @Mutation(returns => User, { nullable: false })
    async logout(
        @Ctx() ctx: Context
    ): Promise<User> {

        const currentUser = this.getUserBySession(ctx);

        ctx.req.session.destroy(err => {
            if (err) {
                this.throwCustomError(ErrorTitles.LogoutFailed)
            }
        });

        return currentUser;
    }

    @Query(returns => User)
    async getCurrentUser(
        @Ctx() ctx: Context
    ): Promise<User> {
        return this.getUserBySession(ctx);
    }

    @Query(returns => [User])
    async listUsers(
        @Ctx() ctx: Context
    ): Promise<User[]> {
        return await this.repository.find();
    }

    @Mutation(returns => Number, { nullable: false })
    async deleteUser(
        @Arg("input")
        id: number,
    ): Promise<number> {
       await this.repository.delete(id);
       return id;
    }
}

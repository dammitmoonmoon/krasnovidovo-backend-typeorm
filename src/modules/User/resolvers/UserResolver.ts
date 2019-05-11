import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {RegisterUserInput, User, UserLoginInput} from "../entities/User";
import {getRepository, Repository} from "typeorm";
import bcrypt from "bcrypt";
import {Redis} from "ioredis";
import {Request} from "express";
import {ErrorCodes, throwCustomError} from "../../../common/errors";
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

    private async getUserBySession(ctx: Context): Promise<User> {
        const session = ctx.req.session || throwCustomError(ErrorCodes.session_not_found);
        const userId = session.userId;

        const currentUser = await this.repository.findOne({
            where: {id: userId}
        });

        return currentUser || throwCustomError(ErrorCodes.user_not_found);
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
            throwCustomError(ErrorCodes.user_exists);
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
        }) || throwCustomError(ErrorCodes.user_not_found);

        await bcrypt.compare(password, user.password) || throwCustomError(ErrorCodes.password_invalid);

        const session = ctx.req.session || throwCustomError(ErrorCodes.session_not_found);

        session.userId = user.id;

        if (ctx.req.sessionID) {
            await ctx.redis.lpush(`${userSessionIdPrefix}${user.id}`, ctx.req.sessionID);
        }

        return user;
    }

    @Mutation(returns => User, { nullable: false })
    async logout(
        @Ctx() ctx: Context
    ): Promise<User> {
        const session = ctx.req.session || throwCustomError(ErrorCodes.session_not_found);
        const currentUser = this.getUserBySession(ctx);

        session.destroy(err => {
            if (err) {
                throwCustomError(ErrorCodes.logout_failed)
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

import {Arg, Mutation, Resolver} from "type-graphql";
import {RegisterUserInput, User} from "../entities/User";
import {getRepository, Repository} from "typeorm";
import * as bcrypt from "bcrypt";

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
}

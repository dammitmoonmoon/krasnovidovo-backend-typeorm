import {DeleteResult, getConnection, getRepository, InsertResult, Repository} from "typeorm";
import {Person} from "../entity";
import {Arg, Ctx, Field, Int, Mutation, Query, Resolver} from "type-graphql";
import {AddPersonInput, UpdatePersonInput} from "../entity/Person";
import {Context} from "../index";
import {ObjectType} from "type-graphql/dist/decorators/ObjectType";

@ObjectType()
class DeletePersonReturnType {
    @Field(_ => Int)
    public id: number;
}

@Resolver(of => Person)
export class PersonResolver {
    private readonly repository: Repository<Person>;
    constructor() {
        this.repository = getRepository(Person);
    }

    @Query(returns => Person, { nullable: true })
     async person(
        @Arg("personId", type => Int)
            personId: number
    ): Promise<Person> {
        return this.repository.findOne(personId);
    }

    @Query(returns => [Person], { nullable: true })
    async persons(): Promise<Person[]> {
        return this.repository.find();
    }

    @Mutation(returns => Person, { nullable: false })
    async addPerson(
        @Arg("input")
            newPersonData: AddPersonInput,
        @Ctx()
            ctx: Context
    ): Promise<Person> {
        const person = this.repository.create(newPersonData);
        return await this.repository.save(person);
    }

    @Mutation(returns => Person, { nullable: false })
    async updatePerson(
        @Arg("input")
            updatePersonData: UpdatePersonInput,
        @Ctx()
            ctx: Context
    ): Promise<Person> {
        const id = updatePersonData.id;
        const person = await this.repository.findOne(id);
        if (!person) {
            throw new Error("Invalid person ID");
        }
        const updatedPerson = {
            ...person,
            ...updatePersonData
        };
        await this.repository.save(updatedPerson);
        return updatedPerson;
    }

    @Mutation(returns => [DeletePersonReturnType], { nullable: false })
    async deletePerson(
        @Arg("input", type => [Int])
            personIds: number[],
        @Ctx()
            ctx: Context
    ): Promise<DeletePersonReturnType[]> {
        await this.repository.delete(personIds);
        return personIds.map(id => ({ id }));
    }
}

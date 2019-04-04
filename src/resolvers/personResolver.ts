import {DeleteResult, getConnection, getRepository, InsertResult, Repository} from "typeorm";
import {Person} from "../entity";
import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import {AddPersonInput, DeletedPerson, UpdatePersonInput} from "../entity/Person";

@Resolver(of => Person)
export class PersonResolver {
    private readonly repository: Repository<Person>;
    constructor() {
        this.repository = getRepository(Person);
    }

    @Query(returns => [Person], { nullable: true })
     async person(
        @Arg("personIds", type => [Int])
            personIds: number[],
    ): Promise<Person[]> {
        return this.repository.findByIds(personIds);
    }

    @Query(returns => [Person], { nullable: true })
    async persons(): Promise<Person[]> {
        return this.repository.find();
    }

    @Mutation(returns => Person, { nullable: false })
    async addPerson(
        @Arg("input")
            newPersonData: AddPersonInput,
    ): Promise<Person> {
        const person = this.repository.create(newPersonData);
        return await this.repository.save(person);
    }

    @Mutation(returns => Person, { nullable: false })
    async updatePerson(
        @Arg("input")
            updatePersonData: UpdatePersonInput,
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
        return await this.repository.save(updatedPerson);
    }

    @Mutation(returns => [DeletedPerson], { nullable: false })
    async deletePerson(
        @Arg("personIds", type => [Int])
            personIds: number[],
    ): Promise<DeletedPerson[]> {
        const selectedPersons = await this.repository.findByIds(personIds);
        return await this.repository.remove(selectedPersons);
    }
}

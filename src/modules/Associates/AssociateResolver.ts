import {getRepository, Repository} from "typeorm";
import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import {AddAssociateInput, Associate, DeletedAssociate, UpdateAssociateInput} from "./entities/AssociateEntity";

@Resolver(of => Associate)
export class AssociateResolver {
    private readonly repository: Repository<Associate>;
    constructor() {
        this.repository = getRepository(Associate);
    }

    @Query(returns => [Associate], { nullable: true })
     async associate(
        @Arg("associateIds", type => [Int])
            associateIds: number[],
    ): Promise<Associate[]> {
        return this.repository.findByIds(associateIds);
    }

    @Query(returns => [Associate], { nullable: true })
    async associates(): Promise<Associate[]> {
        return this.repository.find();
    }

    @Mutation(returns => Associate, { nullable: false })
    async addAssociate(
        @Arg("input")
            newAssociateData: AddAssociateInput,
    ): Promise<Associate> {
        const associate = this.repository.create(newAssociateData);
        return await this.repository.save(associate);
    }

    @Mutation(returns => Associate, { nullable: false })
    async updateAssociate(
        @Arg("input")
            updateAssociateData: UpdateAssociateInput,
    ): Promise<Associate> {
        const id = updateAssociateData.id;
        const associate = await this.repository.findOne(id);
        if (!associate) {
            throw new Error("Invalid associate ID");
        }
        const updatedAssociate = {
            ...associate,
            ...updateAssociateData
        };
        return await this.repository.save(updatedAssociate);
    }

    @Mutation(returns => [DeletedAssociate], { nullable: false })
    async deleteAssociate(
        @Arg("associateIds", type => [Int])
            associateIds: number[],
    ): Promise<DeletedAssociate[]> {
        const selectedAssociates = await this.repository.findByIds(associateIds);
        return await this.repository.remove(selectedAssociates);
    }
}

import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {Field, ID, InputType, Int} from "type-graphql";
import {ObjectType} from "type-graphql/dist/decorators/ObjectType";
import {PrimaryColumn} from "typeorm/decorator/columns/PrimaryColumn";

@ObjectType({ description: "The rp5MeteoData model" })
@Entity()
export class RP5MeteoData {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @PrimaryColumn({ type: "timestamp" })
    localTime: Date;

    @Field({ nullable: true })
    @Column("real", { nullable: true })
    airTempAboveGround: number;

    @Field({ nullable: true })
    @Column("real", { nullable: true })
    atmPressureStation: number;

    @Field({ nullable: true })
    @Column("real", { nullable: true })
    atmPressureSea: number;

    @Field({ nullable: true })
    @Column("real", { nullable: true })
    humidity: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    windDirection: string;

    @Field({ nullable: true })
    @Column("real", { nullable: true })
    windSpeed: number;

    @Field(() => [Int], { nullable: true })
    @Column("real", { array: true, nullable: true })
    cloudCover: number[];

    @Field({ nullable: true })
    @Column("real", { nullable: true })
    minAirTemp: number;

    @Field({ nullable: true })
    @Column("real", { nullable: true })
    maxAirTemp: number;

    @Field(() => [Int], { nullable: true })
    @Column("real", { array: true, nullable: true })
    ClCmCloudCover: number[];

    @Field({ nullable: true })
    @Column("real", { nullable: true })
    dewPointTemp: number;

    @Field({ nullable: true })
    @Column("real", { nullable: true })
    precipitation: number;

    @Field({ nullable: true })
    @Column("real", { nullable: true })
    precipitationAccumulationTime: number;

    @Field(() => [Int], { nullable: true })
    @Column("real", { array: true, nullable: true })
    snowDepth: number[];

    @Field({ nullable: true })
    @Column({ nullable: true })
    cloudsCl: boolean;

    @Field({ nullable: true })
    @Column({ nullable: true })
    cloudsCm: boolean;
}

@InputType({ description: "Filter set for meteo data" })
export class GetMeteoDataInput {
    @Field()
    dateFrom: Date;

    @Field()
    dateTo: Date;
}

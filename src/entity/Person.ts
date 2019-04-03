import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column()
    position: string;

    @Column()
    photo: string;

    @Column()
    email: string;

    @Column()
    link: string;

}

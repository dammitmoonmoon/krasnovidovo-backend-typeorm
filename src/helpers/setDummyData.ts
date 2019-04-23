import { getRepository } from "typeorm";
import {Person} from "../entities";

export async function setDummyPerson(): Promise<{defaultPerson: Person}> {
    const personRepository = getRepository(Person);
    const defaultPerson = personRepository.create({
        fullName: "Remus Lupin",
        position: "Professor of Defence Against the Dark Arts",
        email: "mooney@hogwarts.com",
        photo: "https://69.media.tumblr.com/c8cba4c138f0cc0b8106b0c3ac9b883a/tumblr_nj86xxYBR61u5iclvo1_500.jpg",
        link: "https://harrypotter.fandom.com/wiki/Remus_Lupin",
    });
    await personRepository.save(defaultPerson);
    return {
        defaultPerson,
    };
}

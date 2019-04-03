import "reflect-metadata";
import {createConnection} from "typeorm";
import {Person} from "./entity";

createConnection().then(async connection => {

    const person = new Person();
    person.fullName = "Remus Lupin";
    person.position = "Professor of Defence Against the Dark Arts";
    person.email = "mooney@hogwarts.com";
    person.photo = "https://69.media.tumblr.com/c8cba4c138f0cc0b8106b0c3ac9b883a/tumblr_nj86xxYBR61u5iclvo1_500.jpg";
    person.link = "https://harrypotter.fandom.com/wiki/Remus_Lupin";
    await connection.manager.save(person);
    console.log("Saved a new person with id: " + person.id);

    console.log("Loading persons from the database...");
    const persons = await connection.manager.find(Person);
    console.log("Loaded persons: ", persons);

}).catch(error => console.log(error));

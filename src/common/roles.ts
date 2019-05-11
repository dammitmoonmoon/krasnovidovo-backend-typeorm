import { registerEnumType } from "type-graphql";

enum Roles {
    SUPERUSER = 'Superuser',
    USER = 'User',
}

registerEnumType(Roles, {
    name: "Roles",
    description: "Only superuser can create other users",
});

export {
    Roles,
};

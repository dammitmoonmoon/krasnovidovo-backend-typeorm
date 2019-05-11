import {EnumedDict} from "../helpers/typescript-helpers";
import {ApolloError} from "apollo-server-errors";
import {registerEnumType} from "type-graphql";

enum ErrorCodes {
    user_not_found = "user_not_found",
    password_invalid = "password_invalid",
    user_exists = "user_exists",
    logout_failed = "logout_failed",
    wrong_image_format = "wrong_image_format",
    image_saving_failed = "image_saving_failed",
    temp_file_not_removed = "temp_file_not_removed",
    session_not_found = "session_not_found"
}

const customErrors: EnumedDict<ErrorCodes, CustomError> = {
    [ErrorCodes.user_not_found]: {
        message: "User not found",
        code: ErrorCodes.user_not_found,
    },
    [ErrorCodes.password_invalid]: {
        message: "Password is invalid",
        code: ErrorCodes.password_invalid,
    },
    [ErrorCodes.user_exists]: {
        message: "User already exists in the database",
        code: ErrorCodes.user_exists,
    },
    [ErrorCodes.logout_failed]: {
        message: "Logout failed",
        code: ErrorCodes.logout_failed,
    },
    [ErrorCodes.wrong_image_format]: {
        message: "Image has wrong format",
        code: ErrorCodes.wrong_image_format,
    },
    [ErrorCodes.image_saving_failed]: {
        message: "Image saving has failed",
        code: ErrorCodes.image_saving_failed,
    },
    [ErrorCodes.temp_file_not_removed]: {
        message: "failed to remove temporary file",
        code: ErrorCodes.temp_file_not_removed,
    },
    [ErrorCodes.session_not_found]: {
        message: 'Session not found. Check cookies.',
        code: ErrorCodes.session_not_found,
    }
};

interface CustomError {
    message: string;
    code: string;
}

const throwCustomError = (error: ErrorCodes) => {
    const {message, code} = customErrors[error];
    throw new ApolloError(message, code);
};

registerEnumType(ErrorCodes, {
    name: "ErrorCodes",
    description: "Only superuser can create other users",
});

export {
    customErrors,
    throwCustomError,
    ErrorCodes,
};

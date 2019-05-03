import {EnumedDict} from "../helpers/typescript-helpers";
import {ApolloError} from "apollo-server-errors";

enum ErrorTitles {
    UserNotFound = "UserNotFound",
    PasswordInvalid = "PasswordInvalid",
    AlreadyExists = "AlreadyExists",
    LogoutFailed = "LogoutFailed",
    ImageHasWrongFormat = "ImageHasWrongFormat",
    ImageSavingFailed = "ImageSavingFailed",
}

enum ErrorCodes {
    UserNotFound = "user_not_found",
    PasswordInvalid = "password_invalid",
    AlreadyExists = "entity_exists",
    LogoutFailed = "logout_failed",
    ImageHasWrongFormat = "wrong_image_format",
    ImageSavingFailed = "image_saving_failed",
}

interface CustomError {
    message: string;
    code: string;
}

const customErrors: EnumedDict<ErrorTitles, CustomError> =
    Object.keys(ErrorTitles).reduce((target, errorTitle) => {
        const currentError = {
            [ErrorTitles[errorTitle]]: {
                message: ErrorTitles[errorTitle],
                code: ErrorCodes[errorTitle],
            }
        };
        return {...target, ...currentError};
    }, {} as EnumedDict<ErrorTitles, CustomError>);

const throwCustomError = (error: ErrorTitles) => {
    const {message, code} = customErrors[error];
    throw new ApolloError(message, code);
};

export {
    ErrorTitles,
    customErrors,
    throwCustomError,
};

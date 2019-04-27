enum ErrorTitles {
    UserNotFound,
    PasswordInvalid,
    AlreadyExists,
    LogoutFailed,
}

enum ErrorCodes {
    UserNotFound = "user_not_found",
    PasswordInvalid = "password_invalid",
    AlreadyExists = "entity_exists",
    LogoutFailed = "logout_failed"
}

interface CustomError {
    message: string;
    code: string;
}

const customErrors = {
    [ErrorTitles.UserNotFound]: {
        message: ErrorTitles.UserNotFound,
        code: ErrorCodes.UserNotFound,
    },
};

export {
    ErrorTitles,
    customErrors,
};

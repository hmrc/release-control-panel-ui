"use strict";

const ErrorReason  =
{
    NotAuthenticated: 1,
    ServiceUnavailable: 2,
    InternalServerError: 3,
    Other: 4,
    CouldNotParseXml: 5,
    CommandFailed: 6,
    CouldNotParseJson: 7,
    ConnectionTimeout: 8,
    UserIsLocked: 9,
    InvalidUsernameOrPassword: 10,
    UserAlreadyExists: 11
};

export default ErrorReason;
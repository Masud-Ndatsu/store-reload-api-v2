class HttpException extends Error {
     status: number;
     override message: string;

     constructor(status: number, message: string) {
          super(message);
          this.status = status;
          this.message = message;
     }
}

export class AuthTokenRequired extends HttpException {
     constructor() {
          super(401, "Auth token required");
     }
}

export class AuthTokenInvalid extends HttpException {
     constructor() {
          super(402, "Invalid auth token");
     }
}

export class UserAlreadyExists extends HttpException {
     constructor() {
          super(409, "User already exists");
     }
}

export class InvalidCredentials extends HttpException {
     constructor() {
          super(403, "Invalid credentials");
     }
}

export class UnAuthorized extends HttpException {
     constructor() {
          super(401, "Unauthorized user");
     }
}

export class UserNotFound extends HttpException {
     constructor() {
          super(404, "User not found");
     }
}
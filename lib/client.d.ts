export = Client;
declare class Client {
    clientConfig: {
        url: string;
        accessToken: string;
    };
    request: Request;
    email: EmailClient;
    setAccessToken(token: any): void;
}
import Request = require("./request");
import EmailClient = require("./email");

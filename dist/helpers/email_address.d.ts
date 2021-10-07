export = EmailAddress;
declare class EmailAddress {
    static fromString(emailString: any): {
        name: any;
        email: any;
    };
    static create(emailData: any): any;
    constructor(data: any);
    setEmail(email: any): void;
    email: string;
    setName(name: any): void;
    name: string;
    toJSON(): {
        email: string;
    };
}

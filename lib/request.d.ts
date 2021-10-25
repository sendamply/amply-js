export = Request;
declare class Request {
    constructor(config: any);
    config: any;
    get(path: any, params: any, options?: {}): Promise<any>;
    post(path: any, body: any, options?: {}): Promise<any>;
    put(path: any, body: any, options?: {}): Promise<any>;
    del(path: any, options?: {}): Promise<any>;
    authHeader(): {
        Authorization: string;
    };
}

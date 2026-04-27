export interface RequestWithBody<T> extends Express.Request {
    body: T;
}

export interface User {
    id: number;
    name: string;
    email: string;
}
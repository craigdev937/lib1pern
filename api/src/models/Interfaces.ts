export interface IData {
    id: number,
    first: string,
    last: string,
    type: string,
    email: string,
    created_at?: string,
    updated_at?: string
};

export interface IUser extends IData {
    password: string
};

export interface JwtPayload {
    id: number,
    email: string
};





export enum TYPE {
    "ADMIN",
    "EMPLOYEE",
    "PATRON"
};

export interface IData {
    id: number,
    first: string,
    last: string,
    type: TYPE,
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

export interface IBook {
    id: number,
    barcode: string,
    cover_url: string,
    title: string,
    authors: string[],
    description: string,
    subjects: string[],
    publication_date: string,
    publisher: string,
    pages: number,
    genre: string,
    created_at: string,
    updated_at: string
};

export interface ILibCard {
    user: string
};





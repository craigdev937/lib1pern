export type THEME = "light" | "dark";

export interface ITheme {
    mode: THEME
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

export interface IBData {
    success: boolean,
    message: string,
    data: IBook[]
};





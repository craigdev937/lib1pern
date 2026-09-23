import { createApi, 
    fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IBData, IBookData } from "../models/interfaces";
const URL = "http://localhost:9000/api";

export const BookAPI = createApi({
    reducerPath: "BookAPI",
    tagTypes: ["Books"],
    baseQuery: fetchBaseQuery({ baseUrl: URL }),
    endpoints: (builder) => ({
        allBooks: builder.query<IBData, void>({
            query: () => ({
                url: "/books",
                method: "GET"
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) => 
                    ({ type: "Books" as const, id })),
                { type: "Books", id: "LIST" },
            ] : [{ type: "Books", id: "LIST" }]
        }),
        oneBook: builder.query<IBookData, number>({
            query: (id) => ({
                url: `/books/${id}`,
                method: "GET",
            }),
            providesTags: [{type: "Books", id: 1}]
        }),
    })
});



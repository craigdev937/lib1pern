import { createApi, 
    fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IUser, IUData } from "../models/interfaces";
const URL = "http://localhost:9000/api";

export const AuthAPI = createApi({
    reducerPath: "AuthAPI",
    tagTypes: ["Auth"],
    baseQuery: fetchBaseQuery({ baseUrl: URL }),
    endpoints: (builder) => ({
        all: builder.query<IUData, void>({
            query: () => ({
                url: "/users",
                method: "GET"
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) => 
                    ({ type: "Auth" as const, id })),
                { type: "Auth", id: "LIST" },
            ] : [{ type: "Auth", id: "LIST" }]
        }),
        one: builder.query<IUser, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "GET"
            }),
            providesTags: ["Auth"]
        }),
        // reg: builder.mutation<>({

        // })
    })
});




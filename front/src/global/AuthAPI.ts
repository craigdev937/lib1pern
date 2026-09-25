import { createApi, 
    fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IUser, IUData } from "../models/interfaces";
import type { UType, LType } from "../validation/Schema";
const URL = "http://localhost:9000/api";

type SessionUser = Omit<IUser, "password">;
type ProfileResponse = { success: boolean; message: string; data: SessionUser };
type RegisterResponse = {
    success: boolean; message: string; data: { user: SessionUser; token: string };
};
type LoginResponse = {
    success: boolean; message: string; data: Pick<IUser, "id" | "email">; token: string;
};

export const AuthAPI = createApi({
    reducerPath: "AuthAPI",
    tagTypes: ["Auth"],
    baseQuery: fetchBaseQuery({
        baseUrl: URL,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        profile: builder.query<ProfileResponse, void>({
            query: () => "/users/profile",
            providesTags: [{ type: "Auth", id: "SESSION" }],
        }),
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
        reg: builder.mutation<RegisterResponse, UType>({
            query: (payload) => ({
                url: "/users/register",
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Auth"]
        }),
        log: builder.mutation<LoginResponse, LType>({
            query: (payload) => ({
                url: "/users/login",
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Auth"]
        }),
        update: builder.mutation<number, IUser>({
            query: ({ id, ...payload }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: payload
            }),
            invalidatesTags: ["Auth"]
        })
    })
});




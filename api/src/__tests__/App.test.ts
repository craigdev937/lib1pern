import request from "supertest";
import { describe, expect, it } from "@rstest/core";
import { APP } from "../App.js";

describe("GET /", () => {
    it("should return 200 OK", async () => {
        const response = await request(APP)
            .get("/")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            status: "Hello World!"
        });
    });
});




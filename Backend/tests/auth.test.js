const request = require("supertest");
const app = require("../src/app");

describe("Authentication API", () => {

    test("Should return 401 for invalid login credentials", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "wronguser@example.com",
                password: "wrongpassword"
            });

        expect(response.statusCode).toBe(401);
    });

});
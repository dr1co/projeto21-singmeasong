import supertest from 'supertest';
import { prisma } from '../src/database';
import app from '../src/app';

beforeAll(() => {
    prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
});

describe("POST /reccomendations", () => {
    it("201: Fields properly filled", async () => {
        const newRecommendation = { 
            name: "Snow halation - Love Live! OST [Piano]",
            youtubeLink: "https://www.youtube.com/watch?v=Z4KmL4KI0cQ"
        };

        const { status } = await supertest(app).post("/recommendations").send(newRecommendation);

        expect(status).toEqual(201);
    });

    it("422: Recommendation name is empty", async () => {
        const newRecommendation = {
            name: "", // Unravel - Tokyo Ghoul OP [Piano]
            youtubeLink: "https://www.youtube.com/watch?v=sEQf5lcnj_o"
        };

        const { status } = await supertest(app).post("/recommendations").send(newRecommendation);

        expect(status).toEqual(422);
    });

    it("422: YoutubeLink is not an actual youtube link", async () => {
        const newRecommendation = {
            name: "Departures - Guilty Crown ED1 [Piano]",
            youtubeLink: "www.google.com" // https://www.youtube.com/watch?v=5hft807EJ6o
        };

        const { status } = await supertest(app).post("/recommendations").send(newRecommendation);

        expect(status).toEqual(422);
    });
})
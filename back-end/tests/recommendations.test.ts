import supertest from 'supertest';
import { prisma } from '../src/database';
import app from '../src/app';
import { recommendationList } from './factory/recommendationFactory';
import * as testServices from '../src/services/testServices';

beforeAll(async () => {
    for (let i = 0 ; i < recommendationList.length ; i++) {
        await prisma.$executeRaw`INSERT INTO "recommendations" ("name", "youtubeLink")
        VALUES (${recommendationList[i].name}, ${recommendationList[i].youtubeLink});`;
    };
});

afterAll( async () => {
    await testServices.resetRecommendations();
});

describe("POST /reccomendations", () => {
    it("201: Fields properly filled", async () => {
        const newRecommendation = { 
            name: "Snow halation - Love Live! OST [Piano]",
            youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        };

        const { status } = await supertest(app).post("/recommendations").send(newRecommendation);

        expect(status).toEqual(201);
    });

    it("409: Recommendation name conflicts with other already in the database", async () => {
        const newRecommendation = {
            name: "Snow halation - Love Live! OST [Piano]",
            youtubeLink: "https"
        }
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
            name: "This game (2021 ver.) - No Game No Life [Piano] / Konomi Suzuki",
            youtubeLink: "www.google.com" // https://www.youtube.com/watch?v=j137kcnJs8U
        };

        const { status } = await supertest(app).post("/recommendations").send(newRecommendation);

        expect(status).toEqual(422);
    });
});

describe("POST /recommendations/:id", () => {
    it("200: successful /upvote", async () => {
        const id = 1 // Departures - Guilty Crown ED1 [Piano]

        const { status } = await supertest(app).post(`/recommendations/${id}/upvote`);

        expect(status).toEqual(200);
    });

    it("200: successful /downvote", async () => {
        const id = 2 // Sincerely - Violet Evergarden OP [Piano]

        const { status } = await supertest(app).post(`/recommendations/${id}/downvote`);

        expect(status).toEqual(200);
    });

    it("404: ID does not match any recommendation", async () => {
        const id = 0;

        const { status } = await supertest(app).post(`/recommendations/${id}/upvote`);

        expect(status).toEqual(404);
    })
});

describe("GET /recommendations", () => {
    it("200: successfully get last 10 recommendations", async () => {
        const result = await supertest(app).get("/recommendations");

        expect(result.status).toEqual(200);
        expect(result.body).toEqual(expect.any(Array));
        expect(result.body.length).toBeLessThanOrEqual(10);
    });
});

describe("GET /recommendations/:id", () => {
    it("200: successfully get specific recommendation via ID", async () => {
        const id = 3 // Hikaru Nara - Shigatsu wa Kimi no Uso OP [Piano]

        const result = await supertest(app).get(`/recommendations/${id}`);

        expect(result.status).toEqual(200);
        expect(result.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            youtubeLink: expect.any(String),
            score: expect.any(Number)
        }));
    });

    it("404: ID does not match any recommendation", async () => {
        const id = 0;

        const { status } = await supertest(app).get(`/recommendations/${id}`);

        expect(status).toEqual(404);
    })
});

describe("GET /recommendations/top/:amount", () => {
    it("200: successfully get list of top recommendations based on amount", async () => {
        const amount = 5;

        const result = await supertest(app).get(`/recommendations/top/${amount}`);

        expect(result.status).toEqual(200);
        expect(result.body).toEqual(expect.any(Array));
        expect(result.body.length).toBeLessThanOrEqual(amount);
    });
});

describe("GET /recommendations/random", () => {
    it("200: successfully get random recommendation", async () => {
        const result = await supertest(app).get(`/recommendations/random`);

        expect(result.status).toEqual(200);
        expect(result.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            youtubeLink: expect.any(String),
            score: expect.any(Number)
        }));
    });

    it("404: returns nothing if there's no recommendations in the database", async () => {
        await testServices.resetRecommendations();

        const result = await supertest(app).get(`/recommendations/random`);

        expect(result.status).toEqual(404);
    });
});

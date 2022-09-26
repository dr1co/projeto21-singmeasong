import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationList } from '../factory/recommendationFactory';
import * as errorUtils from '../../src/utils/errorUtils';

describe("Test insert function", () => {
    const { name, youtubeLink } = recommendationList[0];

    it("Success on inserting new recommendation", async () => {

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(() => {
            return null;
        });
        jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce(null);

        await recommendationService.insert({
            name,
            youtubeLink
        });

        expect(recommendationRepository.create).toBeCalledTimes(1);
    });

    it("Fails due to naming conflict", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {
            return {
                name,
                youtubeLink
            };
        });

        const result = recommendationService.insert({
            name,
            youtubeLink
        });

        expect(result).rejects.toEqual(errorUtils.conflictError("Recommendations names must be unique"));
    });
});

describe("Test upvote/downvote functions", () => {
    const randomId = 1;
    const { name, youtubeLink } = recommendationList[0];

    it("Success on upvoting new recommendation", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
            return {
                name,
                youtubeLink
            };
        });
        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce(null);

        await recommendationService.upvote(randomId);

        expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    });

    it("Fails to upvote due to ID not found", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

        const result = recommendationService.upvote(randomId);

        expect(result).rejects.toEqual(errorUtils.notFoundError("Recommendation not found"));
    });

    it("Success on downvoting new recommendation", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
            return {
                name,
                youtubeLink
            };
        });
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {
            return {
                score: 10
            };
        });

        await recommendationService.downvote(randomId);

        expect(recommendationRepository.updateScore).toBeCalledTimes(2); // 2 pelo fato de já ter sido chamada anteriormente no primeiro it
    });

    it("Success on deleting new recommendation as it's score got below -5", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
            return {
                name,
                youtubeLink
            };
        });
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {
            return {
                score: -10
            };
        });
        jest.spyOn(recommendationRepository, "remove").mockResolvedValueOnce(null);

        await recommendationService.downvote(randomId);

        expect(recommendationRepository.remove).toBeCalledTimes(1);
    });

    it("Fails to downvote due to ID not found", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

        const result = recommendationService.downvote(randomId);

        expect(result).rejects.toEqual(errorUtils.notFoundError("Recommendation not found"));
    });
});

describe("Test get function", () => {
    it("Success on getting recommendations", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [1, 2, 3];
        });

        await recommendationService.get();

        expect(recommendationRepository.findAll).toBeCalledTimes(1);
    });
});

describe("Test getRandom function", () => {
    it("Success on getting random song w/ 10+ upvotes", async () => {
        jest.spyOn(Math, "random").mockImplementationOnce(() => {
            return 0.5;
        });
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [1, 2, 3];
        });

        await recommendationService.getRandom();

        expect(recommendationRepository.findAll).toBeCalledTimes(2); // 2 por conta de já ter sido chamada no describe anterior, pela função get()
    });

    it("Success on getting random song w/ 10 upvotes or less", async () => {
        jest.spyOn(Math, "random").mockImplementationOnce(() => {
            return 0.8;
        });
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [1, 2, 3];
        });

        await recommendationService.getRandom();

        expect(recommendationRepository.findAll).toBeCalledTimes(3); // 3 pelo mesmo motivo
    });

    it("Fails since there are no recommendations in the database", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

        const result = recommendationService.getRandom();

        expect(result).rejects.toEqual(errorUtils.notFoundError());
    });
});

describe("Test getTop function", () => {
    const amount = 7;

    it("Success on getting top results", async () => {
        jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce((): any => {
            return [1, 2, 3];
        });

        await recommendationService.getTop(amount);

        expect(recommendationRepository.getAmountByScore).toBeCalledTimes(1);
    })
})
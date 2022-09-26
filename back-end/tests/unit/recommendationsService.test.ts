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

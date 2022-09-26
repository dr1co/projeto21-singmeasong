import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationList } from '../factory/recommendationFactory';
import * as errorUtils from '../../src/utils/errorUtils';

describe("Test insert function", () => {
    it("Success on inserting new recommendation", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(() => {
            return null;
        });
        jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce(null);

        const { name, youtubeLink } = recommendationList[0];

        await recommendationService.insert({
            name,
            youtubeLink
        });

        expect(recommendationRepository.create).toBeCalledTimes(1);
    });

    it("Fails due to naming conflict", async () => {
        const { name, youtubeLink} = recommendationList[0];

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
    
})
import { Request, Response } from 'express';

import * as testServices from '../services/testServices.js';

export async function resetRecommendations(req: Request, res: Response) {
    await testServices.resetRecommendations();

    res.sendStatus(200);
}
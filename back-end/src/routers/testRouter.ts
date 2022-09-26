import express from 'express';

import * as testController from '../controllers/testController.js';

const testRouter = express.Router();

testRouter.post("/resetRecommendations", testController.resetRecommendations);

export default testRouter
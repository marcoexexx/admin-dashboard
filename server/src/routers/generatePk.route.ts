import { Router } from "express";
import { generateUuid } from "../utils/generateUuid";
import { HttpDataResponse } from "../utils/helper";

const router = Router();

router.route("")
  .get(async (_req, res, _next) => {
    const pk = generateUuid();

    res.status(200).json(HttpDataResponse({ pk }));
  });

export default router;

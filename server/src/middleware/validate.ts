import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from "../utils/helper";

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).json(HttpResponse(422, "invalid input", err.errors))
      }

      next(err)
    }
  }
} 

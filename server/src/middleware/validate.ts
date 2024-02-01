import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from "../utils/helper";
import { StatusCode } from "../utils/appError";


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
        return res.status(StatusCode.UnprocessableEntity).json(HttpResponse(StatusCode.UnprocessableEntity, "invalid input", err.errors))
      }

      next(err)
    }
  }
} 

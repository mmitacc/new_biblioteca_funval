import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod/v4";
import { z } from "zod/v4";

export const validarBodySchema = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.safeParseAsync(req.body);
      if (!result.success) {
        res
          .status(400)
          .json({
            status: "error",
            error: z.treeifyError(result.error).errors,
          });
        return;
      }
      req.body = result.data;
      next();
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Error interno del servidor" });
    }
  };
};

export const validarParamSchema = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.safeParseAsync(req.params);
      if (!result.success) {
        res
          .status(400)
          .json({
            status: "error",
            error: z.treeifyError(result.error).errors,
          });
        return;
      }
      req.params = result.data as any;
      next();
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Error interno del servidor" });
    }
  };
};

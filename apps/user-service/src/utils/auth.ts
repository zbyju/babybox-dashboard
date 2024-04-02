import * as jwt from "jsonwebtoken";
import { z } from "zod";

import type { UserSanitized } from "../models/user.model";

import { None, type Option, Some } from "./errors";

export function signJWT(user: UserSanitized) {
  const payload = { username: user.username, email: user.email };
  const options = { expiresIn: "7d" };

  const secret = process.env.JWT_SECRET || "secret";
  const token = jwt.sign(payload, secret, options);

  return token;
}

export const jwtPayloadSchema = z.object({
  username: z.string(),
  email: z.string(),
  exp: z.number().optional(),
});

export interface JWTPayload {
  username: string;
  email: string;
  exp?: number;
}

export function isAuthenticated(headers: Record<string, string | undefined>): {
  isAuth: boolean;
  payload: JWTPayload | null;
} {
  const token = extractToken(headers["authorization"]);
  if (token.isNone()) {
    return { isAuth: false, payload: null };
  }

  const secret = process.env.JWT_SECRET || "secret";
  try {
    const res = jwt.verify(token.unwrap(), secret);
    const payload = jwtPayloadSchema.parse(res);

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { isAuth: false, payload };
    }

    return { isAuth: true, payload };
  } catch (error) {
    return { isAuth: false, payload: null };
  }
}

export function extractToken(
  authHeader: string | null | undefined,
): Option<string> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new None();
  }
  return new Some(authHeader.slice(7));
}

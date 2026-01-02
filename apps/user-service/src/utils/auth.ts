import * as jwt from "jsonwebtoken";
import { z } from "zod";

import type { UserSanitized } from "../models/user.model";

import { None, type Option, Some } from "./errors";

export function signJWT(user: UserSanitized) {
  const payload = { username: user.username, email: user.email };
  const options = { expiresIn: 60 * 60 * 24 * 365 }; // TODO: handle this properly (for now: 1 year expiry)

  const secret = process.env.JWT_SECRET || "";
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

export function isValid(
  headers: Record<string, string | undefined>,
): JWTPayload | null {
  const token = extractToken(headers["authorization"]);
  if (token.isNone()) {
    return null;
  }

  const secret = process.env.JWT_SECRET || "secret";
  try {
    const res = jwt.verify(token.unwrap(), secret);
    const payload = jwtPayloadSchema.parse(res);
    return payload;
  } catch (erroe) {
    return null;
  }
}

export function isAuthenticated(headers: Record<string, string | undefined>): {
  isAuth: boolean;
  payload: JWTPayload | null;
} {
  const payload = isValid(headers);

  if (payload === null) {
    return { isAuth: false, payload };
  }

  if (payload.exp && Date.now() >= payload.exp * 1000) {
    return { isAuth: false, payload };
  }

  return { isAuth: true, payload };
}

export function extractToken(
  authHeader: string | null | undefined,
): Option<string> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new None();
  }
  return new Some(authHeader.slice(7));
}

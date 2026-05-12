import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";

import checkAuth from "../../middleware/check-auth.js";

describe("checkAuth", () => {
  beforeEach(() => {
    process.env.JWT_KEY = "test-secret-key";
  });

  it("laisse passer une requête OPTIONS sans jeton", () => {
    const req = { method: "OPTIONS", headers: {} };
    const res = {};
    const next = vi.fn();

    checkAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.userData).toBeUndefined();
  });

  it("rejette une requête sans en-tête Authorization", () => {
    const req = { method: "GET", headers: {} };
    const res = {};
    const next = vi.fn();

    checkAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].code).toBe(401);
  });

  it("attache le userId quand le jeton est valide", () => {
    const token = jwt.sign({ userId: "u1" }, process.env.JWT_KEY);
    const req = {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    };
    const res = {};
    const next = vi.fn();

    checkAuth(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.userData).toEqual({ userId: "u1" });
  });
});
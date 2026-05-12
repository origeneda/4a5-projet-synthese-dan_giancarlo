import { describe, expect, it, vi } from "vitest";

import errorHandler from "../../handler/error-handler.js";
import HttpError from "../../util/http-error.js";

describe("errorHandler", () => {
  it("retourne le code et le message de l'erreur", () => {
    const req = {};
    const next = vi.fn();
    const res = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    errorHandler(new HttpError("Accès refusé", 403), req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Accès refusé" });
    expect(next).not.toHaveBeenCalled();
  });
});
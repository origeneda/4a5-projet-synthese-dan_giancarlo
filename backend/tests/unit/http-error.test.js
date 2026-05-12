import { describe, expect, it } from "vitest";

import HttpError from "../../util/http-error.js";

describe("HttpError", () => {
  it("conserve le message et le code HTTP", () => {
    const error = new HttpError("Erreur de test", 422);

    expect(error.message).toBe("Erreur de test");
    expect(error.code).toBe(422);
    expect(error.statusCode).toBe(422);
  });
});
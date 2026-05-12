import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import app from "../../app.js";
import User from "../../models/user.js";
import {
  clearTestDatabase,
  connectTestDatabase,
  disconnectTestDatabase,
} from "../helpers/test-db.js";

describe("API backend", () => {
  beforeAll(async () => {
    process.env.JWT_KEY = "test-secret-key";
    await connectTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it("inscrit un utilisateur via /api/auth/register", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin RefMatch",
        email: "admin@refmatch.com",
        password: "secret123",
        role: "admin",
      })
      .expect(201);

    expect(response.body.email).toBe("admin@refmatch.com");
    expect(response.body.role).toBe("admin");
    expect(response.body.token).toBeTruthy();

    const storedUser = await User.findOne({ email: "admin@refmatch.com" });
    expect(storedUser).not.toBeNull();
    expect(storedUser.password).not.toBe("secret123");
  });

  it("connecte un utilisateur existant via /api/auth/login", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Gestionnaire",
      email: "gestion@refmatch.com",
      password: "secret123",
      role: "admin",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "gestion@refmatch.com",
        password: "secret123",
      })
      .expect(200);

    expect(response.body.email).toBe("gestion@refmatch.com");
    expect(response.body.token).toBeTruthy();
  });

  it("retourne la liste vide des matchs si aucun match n'existe", async () => {
    const response = await request(app).get("/api/matches").expect(200);

    expect(response.body).toEqual({ matches: [] });
  });
});
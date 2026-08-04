// app.test.js
import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "./createApp";

describe("Express App", () => {
  it("GET /api/helloworld", async () => {
    const app = createApp();
    const res = await request(app).get("/api/helloworld");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ hello: "world" });
  });
});

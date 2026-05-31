import { describe, it, expect, vi } from "vitest";
import { generateToken, authenticateToken } from "../src/middleware/auth.js";
import type { Request, Response, NextFunction } from "express";

describe("Auth Middleware - generateToken", () => {
  it("should generate a valid JWT token", () => {
    const token = generateToken("test-user-id");
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should generate different tokens for different users", () => {
    const token1 = generateToken("user-1");
    const token2 = generateToken("user-2");
    expect(token1).not.toBe(token2);
  });
});

describe("Auth Middleware - authenticateToken", () => {
  function createMocks(authHeader?: string) {
    const req = {
      headers: authHeader ? { authorization: authHeader } : {},
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;
    return { req, res, next };
  }

  it("should return 401 if no token is provided", () => {
    const { req, res, next } = createMocks();
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if an invalid token is provided", () => {
    const { req, res, next } = createMocks("Bearer invalid-token");
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() if a valid token is provided", () => {
    const validToken = generateToken("test-user-id");
    const { req, res, next } = createMocks(`Bearer ${validToken}`);
    authenticateToken(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

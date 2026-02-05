import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, games } from "../server.ts";

describe("Tic Tac Toe API", () => {
  beforeEach(() => {
    // Clear games before each test for isolation
    games.clear();
  });

  describe("POST /api/newgame", () => {
    it("should create a new game", async () => {
      const response = await request(app).post("/api/newgame").expect(200);

      expect(typeof response.body.id).toBe("string");
      expect(response.body.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(response.body.board).toEqual([
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]);
      expect(response.body.currentPlayer).toBe("X");
      expect(response.body.winner).toBe(null);
    });
  });

  describe("GET /api/games/:id", () => {
    it("should get a game by id", async () => {
      const createResponse = await request(app)
        .post("/api/newgame")
        .expect(200);

      const gameId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/games/${gameId}`)
        .expect(200);

      expect(response.body).toEqual(createResponse.body);
    });

    it("should return 404 for non-existent game", async () => {
      const response = await request(app)
        .get("/api/games/non-existent-id")
        .expect(404);

      expect(response.body).toEqual({ error: "Game not found" });
    });
  });

  describe.only("POST /api/games/:id/move", () => {
    it("should make a valid move", async () => {
      const createResponse = await request(app)
        .post("/api/newgame")
        .expect(200);

      const gameId = createResponse.body.id;

      const response = await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ position: 0 })
        .expect(200);

      expect(response.body.board[0]).toBe("X");
      expect(response.body.currentPlayer).toBe("O");
    });

    it("should return 404 for non-existent game", async () => {
      const response = await request(app)
        .post("/api/games/non-existent-id/move")
        .send({ position: 0 })
        .expect(404);

      expect(response.body).toEqual({ error: "Game not found" });
    });

    it("should return 400 for invalid position", async () => {
      const createResponse = await request(app)
        .post("/api/newgame")
        .expect(200);

      const gameId = createResponse.body.id;

      const response = await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ position: "invalid" })
        .expect(400);

      expect(response.body).toEqual({ error: "Position must be a number" });
    });

    it("should return 400 for occupied position", async () => {
      const createResponse = await request(app)
        .post("/api/newgame")
        .expect(200);

      const gameId = createResponse.body.id;

      await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ position: 0 })
        .expect(200);

      const response = await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ position: 0 })
        .expect(400);

      expect(response.body).toEqual({ error: "Position is already occupied" });
    });

    it("should return 400 when game is already over", async () => {
      const createResponse = await request(app)
        .post("/api/newgame")
        .expect(200);

      const gameId = createResponse.body.id;

      // Create a winning scenario for X
      await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ position: 0 }); // X
      await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ position: 3 }); // O
      await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ position: 1 }); // X
      await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ position: 4 }); // O
      await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ position: 2 }); // X wins

      const response = await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ position: 5 })
        .expect(400);

      expect(response.body).toEqual({ error: "Game is already over" });
    });
  });

  describe("POST /api/games/:id/reset", () => {
    it("should reset an existing game", async () => {
      const createResponse = await request(app)
        .post("/api/newgame")
        .expect(200);

      const gameId = createResponse.body.id;

      // Make a move
      await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ position: 0 })
        .expect(200);

      const response = await request(app)
        .post(`/api/games/${gameId}/reset`)
        .expect(200);

      expect(response.body).toEqual({
        id: gameId,
        board: [null, null, null, null, null, null, null, null, null],
        currentPlayer: "X",
        winner: null,
      });
    });

    it("should return 404 for non-existent game", async () => {
      const response = await request(app)
        .post("/api/games/non-existent-id/reset")
        .expect(404);

      expect(response.body).toEqual({ error: "Game not found" });
    });
  });

  //   describe("GET /api/games", () => {
  //     it("should list all games", async () => {
  //       const game1Response = await request(app).post("/api/newgame").expect(200);

  //       const game2Response = await request(app).post("/api/newgame").expect(200);

  //       const response = await request(app).get("/api/games").expect(200);

  //       expect(response.body).toHaveLength(2);
  //       expect(response.body).toEqual(
  //         expect.arrayContaining([game1Response.body, game2Response.body]),
  //       );
  //     });

  //     it("should return empty array when no games exist", async () => {
  //       const response = await request(app).get("/api/games").expect(200);

  //       expect(response.body).toEqual([]);
  //     });
  //   });

  //   describe("DELETE /api/games/:id", () => {
  //     it("should delete an existing game", async () => {
  //       const createResponse = await request(app).post("/api/newgame").expect(200);

  //       const gameId = createResponse.body.id;

  //       await request(app).delete(`/api/games/${gameId}`).expect(204);

  //       // Verify game is deleted
  //       await request(app).get(`/api/games/${gameId}`).expect(404);
  //     });

  //     it("should return 404 for non-existent game", async () => {
  //       const response = await request(app)
  //         .delete("/api/games/non-existent-id")
  //         .expect(404);

  //       expect(response.body).toEqual({ error: "Game not found" });
  //     });
  //   });

  //   describe("Game flow integration test", () => {
  //     it("should play a complete game with winner detection", async () => {
  //       const createResponse = await request(app).post("/api/newgame").expect(200);

  //       const gameId = createResponse.body.id;

  //       // X wins on top row
  //       const move1 = await request(app)
  //         .post(`/api/games/${gameId}/move`)
  //         .send({ position: 0 });
  //       expect(move1.body.board[0]).toBe("X");
  //       expect(move1.body.currentPlayer).toBe("O");
  //       expect(move1.body.winner).toBe(null);

  //       const move2 = await request(app)
  //         .post(`/api/games/${gameId}/move`)
  //         .send({ position: 3 });
  //       expect(move2.body.board[3]).toBe("O");
  //       expect(move2.body.currentPlayer).toBe("X");
  //       expect(move2.body.winner).toBe(null);

  //       const move3 = await request(app)
  //         .post(`/api/games/${gameId}/move`)
  //         .send({ position: 1 });
  //       expect(move3.body.board[1]).toBe("X");
  //       expect(move3.body.currentPlayer).toBe("O");
  //       expect(move3.body.winner).toBe(null);

  //       const move4 = await request(app)
  //         .post(`/api/games/${gameId}/move`)
  //         .send({ position: 4 });
  //       expect(move4.body.board[4]).toBe("O");
  //       expect(move4.body.currentPlayer).toBe("X");
  //       expect(move4.body.winner).toBe(null);

  //       const move5 = await request(app)
  //         .post(`/api/games/${gameId}/move`)
  //         .send({ position: 2 });
  //       expect(move5.body.board[2]).toBe("X");
  //       expect(move5.body.winner).toBe("X"); // X wins!
  //     });
  //   });
});

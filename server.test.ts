import { beforeEach, describe, expect, it } from "vitest"
import request from "supertest"
import { app, resetGamesforTest } from "./server.ts"

beforeEach(()=>{
    resetGamesforTest()
})

// ---------------------------------------------------------------------------
// create new game
// ---------------------------------------------------------------------------
describe("createGame", () => {
    it("creates a brand new game", async () => {
        const response = await request(app).post("/api/create").send()
        expect(response.status).toBe(201)
        expect(response.body.id).toBeDefined()
        // expect(response.body.currentPlayer).toBe("X") // not needed due to repeating game logic tests from TTT test
        // expect(response.body.board).toEqual([null, null, null, null, null, null, null, null, null]) // not needed due to repeating game logic tests from TTT test
    })
    
    it("returns different id", async () => {
        const a = await request(app).post("/api/create").send()
        const b = await request(app).post("/api/create").send()
        expect(a.body.id).not.toBe(b.body.id)
    })
})

// ---------------------------------------------------------------------------
// reset same game
// ---------------------------------------------------------------------------
// describe("resetGame", () => {
//     it("resets the same game")
// })


// ---------------------------------------------------------------------------
// get game list
// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// make move
// ---------------------------------------------------------------------------


// from TTT test file
// describe("createGame", () => {
//   it("returns an empty board", () => {
//     const game = createGame();
//     expect(game.board).toEqual([null, null, null, null, null, null, null, null, null]);
//   });

//   it("starts with X as the current player", () => {
//     const game = createGame();
//     expect(game.currentPlayer).toBe("X");
//   });
// });
import express from "express";
import ViteExpress from "vite-express";
import { createGame, makeMove, getWinner } from "./src/tic-tac-toe";

const app = express();
const PORT = 3000;

app.use(express.json())

let gameState = createGame() // make game upon initialization

// simple route test
app.get("/message", (request, response) => 
    response.send("Hello from express!"));

// Get gameState from server 
app.get("/api/game", (request, response) => {
   response.json(gameState)
})

// Post move to server - verified with Postman
app.post("/api/move", (request, response)=> {
    const position = request.body.position 
    gameState = makeMove(gameState, position)
    response.json(gameState)
})


ViteExpress.listen(app, PORT, () => 
    console.log(`Server is listening on port ${PORT}`));
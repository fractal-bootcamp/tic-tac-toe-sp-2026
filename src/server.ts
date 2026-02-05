import express, { json } from "express";
import ViteExpress from "vite-express";
import cors from 'cors';

import { createGame, makeMove, type GameState } from './ultimate-tic-tac-toe.ts'

export function createServer() {
    const app = express();
    app.use(json())
    app.use(cors({
        origin: '*',
        methods: '*',
    }))

    const games = new Map<String, GameState>()

    app.get("/health", (_, res) => {
        res.send('ok')
    })

    app.get("/games", (_, res) => {
        const gamesObject = Object.fromEntries(games)
        res.json(gamesObject)
    })

    app.get("/create", (_, res) => {
        const newGame = createGame()
        games.set(newGame.id, newGame)
        res.json(newGame)
    })

    app.get("/game/:id", (req, res) => {
        const gameId = req.params.id as string
        if (!games.has(gameId)) {
            res.status(404)
            throw new Error(`Game with ID ${gameId} doesn't exist!`)
        }
        res.json(games.get(gameId))
    })

    app.post("/move/:id", (req, res) => {
        const gameId = req.params.id as string
        console.log('body:', req.body)
        if (req.body?.mainIndex === undefined || req.body?.subIndex === undefined) {
            res.status(400)
            res.send('Missing mainIndex or subIndex!')
            return
        }
        const { mainIndex, subIndex } = req.body
        if (!games.has(gameId)) {
            res.status(404)
            res.send(`Game with ID ${gameId} doesn't exist!`)
            return
        }
        const game = games.get(gameId) as GameState
        const gameState = makeMove(game, mainIndex, subIndex)
        games.set(gameId, gameState)
        res.json(gameState)
    })

    return app
}


if (require.main === module) {
    const app = createServer()
    ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
}

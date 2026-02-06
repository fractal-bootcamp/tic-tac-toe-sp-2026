import { type UUID } from "../tic-tac-toe";
import React from "react";

interface lobbyProps {
  games: Array<UUID>;
  onJoin: (board_id: UUID) => Promise<UUID>;
  createGame: () => void;
}

export function Lobby(props: lobbyProps) {
  return (
    <>
      {props.games.map((boardID: UUID) => (
        <>
          <button key={boardID} onClick={() => props.onJoin(boardID)}>
            {boardID}
          </button>
          <br />
        </>
      ))}
      <br />
      <br />
      <button onClick={() => props.createGame()}>New Game</button>
    </>
  );
}

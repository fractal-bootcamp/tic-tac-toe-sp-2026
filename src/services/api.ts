import {
  getWinner,
  type CellIndex,
  type GameState,
  type UUID,
} from "../tic-tac-toe";

export async function sendMove(props: {
  currentGame: UUID;
  index: CellIndex;
}): Promise<GameState> {
  try {
    const res = await fetch(`/api/games/${props.currentGame}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        index: props.index,
      }),
    });
    const json = await res.json();
    console.log("moved player");
    return json;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function requestNewGame() {
  try {
    const res = await fetch("/api/createNewGame", {
      method: "POST",
    });
    const json = await res.json();
    return json;

    console.log("creatednewgame");
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function requestJoinGame(board_id: UUID) {
  try {
    const res = await fetch(`/api/games/${board_id}`, {
      method: "GET",
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function requestGames() {
  try {
    const res = await fetch("/api/games", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

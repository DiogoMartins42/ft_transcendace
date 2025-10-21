import { GameEngine } from "./gameEngine.js";
import crypto from "crypto";

export class Matchmaking {
  constructor() {
    this.players = new Map();
    this.waiting = [];
    this.matches = new Map();
  }

  addPlayer(socket, username) {
    const id = crypto.randomUUID();
    const player = {
      id,
      username: username || `guest_${Math.floor(Math.random() * 10000)}`,
      socket,
    };
    this.players.set(id, player);
    return player;
  }

  removePlayer(id) {
    const player = this.players.get(id);
    if (!player) return;

    this.players.delete(id);
    this.waiting = this.waiting.filter((p) => p.id !== id);

    if (player.gameId) {
      const match = this.matches.get(player.gameId);
      if (!match) return;

      const opponent = match.player1.id === id ? match.player2 : match.player1;
      if (opponent?.socket?.readyState === 1) {
        opponent.socket.send(
          JSON.stringify({
            type: "opponentDisconnected",
            message: "Opponent disconnected — waiting for reconnection...",
          })
        );
      }

      console.log(`⚠️ Player ${player.username} disconnected. Waiting 15s before ending match.`);
      setTimeout(() => {
        const stillMissing = !this.players.has(id);
        if (stillMissing && this.matches.has(player.gameId)) {
          this.endMatch(player.gameId);
        } else {
          console.log(`✅ Player ${player.username} rejoined before timeout.`);
        }
      }, 15000);
    }
  }

  findMatch(player) {
    if (this.waiting.length > 0) {
      const opponent = this.waiting.shift();
      const matchId = crypto.randomUUID();
      const game = new GameEngine();

      const match = { id: matchId, player1: opponent, player2: player, game };
      this.matches.set(matchId, match);

      opponent.opponentId = player.id;
      player.opponentId = opponent.id;
      opponent.gameId = player.gameId = matchId;

      opponent.socket.send(
        JSON.stringify({
          type: "matchFound",
          role: "left",
          opponent: player.username,
        })
      );
      player.socket.send(
        JSON.stringify({
          type: "matchFound",
          role: "right",
          opponent: opponent.username,
        })
      );

      console.log(`🎮 New match ${matchId} between ${opponent.username} and ${player.username}`);
    } else {
      this.waiting.push(player);
      player.socket.send(
        JSON.stringify({ type: "waiting", message: "Waiting for an opponent..." })
      );
    }
  }

  rejoinPlayer(socket, username) {
    const existing = Array.from(this.matches.values()).find(
      (m) =>
        (m.player1.username === username && !this.players.has(m.player1.id)) ||
        (m.player2.username === username && !this.players.has(m.player2.id))
    );

    if (existing) {
      const player =
        existing.player1.username === username ? existing.player1 : existing.player2;
      player.socket = socket;
      this.players.set(player.id, player);
      console.log(`🔁 ${username} rejoined match ${existing.id}`);

      player.socket.send(
        JSON.stringify({ type: "rejoined", matchId: existing.id })
      );

      const opponent =
        existing.player1.username === username ? existing.player2 : existing.player1;
      if (opponent?.socket?.readyState === 1) {
        opponent.socket.send(
          JSON.stringify({ type: "opponentRejoined", username })
        );
      }
      return true;
    }
    return false;
  }

  createInvite(senderId, receiverUsername) {
    const sender = this.players.get(senderId);
    const receiver = Array.from(this.players.values()).find(
      (p) => p.username === receiverUsername
    );
    if (!sender || !receiver) return false;

    receiver.socket.send(
      JSON.stringify({
        type: "invite",
        from: sender.username,
      })
    );
    return true;
  }

  acceptInvite(receiverId, senderUsername) {
    const receiver = this.players.get(receiverId);
    const sender = Array.from(this.players.values()).find(
      (p) => p.username === senderUsername
    );
    if (!receiver || !sender) return false;

    const matchId = crypto.randomUUID();
    const game = new GameEngine();
    const match = { id: matchId, player1: sender, player2: receiver, game };
    this.matches.set(matchId, match);

    sender.socket.send(
      JSON.stringify({
        type: "matchFound",
        role: "left",
        opponent: receiver.username,
      })
    );
    receiver.socket.send(
      JSON.stringify({
        type: "matchFound",
        role: "right",
        opponent: sender.username,
      })
    );

    return true;
  }

  endMatch(id) {
    const match = this.matches.get(id);
    if (!match) return;
    this.matches.delete(id);
    console.log(`🏁 Match ${id} ended`);
  }
}

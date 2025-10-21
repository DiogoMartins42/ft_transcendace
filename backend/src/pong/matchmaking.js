import { GameEngine } from "./gameEngine.js";

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
    if (player.gameId) this.endMatch(player.gameId);
  }

  /** Auto matchmaking: find another free player */
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

      // Notify both players
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

  /** Invitation-based matchmaking */
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

  getMatch(id) {
    return this.matches.get(id);
  }

  endMatch(id) {
    const match = this.matches.get(id);
    if (!match) return;
    this.matches.delete(id);
    console.log(`🏁 Match ${id} ended`);
  }
}

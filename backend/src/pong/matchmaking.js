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
      gameId: null,
      opponentId: null
    };
    this.players.set(id, player);
    console.log(`👤 Player ${player.username} joined (${this.players.size} total)`);
    return player;
  }

  removePlayer(id) {
    const player = this.players.get(id);
    if (!player) return;

    console.log(`👋 Player ${player.username} left`);
    
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
      
      // Set timeout to end match if player doesn't reconnect
      setTimeout(() => {
        const stillMissing = !this.players.has(id);
        if (stillMissing && this.matches.has(player.gameId)) {
          console.log(`🏁 Ending match ${player.gameId} due to player disconnect`);
          this.endMatch(player.gameId);
          
          // Notify opponent
          if (opponent?.socket?.readyState === 1) {
            opponent.socket.send(
              JSON.stringify({
                type: "matchEnded",
                reason: "Opponent disconnected"
              })
            );
          }
        }
      }, 15000);
    }
  }

  findMatch(player) {
    // Remove from waiting if already there
    this.waiting = this.waiting.filter(p => p.id !== player.id);
    
    if (this.waiting.length > 0) {
      const opponent = this.waiting.shift();
      
      // Make sure opponent is still connected
      if (!this.players.has(opponent.id)) {
        // Try again with next opponent
        return this.findMatch(player);
      }

      const matchId = crypto.randomUUID();
      const game = new GameEngine();

      const match = { 
        id: matchId, 
        player1: opponent, 
        player2: player, 
        game,
        inputs: {}
      };
      
      this.matches.set(matchId, match);

      opponent.opponentId = player.id;
      player.opponentId = opponent.id;
      opponent.gameId = player.gameId = matchId;

      // --- NEW: start game engine safely if available ---
      try {
        if (match.game && typeof match.game.start === "function") {
          match.game.start();
          console.info("[matchmaking] started game engine for match", matchId);
        } else {
          console.info("[matchmaking] game.start not available for match", matchId);
        }
} catch (err) {
  console.warn("[matchmaking] error starting game engine:", err);
}

// derive an initialState safely if the game engine provides one
let initialState = null;
try {
  if (match.game && typeof match.game.getState === "function") {
    initialState = match.game.getState();
  } else if (match.game && typeof match.game.serialize === "function") {
    initialState = match.game.serialize();
  }
} catch (err) {
  console.warn("[matchmaking] failed to obtain initialState for match", matchId, err);
}

// prepare payloads for each participant (assign left/right or player roles)
const payloadA = {
  type: 'matchFound',
  matchId,
  role: 'left',
  opponent: player.username,
  ...(initialState ? { initialState } : {})
};
const payloadB = {
  type: 'matchFound',
  matchId,
  role: 'right',
  opponent: opponent.username,
  ...(initialState ? { initialState } : {})
};

      try {
        console.info('[WS SEND] ->', opponent.username, JSON.stringify(payloadB));
        opponent.socket.send(JSON.stringify(payloadB));
      } catch (err) {
        console.error('[WS SEND ERROR] playerB', opponent.username, err);
      }
      try {
        console.info('[WS SEND] ->', player.username, JSON.stringify(payloadA));
        player.socket.send(JSON.stringify(payloadA));
      } catch (err) {
        console.error('[WS SEND ERROR] playerA', player.username, err);
      }

      console.log(`🎮 New match ${matchId} between ${opponent.username} and ${player.username}`);
      return match;
    } else {
      this.waiting.push(player);
      player.socket.send(
        JSON.stringify({ 
          type: "waiting", 
          message: "Waiting for an opponent...",
          queuePosition: this.waiting.length
        })
      );
      console.log(`⏳ ${player.username} added to waiting queue (${this.waiting.length} waiting)`);
      return null;
    }
  }

  rejoinPlayer(socket, username) {
    // Find match where this username was playing but not currently connected
    for (const [matchId, match] of this.matches.entries()) {
      if (match.player1.username === username && !this.players.has(match.player1.id)) {
        // Reconnect player1
        const player = match.player1;
        player.socket = socket;
        this.players.set(player.id, player);
        
        console.log(`🔁 ${username} rejoined match ${matchId} as player1`);
        
        player.socket.send(
          JSON.stringify({ 
            type: "rejoined", 
            matchId: matchId,
            role: "left",
            opponent: match.player2.username
          })
        );

        const opponent = match.player2;
        if (opponent?.socket?.readyState === 1) {
          opponent.socket.send(
            JSON.stringify({ 
              type: "opponentRejoined", 
              username: username 
            })
          );
        }
        return true;
      }
      
      if (match.player2.username === username && !this.players.has(match.player2.id)) {
        // Reconnect player2
        const player = match.player2;
        player.socket = socket;
        this.players.set(player.id, player);
        
        console.log(`🔁 ${username} rejoined match ${matchId} as player2`);
        
        player.socket.send(
          JSON.stringify({ 
            type: "rejoined", 
            matchId: matchId,
            role: "right", 
            opponent: match.player1.username
          })
        );

        const opponent = match.player1;
        if (opponent?.socket?.readyState === 1) {
          opponent.socket.send(
            JSON.stringify({ 
              type: "opponentRejoined", 
              username: username 
            })
          );
        }
        return true;
      }
    }
    
    return false;
  }

  createInvite(senderId, receiverUsername) {
    const sender = this.players.get(senderId);
    const receiver = Array.from(this.players.values()).find(
      (p) => p.username === receiverUsername && !p.gameId
    );
    
    if (!sender || !receiver) return false;

    receiver.socket.send(
      JSON.stringify({
        type: "invite",
        from: sender.username,
        fromId: sender.id
      })
    );
    
    console.log(`📨 ${sender.username} invited ${receiverUsername} to play`);
    return true;
  }

  acceptInvite(receiverId, senderUsername) {
    const receiver = this.players.get(receiverId);
    const sender = Array.from(this.players.values()).find(
      (p) => p.username === senderUsername && !p.gameId
    );
    
    if (!receiver || !sender) return false;

    const matchId = crypto.randomUUID();
    const game = new GameEngine();
    
    const match = { 
      id: matchId, 
      player1: sender, 
      player2: receiver, 
      game,
      inputs: {}
    };
    
    this.matches.set(matchId, match);

    sender.gameId = receiver.gameId = matchId;
    sender.opponentId = receiver.id;
    receiver.opponentId = sender.id;

    sender.socket.send(
      JSON.stringify({
        type: "matchFound",
        role: "left",
        opponent: receiver.username,
        matchId: matchId
      })
    );
    
    receiver.socket.send(
      JSON.stringify({
        type: "matchFound",
        role: "right",
        opponent: sender.username,
        matchId: matchId
      })
    );

    console.log(`🎮 Invite match ${matchId} between ${sender.username} and ${receiver.username}`);
    return true;
  }

  endMatch(matchId) {
    const match = this.matches.get(matchId);
    if (!match) return;
    if (match._stateInterval) {
      clearInterval(match._stateInterval);
      match._stateInterval = null;
      console.info('[matchmaking] cleared state broadcaster for match', matchId);
    }
    // Clear game IDs from players
    if (match.player1) match.player1.gameId = null;
    if (match.player2) match.player2.gameId = null;
    
    this.matches.delete(matchId);
    console.log(`🏁 Match ${matchId} ended`);
  }

  // Utility methods
  getPlayerCount() {
    return this.players.size;
  }

  getWaitingCount() {
    return this.waiting.length;
  }

  getMatchCount() {
    return this.matches.size;
  }
}
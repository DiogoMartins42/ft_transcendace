// backend/src/server.ts
import Fastify, { FastifyInstance, FastifyRequest } from "fastify";
import websocket from "@fastify/websocket";
import WebSocket from "ws";
import { GameEngine } from "./gameEngine";
import {
  InputMessage,
  ControlMessage,
  StateMessage,
  GameState,
} from "./pong_types";
import { gameSettings } from "./gameSettings";

type SocketStream = { socket: WebSocket };

// -------------------- Server Setup --------------------
const fastify: FastifyInstance = Fastify();
fastify.register(websocket);

// Canvas size per game
const canvasWidth = 800;
const canvasHeight = 600;

// -------------------- Match / Player model --------------------
type PlayerInfo = {
  id: string;                  // unique player id
  username?: string;           // present if logged-in, undefined for guest
  conn: SocketStream;
  matchId?: string;            // id of the match this player is currently in
};

type MatchInfo = {
  id: string;
  leftId: string;
  rightId: string;
  game: GameEngine;
  // per-match paddle velocities
  paddleVelocities: { left: number; right: number };
};

// In-memory stores (simple; persist or DB optional)
const players = new Map<string, PlayerInfo>();      // playerId -> PlayerInfo
const usernameToId = new Map<string, string>();     // username -> playerId (for invites)
const waitingQueue: string[] = [];                  // queue of playerIds waiting for match
const matches = new Map<string, MatchInfo>();       // matchId -> MatchInfo

// helper to generate simple IDs
function mkId(prefix = "p") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

// -------------------- Matchmaking + Invite helpers --------------------

// Create a new match with two playerIds (left/right)
function createMatch(leftId: string, rightId: string) {
  const matchId = mkId("m");
  const game = new GameEngine();
  const match: MatchInfo = {
    id: matchId,
    leftId,
    rightId,
    game,
    paddleVelocities: { left: 0, right: 0 },
  };
  matches.set(matchId, match);

  // mark players
  const left = players.get(leftId)!;
  const right = players.get(rightId)!;
  left.matchId = matchId;
  right.matchId = matchId;

  // notify both players
  left.conn.socket.send(
    JSON.stringify({
      type: "matchFound",
      role: "left",
      opponent: right.username ?? right.id,
      matchId,
    })
  );
  right.conn.socket.send(
    JSON.stringify({
      type: "matchFound",
      role: "right",
      opponent: left.username ?? left.id,
      matchId,
    })
  );

  return match;
}

// Try to match a newly waiting player with queue head
function tryMatchFromQueue(playerId: string) {
  // If queue has someone (not same player), pair them
  while (waitingQueue.length) {
    const otherId = waitingQueue.shift()!;
    if (otherId === playerId) continue; // skip self (shouldn't happen)
    if (!players.has(otherId)) continue; // skipped disconnected
    // create match: other becomes left, new player becomes right
    return createMatch(otherId, playerId);
  }
  // no one available -> push to queue
  waitingQueue.push(playerId);
  const p = players.get(playerId)!;
  p.conn.socket.send(
    JSON.stringify({ type: "waiting", message: "Waiting for an opponent..." })
  );
  return null;
}

// Invite flow: send invite to username (only works if inviter is logged-in)
function sendInvite(fromId: string, toUsername: string) {
  const from = players.get(fromId);
  if (!from) return { ok: false, reason: "inviter_not_found" };
  if (!from.username) return { ok: false, reason: "inviter_not_logged_in" };

  const toId = usernameToId.get(toUsername);
  if (!toId) return { ok: false, reason: "invitee_not_online" };
  const to = players.get(toId)!;

  // notify invitee
  to.conn.socket.send(
    JSON.stringify({ type: "invite", from: from.username })
  );
  return { ok: true };
}

// Accept invite: find inviter by username, create match if both still available
function acceptInvite(receiverId: string, inviterUsername: string) {
  const inviterId = usernameToId.get(inviterUsername);
  if (!inviterId) return { ok: false, reason: "inviter_not_online" };
  const inviter = players.get(inviterId)!;
  const receiver = players.get(receiverId)!;

  // If either is already in match, cannot accept
  if (inviter.matchId || receiver.matchId) {
    return { ok: false, reason: "one_already_in_match" };
  }

  // create match (inviter = left, receiver = right)
  const match = createMatch(inviterId, receiverId);
  return { ok: true, matchId: match.id };
}

// End and clean up match
function endMatch(matchId: string, reason?: string) {
  const match = matches.get(matchId);
  if (!match) return;
  const left = players.get(match.leftId);
  const right = players.get(match.rightId);

  // notify both (if connected)
  if (left) {
    left.conn.socket.send(
      JSON.stringify({ type: "matchEnded", reason: reason ?? "ended" })
    );
    left.matchId = undefined;
  }
  if (right) {
    right.conn.socket.send(
      JSON.stringify({ type: "matchEnded", reason: reason ?? "ended" })
    );
    right.matchId = undefined;
  }

  matches.delete(matchId);
}

// -------------------- WebSocket route --------------------
fastify.get(
  "/ws",
  { websocket: true },
  (connection: any, req: FastifyRequest) => {
    // Accept optional username in query: ws://host/ws?username=Alice
    const url = new URL(req.url ?? "", `http://${req.headers.host}`);
    const usernameQuery = url.searchParams.get("username") ?? undefined;

    // Create player record
    const playerId = mkId("p");
    const playerInfo: PlayerInfo = {
      id: playerId,
      username: usernameQuery ?? undefined, // undefined for guest
      conn: connection,
      matchId: undefined,
    };
    players.set(playerId, playerInfo);
    if (playerInfo.username) usernameToId.set(playerInfo.username, playerId);

    // Inform client of assigned id/username (useful)
    try {
      connection.socket.send(
        JSON.stringify({
          type: "connected",
          id: playerId,
          username: playerInfo.username ?? null,
        })
      );
    } catch (e) {
      // ignore
    }

    // Handler for messages
    connection.socket.on("message", (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString());

        // ---- Find Match (auto-match) ----
        if (msg.type === "findMatch") {
          // If already in a match: return current matchFound
          if (playerInfo.matchId) {
            const match = matches.get(playerInfo.matchId);
            if (match) {
              const opponentId =
                match.leftId === playerId ? match.rightId : match.leftId;
              const opponent = players.get(opponentId)!;
              connection.socket.send(
                JSON.stringify({
                  type: "matchFound",
                  role: match.leftId === playerId ? "left" : "right",
                  opponent: opponent.username ?? opponent.id,
                  matchId: match.id,
                })
              );
              return;
            }
          }
          // Try to get a match from queue
          tryMatchFromQueue(playerId);
          return;
        }

        // ---- Invite another user (only for logged-in usernames) ----
        if (msg.type === "invite") {
          const toUsername: string = msg.to;
          const res = sendInvite(playerId, toUsername);
          connection.socket.send(JSON.stringify({ type: "inviteResult", ...res }));
          return;
        }

        // ---- Accept invite (receiver accepts inviter by name) ----
        if (msg.type === "acceptInvite") {
          const inviterUsername: string = msg.from;
          const res = acceptInvite(playerId, inviterUsername);
          connection.socket.send(JSON.stringify({ type: "acceptResult", ...res }));
          return;
        }

        // ---- Control messages (start/pause/resume/restart) targeted to match ----
        if (msg.type === "control") {
          const control = msg as ControlMessage;
          const matchId = playerInfo.matchId;
          if (!matchId) return;
          const match = matches.get(matchId);
          if (!match) return;

          if (control.action === "start") {
            match.game.gameState = GameState.PLAYING;
            match.game.launchBall();
          } else if (control.action === "pause") {
            match.game.gameState = GameState.PAUSED;
          } else if (control.action === "resume") {
            match.game.gameState = GameState.PLAYING;
          } else if (control.action === "restart") {
            match.game.restart(canvasWidth, canvasHeight);
            // also reset paddle velocities
            match.paddleVelocities.left = 0;
            match.paddleVelocities.right = 0;
          }
          return;
        }

        // ---- Input messages control paddle velocity for player's match ----
        if (msg.type === "input") {
          const input = msg as InputMessage;
          const matchId = playerInfo.matchId;
          if (!matchId) return;
          const match = matches.get(matchId);
          if (!match) return;

          // Validate that input.player matches actual role of the sender
          const senderRole = match.leftId === playerId ? "left" : "right";
          if (input.player !== senderRole) {
            // ignore mismatched control messages
            return;
          }

          // update match paddle velocity map
          if (input.player === "left") {
            if (input.direction === "up") match.paddleVelocities.left = -gameSettings.paddleSpeed;
            else if (input.direction === "down") match.paddleVelocities.left = gameSettings.paddleSpeed;
            else if (input.direction === "stop") match.paddleVelocities.left = 0;
          } else {
            if (input.direction === "up") match.paddleVelocities.right = -gameSettings.paddleSpeed;
            else if (input.direction === "down") match.paddleVelocities.right = gameSettings.paddleSpeed;
            else if (input.direction === "stop") match.paddleVelocities.right = 0;
          }
          return;
        }

        // Unknown message type — ignore or log
      } catch (e) {
        console.error("Invalid message:", e);
      }
    });

    // Handle close connection
    connection.socket.on("close", () => {
      // remove from username map
      if (playerInfo.username) usernameToId.delete(playerInfo.username);
      players.delete(playerId);

      // remove from waiting queue
      const idx = waitingQueue.indexOf(playerId);
      if (idx >= 0) waitingQueue.splice(idx, 1);

      // if in a match, end match and notify opponent
      if (playerInfo.matchId) {
        const matchId = playerInfo.matchId;
        const match = matches.get(matchId);
        if (match) {
          const opponentId = match.leftId === playerId ? match.rightId : match.leftId;
          const opponent = players.get(opponentId);
          if (opponent) {
            opponent.conn.socket.send(JSON.stringify({ type: "opponentDisconnected" }));
            opponent.matchId = undefined;
          }
          matches.delete(matchId);
        }
      }
    });
  }
);

// -------------------- Game loop for all matches --------------------
// single loop iterating all matches at 30 FPS
setInterval(() => {
  for (const [matchId, match] of matches.entries()) {
    // Apply paddle velocities
    const g = match.game;
    g.player1.y += match.paddleVelocities.left;
    g.player2.y += match.paddleVelocities.right;

    // Clamp to canvas height
    g.player1.y = Math.max(0, Math.min(canvasHeight - g.player1.height, g.player1.y));
    g.player2.y = Math.max(0, Math.min(canvasHeight - g.player2.height, g.player2.y));

    // Update physics for this match
    g.update(canvasWidth, canvasHeight);

    // Build state message
    const state: StateMessage = {
      type: "state",
      gameState: g.gameState,
      ball: g.ball,
      paddles: { left: g.player1, right: g.player2 },
      score: { left: g.player1.score, right: g.player2.score },
    };

    const payload = JSON.stringify(state);

    // Send to both players (if still connected)
    const leftPlayer = players.get(match.leftId);
    const rightPlayer = players.get(match.rightId);
    if (leftPlayer) {
      try { leftPlayer.conn.socket.send(payload); } catch { /* ignore */ }
    }
    if (rightPlayer) {
      try { rightPlayer.conn.socket.send(payload); } catch { /* ignore */ }
    }
  }
}, 1000 / 30);

// -------------------- Start server (async listen) --------------------
fastify
  .listen({ port: 3000, host: "0.0.0.0" })
  .then((address) => console.log(`🚀 Server listening at ${address}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });



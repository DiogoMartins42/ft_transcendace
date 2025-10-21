// Game state constants
export const GameState = {
  START: "start",
  PLAYING: "playing",
  PAUSED: "paused",
  GAME_OVER: "game_over",
};

/**
 * @typedef {Object} Player
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number} score
 */

/**
 * @typedef {Object} Ball
 * @property {number} x
 * @property {number} y
 * @property {number} radius
 * @property {number} velocityX
 * @property {number} velocityY
 * @property {number} speed
 */

/**
 * @typedef {Object} Net
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

// Export placeholder constructors (so imports don’t break)
export const Player = {};
export const Ball = {};
export const Net = {};

// State message types used for WS updates
export const MessageTypes = {
  INPUT: "input",
  CONTROL: "control",
  STATE: "state",
  INVITE: "invite",
  MATCH_FOUND: "matchFound",
};


import { setPong } from './pong';
import { showOverlay} from './setupPong'
import { hideOverlay} from './setupPong'
import { setupPong } from './setupPong'

interface Player {
  name: string;
  score: number;
}

interface Match {
  p1: Player;
  p2: Player;
  winner?: Player;
  loser?: Player;
}

let players: Player[] = [];
let matches: Match[] = [];
let currentMatchIndex = 0;

export async function startTournament() {
  const canvas = document.getElementById("pong") as HTMLCanvasElement;
  if (!canvas) {
    console.error("❌ Canvas #pong not found in DOM!");
    showOverlay(2, [
      { text: "Back", onClick: () => { hideOverlay(); setupPong(); } }
    ], "Error: Game canvas not found. Please refresh the page.");
    return;
  }

  console.log("✅ Canvas found, starting tournament setup...");

  const playerNames = await showTournamentOverlay();
  if (playerNames.length === 0) return;

  console.log("🎮 Tournament players:", playerNames);

  // Initialize your player list
  players = playerNames.map(name => ({ name, score: 0 }));
  matches = [
    { p1: players[0], p2: players[1] },
    { p1: players[2], p2: players[3] },
  ];
  currentMatchIndex = 0;

  // Start the tournament
  startNextMatch();
}

function showTournamentOverlay(): Promise<string[]> {
  return new Promise((resolve) => {
    const overlay = document.getElementById("game-overlay");
    const msg = document.getElementById("game-message");
    const btns = document.getElementById("overlay-buttons");
    if (!overlay || !msg || !btns) return resolve([]);

    btns.innerHTML = "";
    msg.innerHTML = `
      <h1 class="text-3xl font-lucky text-center mt-8 mb-6 text-[#F5CB5C]">
        PONG TOURNAMENT
      </h1>
      <form id="tournament-form" class="space-y-4 max-w-md mx-auto">
        <div class="grid grid-cols-2 gap-4">
          <input type="text" id="p1" placeholder="Player 1 Name"
            class="p-2 text-white rounded bg-[#00091D] border border-gray-500 focus:border-[#F5CB5C]" required>
          <input type="text" id="p2" placeholder="Player 2 Name"
            class="p-2 text-white rounded bg-[#00091D] border border-gray-500 focus:border-[#F5CB5C]" required>
          <input type="text" id="p3" placeholder="Player 3 Name"
            class="p-2 text-white rounded bg-[#00091D] border border-gray-500 focus:border-[#F5CB5C]" required>
          <input type="text" id="p4" placeholder="Player 4 Name"
            class="p-2 text-white rounded bg-[#00091D] border border-gray-500 focus:border-[#F5CB5C]" required>
        </div>
        <div class="text-center mt-8">
          <button type="submit"
            class="bg-[#F5CB5C] text-[#0E172B] font-bold px-8 py-2 rounded-full hover:scale-105 transition-transform">
            Start Tournament
          </button>
        </div>
      </form>
    `;

    overlay.classList.remove("hidden");
    btns.classList.add("hidden");

    const form = document.getElementById("tournament-form") as HTMLFormElement;
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const players = [
        (document.getElementById("p1") as HTMLInputElement).value.trim(),
        (document.getElementById("p2") as HTMLInputElement).value.trim(),
        (document.getElementById("p3") as HTMLInputElement).value.trim(),
        (document.getElementById("p4") as HTMLInputElement).value.trim(),
      ];

      hideOverlay();
      resolve(players);
    });
  });
}

function startNextMatch() {
  const match = matches[currentMatchIndex];
  if (!match) return showResults();

  showMatchIntro(match);
}

function showMatchIntro(match: Match) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 text-white flex-col gap-4';
  overlay.innerHTML = `
    <h2 class="text-3xl font-lucky mb-4">Match ${currentMatchIndex + 1}</h2>
    <p class="text-xl">${match.p1.name} 🆚 ${match.p2.name}</p>
    <button id="startMatchBtn" class="mt-4 px-6 py-2 bg-[#F5CB5C] text-[#0E172B] rounded-full hover:scale-105 transition-transform">Start Match</button>
  `;
  document.body.appendChild(overlay);

  document.getElementById('startMatchBtn')!.addEventListener('click', () => {
    overlay.remove();
    launchPongMatch(match);
  });
}

function launchPongMatch(match: Match) {
  // Inject players into the game overlay
  const canvasWrap = document.getElementById('canvas-wrap');
  if (canvasWrap) {
    const label = document.createElement('div');
    label.className = 'absolute top-2 left-1/2 -translate-x-1/2 text-white text-lg font-bold z-30';
    label.id = 'match-label';
    label.textContent = `${match.p1.name} 🆚 ${match.p2.name}`;
    canvasWrap.appendChild(label);
  }

  // Listen for the game over
  const observer = new MutationObserver(() => {
    const msg = document.getElementById('game-message')?.textContent;
    if (msg?.includes('WINS') || msg?.includes('LOSES')) {
      observer.disconnect();
      onMatchEnd(match, msg!);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setPong();
}

function onMatchEnd(match: Match, msg: string) {
  const label = document.getElementById('match-label');
  if (label) label.remove();

  const p1Wins = msg.includes(match.p1.name.toUpperCase()) || msg.includes("PLAYER 1 WINS");
  match.winner = p1Wins ? match.p1 : match.p2;
  match.loser = p1Wins ? match.p2 : match.p1;

  currentMatchIndex++;

  if (currentMatchIndex < 2) {
    startNextMatch();
  } else {
    setupFinals();
  }
}

function setupFinals() {
  const winners = matches.map(m => m.winner!);
  const losers = matches.map(m => m.loser!);

  matches = [
    { p1: winners[0], p2: winners[1] },
    { p1: losers[0], p2: losers[1] },
  ];
  currentMatchIndex = 0;
  startNextMatch();
}

function showResults() {
  const results = [
    matches[0].winner!.name + " 🥇",
    matches[0].loser!.name + " 🥈",
    matches[1].winner!.name + " 🥉",
    matches[1].loser!.name,
  ];

  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 text-white';
  overlay.innerHTML = `
    <h2 class="text-3xl font-lucky mb-6">FINAL RESULTS</h2>
    <ul class="space-y-2 text-xl text-center">
      ${results.map(r => `<li>${r}</li>`).join('')}
    </ul>
    <button id="restartTournament" class="mt-6 px-6 py-2 bg-[#F5CB5C] text-[#0E172B] rounded-full hover:scale-105 transition-transform">New Tournament</button>
  `;
  document.body.appendChild(overlay);

  document.getElementById('restartTournament')!.addEventListener('click', () => {
    window.location.reload();
  });
}

/* export function submitTournament() {
  const form = document.getElementById('tournament-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect player names
    players = [
      { name: (document.getElementById('p1') as HTMLInputElement).value.trim(), score: 0 },
      { name: (document.getElementById('p2') as HTMLInputElement).value.trim(), score: 0 },
      { name: (document.getElementById('p3') as HTMLInputElement).value.trim(), score: 0 },
      { name: (document.getElementById('p4') as HTMLInputElement).value.trim(), score: 0 },
    ];
    gameSettings.multiplayer = true;

    setupMatches();
    startNextMatch();
  });
}

function setupMatches() {
  matches = [
    { p1: players[0], p2: players[1] },
    { p1: players[2], p2: players[3] },
  ];
}

function startNextMatch() {
  const match = matches[currentMatchIndex];
  if (!match) return showResults();

  showMatchIntro(match);
}

function showMatchIntro(match: Match) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 text-white flex-col gap-4';
  overlay.innerHTML = `
    <h2 class="text-3xl font-lucky mb-4">Match ${currentMatchIndex + 1}</h2>
    <p class="text-xl">${match.p1.name} 🆚 ${match.p2.name}</p>
    <button id="startMatchBtn" class="mt-4 px-6 py-2 bg-[#F5CB5C] text-[#0E172B] rounded-full hover:scale-105 transition-transform">Start Match</button>
  `;
  document.body.appendChild(overlay);

  document.getElementById('startMatchBtn')!.addEventListener('click', () => {
    overlay.remove();
    launchPongMatch(match);
  });
}

function launchPongMatch(match: Match) {
  // Inject players into the game overlay
  const canvasWrap = document.getElementById('canvas-wrap');
  if (canvasWrap) {
    const label = document.createElement('div');
    label.className = 'absolute top-2 left-1/2 -translate-x-1/2 text-white text-lg font-bold z-30';
    label.id = 'match-label';
    label.textContent = `${match.p1.name} 🆚 ${match.p2.name}`;
    canvasWrap.appendChild(label);
  }

  // Listen for the game over
  const observer = new MutationObserver(() => {
    const msg = document.getElementById('game-message')?.textContent;
    if (msg?.includes('WINS') || msg?.includes('LOSES')) {
      observer.disconnect();
      onMatchEnd(match, msg!);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setPong();
}

function onMatchEnd(match: Match, msg: string) {
  const label = document.getElementById('match-label');
  if (label) label.remove();

  const p1Wins = msg.includes(match.p1.name.toUpperCase()) || msg.includes("PLAYER 1 WINS");
  match.winner = p1Wins ? match.p1 : match.p2;
  match.loser = p1Wins ? match.p2 : match.p1;

  currentMatchIndex++;

  if (currentMatchIndex < 2) {
    startNextMatch();
  } else {
    setupFinals();
  }
}

function setupFinals() {
  const winners = matches.map(m => m.winner!);
  const losers = matches.map(m => m.loser!);

  matches = [
    { p1: winners[0], p2: winners[1] },
    { p1: losers[0], p2: losers[1] },
  ];
  currentMatchIndex = 0;
  startNextMatch();
}

function showResults() {
  const results = [
    matches[0].winner!.name + " 🥇",
    matches[0].loser!.name + " 🥈",
    matches[1].winner!.name + " 🥉",
    matches[1].loser!.name,
  ];

  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 text-white';
  overlay.innerHTML = `
    <h2 class="text-3xl font-lucky mb-6">FINAL RESULTS</h2>
    <ul class="space-y-2 text-xl text-center">
      ${results.map(r => `<li>${r}</li>`).join('')}
    </ul>
    <button id="restartTournament" class="mt-6 px-6 py-2 bg-[#F5CB5C] text-[#0E172B] rounded-full hover:scale-105 transition-transform">New Tournament</button>
  `;
  document.body.appendChild(overlay);

  document.getElementById('restartTournament')!.addEventListener('click', () => {
    window.location.reload();
  });
}
 */
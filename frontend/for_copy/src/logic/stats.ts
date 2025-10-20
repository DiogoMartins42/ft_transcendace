import { loadSession } from "./session";
import { sharedState } from "../main";

function getLoggedInUsername(){
  //First, try to get username from stored session
  const session = loadSession();
  if (session?.user?.username){
    return session?.user.username;
  }
}

export function setupStatsPage() {
    const statsContainer = document.getElementById('stats-container');
	if (!statsContainer) return; // not on stats page → do nothing

    // console.log("Stats Script loaded"); 

    const fetchButton = document.getElementById('fetchData') as HTMLButtonElement;
    const usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
    const errorMessage = document.getElementById('errorMessage') as HTMLElement;
    const loadingElement = document.getElementById('loading') as HTMLElement;

    // Elements to update
    const infoUsername = document.getElementById('infoUsername')!;
    const infoEmail = document.getElementById('infoEmail')!;
    const winsCount = document.getElementById('winsCount')!;
    const lossesCount = document.getElementById('lossesCount')!;
    const winRatio = document.getElementById('winRatio')!;

    async function fetchUserData(username: string) {
      loadingElement.style.display = 'block';
      errorMessage.style.display = 'none';
      try {
        const res = await fetch(`/stats/api/user-stats?username=${username}`);
        const matchesRes = await fetch(`/stats/api/matches/${username}`);
        if (!res.ok || !matchesRes.ok)
            throw new Error("Invalid user");

        const user = await res.json();
        const matches = await matchesRes.json();
        updateUserData(user, matches);
      }
      catch (err){
        errorMessage.textContent = `Error: ${(err as Error).message}`;
        errorMessage.style.display = 'block';
      }
      finally{
        loadingElement.style.display = 'none';
      }
    }

  function updateUserData(user: any, matches: any) {
    (infoUsername as HTMLElement).textContent = user.username;
    (infoEmail as HTMLElement).textContent = user.email;

    let wins = 0, losses = 0;
    matches.matches.forEach((m: any) => {
      if (m.winner === user.username) wins++;
      else if (m.loser === user.username) losses++;
    });
    winsCount.textContent = String(wins);
    lossesCount.textContent = String(losses);
    winRatio.textContent = `${((wins / (wins + losses)) * 100 || 0).toFixed(1)}%`;

    renderMatchHistory(matches);
  }

  function renderMatchHistory(matches: any) {
    const grid = document.getElementById("matchHistoryGrid")!;
    grid.innerHTML = "";
    if (!matches.matches || matches.matches.length === 0) {
      grid.innerHTML = `<p>No matches yet</p>`;
      return;
    }
    
    matches.matches.forEach((m: any) => {
      const card = document.createElement("div");
      card.classList.add("match-card");
      
      // Format the date nicely
      const matchDate = new Date(m.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      card.innerHTML = `
        <h3>Match #${m.id}</h3>
        <div class="match-date">${matchDate}</div>
        <div class="match-details">
          <span class="winner">${m.winner} (${m.winner_points})</span>
          <span class="vs">VS</span>
          <span class="loser">${m.loser} (${m.loser_points})</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  fetchButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) fetchUserData(username);
    else {
      errorMessage.textContent = 'Please enter a username';
      errorMessage.style.display = 'block';
    }
  });
}

// Save match if the user is logged in
/* export async function save_match(p1_score: number, p2_score: number, multiplayer: boolean) {
  const username = getLoggedInUsername();

  var winner : string;
  var loser : string;
  var winner_points : number;
  var loser_points : number;

  //if player isn't logged in, ignore saving the match (wait for the function)

  //Change winner = "<logged in user name>"
  if(p1_score > p2_score){
    winner_points = p1_score;
    loser_points = p2_score;
  
    winner = "nome";
    //winner = username;
    if(multiplayer) {loser = "guest_multiplayer";}
    else {loser = "bot";}
  }
  //Change loser = "<logged in user name>"
  else{
    winner_points = p2_score;
    loser_points = p1_score;
  
    loser = "nome";
    //loser = username;
    if(multiplayer) {winner = "guest_multiplayer";}
    else {winner = "bot";}
  }

  try {
    const res = await fetch("/stats/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        winner,
        loser,
        winner_points,
        loser_points,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Failed to save match:", err);
      return;
    }

    const data = await res.json();
    //console.log("Match saved:", data);
    return data;
  }
  catch (err){
    console.error("Error saving match:", err);
  }
} */

export async function save_match(p1_score: number, p2_score: number, multiplayer: boolean) {
  const username = sharedState.username;

  var winner : string;
  var loser : string;
  var winner_points : number;
  var loser_points : number;

  if(p1_score > p2_score){
    winner_points = p1_score;
    loser_points = p2_score;
  
    winner = username || "nome"; // change to actual username
    if(multiplayer) {loser = "guest_multiplayer";}
    else {loser = "bot";}
  }
  else{
    winner_points = p2_score;
    loser_points = p1_score;
  
    loser = username || "nome"; // change to actual username
    if(multiplayer) {winner = "guest_multiplayer";}
    else {winner = "bot";}
  }

  // Don't save if user isn't logged in (both players are bots/guests)
  if ((winner === "bot" || winner === "guest_multiplayer") && 
      (loser === "bot" || loser === "guest_multiplayer")) {
    console.log("Match not saved: No logged-in user");
    return;
  }

  try {
    const res = await fetch("/stats/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        winner,
        loser,
        winner_points,
        loser_points,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Failed to save match:", err);
      return;
    }

    const data = await res.json();
    console.log("Match saved with timestamp:", data);
    return data;
  }
  catch (err){
    console.error("Error saving match:", err);
  }
}
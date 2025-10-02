export function setupStatsPage() {
    const statsContainer = document.getElementById('stats-container');
	if (!statsContainer) return; // not on stats page → do nothing

    console.log("Stats Script loaded");

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
      card.innerHTML = `
        <h3>Match #${m.id}</h3>
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

export async function save_match(p1_score: number, p2_score: number, multiplayer: boolean) {
  // TO-DO: replace with actual logged-in players once you have auth
  const winner = "nome";
  var loser = "bot";

  if(multiplayer)
    loser = "guest_multiplayer";

  const winner_points = p1_score > p2_score ? p1_score : p2_score;
  const loser_points = p1_score > p2_score ? p2_score : p1_score;

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
    console.log("Match saved:", data);
    return data;
  }
  catch (err){
    console.error("Error saving match:", err);
  }
}

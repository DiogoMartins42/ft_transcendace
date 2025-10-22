(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const m of r.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&t(m)}).observe(document,{childList:!0,subtree:!0});function o(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(s){if(s.ep)return;s.ep=!0;const r=o(s);fetch(s.href,r)}})();const he=`<main id="page-content" class="pt-16 flex-1">
  <div class="fixed top-16 left-0 right-0 bottom-0 bg-[#000000] bg-[radial-gradient(#8390FA77_1px,#00091d_1px)] bg-[size:20px_20px] flex justify-center items-center">
  <!-- <div class="fixed top-16 left-0 right-0 bottom-0 bg-[#0E172B] flex justify-center items-center"> -->
    <div id="canvas-wrap" class="relative w-[1000px] h-[600px]">
      <canvas id="pong" width="1000" height="600"></canvas>

      <!-- Settings button -->
      <div class="group mt-4 w-14 overflow-hidden rounded-lg border-l border-transparent  transition-all duration-500 hover:w-64 hover:border-[#F5CB5C] hover:shadow-lg has-[:focus]:w-64 has-[:focus]:shadow-lg">
        <button id="openSettings" class="peer hover:bg-[#0E172B] flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-blue-800 transition-all active:scale-95">
          <div class="rounded-lg border-2 border-[#F5CB5C] bg-[#1C39BB] p-1">
            <svg
              class="size-6"
              stroke="#F5CB5C"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                stroke-linejoin="round"
                stroke-linecap="round">
              </path>
              <path
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                stroke-linejoin="round"
                stroke-linecap="round">
              </path>
            </svg>
          </div>
          <div class="font-semibold text-[#F5CB5C]">Settings</div>
        </button>
      </div>

      <!-- Pause button on the semi-circle (top-center) -->
      <button
        id="pause-btn"
        class="absolute left-1/2 -translate-x-1/2 top-0 z-20 h-7 w-7 rounded-full bg-transparent text-black text-sm font-semibold shadow hover:bg-transparent"
        aria-label="Pause"
        title="Pause (Space)">
        II
      </button>

      <!-- Overlay that dims ONLY the canvas; hidden during gameplay -->
      <div id="game-overlay" class="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
        <div class="text-center space-y-4">
          <p id="game-message" class="text-white text-2xl font-semibold"></p>
          <div id="overlay-buttons" class="flex gap-3 justify-center"></div>
        </div>
      </div>
    </div>
  </div>
</main>






 `,fe=`<nav class="bg-[#0E172B] text-[#242423] font-bold w-screen
			flex items-center justify-between fixed top-0 left-0 right-0 h-18 z-50" >
	<div class="flex gap-4 ml-7">
		<!-- Hamburger menu -->
		<label>
  			<div class="w-9 h-10 cursor-pointer flex flex-col items-center justify-center">
    			<input id="menu-toggle" class="hidden peer" type="checkbox" />
    			<div class="w-[70%] h-[2px] bg-[#F5CB5C] rounded-sm transition-all duration-300 origin-left translate-y-[0.63rem] peer-checked:rotate-[-45deg]"></div>
    				<div class="w-[70%] h-[2px] bg-[#F5CB5C] rounded-md transition-all duration-300 origin-center peer-checked:hidden"></div>
    			<div class="w-[70%] h-[2px] bg-[#F5CB5C] rounded-md transition-all duration-300 origin-left -translate-y-[0.63rem] peer-checked:rotate-[45deg]"></div>
  			</div>
		</label>
	</div>
	<a href="#home"  class="flex items-center gap-2 ml-2 absolute left-1/2 transform -translate-x-1/2">
		<button class="flex items-center gap-2 p-2 cursor-pointer text-[#F5CB5C] text-5xl font-lucky">
			PONG
		</button>
	</a>
	<div id="user-section" class="flex gap-4 mr-7">
		<!-- Login Button - Using open-login ID -->
		<button id="open-login" class="bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] text-black font-bold py-2 px-4 rounded-md transition ease-in-out duration-150 hover:opacity-80 cursor-pointer">
			Login
		</button>
  	</div>
</nav>`,be=`<section class="bg-amber-400 w-full h-screen m-0 p-0">
  <h1 class="text-2xl font-bold">ABOUT</h1>
</section>`,ve=`<section>
    <h1 class="text-3xl font-lucky text-center mt-16 mb-6 text-[#F5CB5C]">PONG TOURNAMENT</h1>
    <form id="tournament-form" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <input type="text" id="p1" placeholder="Player 1 Name" class="p-2 text-white rounded bg-[#00091D] border border-gray-500 focus:border-[#F5CB5C]" required>
        <input type="text" id="p2" placeholder="Player 2 Name" class="p-2 text-white rounded bg-[#00091D] border border-gray-500 focus:border-[#F5CB5C]" required>
        <input type="text" id="p3" placeholder="Player 3 Name" class="p-2 text-white rounded bg-[#00091D] border border-gray-500 focus:border-[#F5CB5C]" required>
        <input type="text" id="p4" placeholder="Player 4 Name" class="p-2 text-white rounded bg-[#00091D] border border-gray-500 focus:border-[#F5CB5C]" required>
      </div>

      <h2 class="text-lg font-semibold mt-6">Game Settings</h2>
      <div class="flex justify-between">
        <label>Score Limit:
          <input type="number" id="scoreLimit" value="5" class="w-16 text-center text-black rounded">
        </label>
        <label>Ball Speed:
          <input type="number" id="ballSpeed" step="0.1" value="5" class="w-16 text-center text-black rounded">
        </label>
        <label>Paddle Speed:
          <input type="number" id="paddleSpeed" step="0.5" value="7" class="w-16 text-center text-black rounded">
        </label>
      </div>

      <div class="text-center mt-8">
        <button type="submit"
          class="bg-[#F5CB5C] text-[#0E172B] font-bold px-8 py-2 rounded-full hover:scale-105 transition-transform">
          Start Tournament
        </button>
      </div>
    </form>
  </section>
`,ye=`<section>
  <div class="grid grid-cols-4 gap-4">
  <div class="col-span-1 bg-gray-900 p-4 rounded-xl" id="chat-users"></div>

  <div class="col-span-3 flex flex-col bg-gray-900 p-4 rounded-xl">
    <div id="chat-messages" class="flex-1 overflow-y-auto mb-2"></div>
    <div class="flex gap-2">
      <input id="chat-input" type="text" class="flex-1 bg-gray-800 p-2 rounded text-white" placeholder="Type a message..." />
      <button id="chat-send" class="bg-green-600 px-4 py-2 rounded">Send</button>
    </div>
  </div>
</div>
</section>`,xe=`<section>
  <h1 class="text-2xl font-bold">CONTACT US!</h1>
</section>`,we=`
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Statistics Dashboard</title>
    <style>
        #stats-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            background: linear-gradient(180deg, #141f3a, #1a2a6c, #274690);
        }

        #stats-container .container {
            width: 100%;
            max-width: 1200px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            margin: 20px;
        }
        
        #stats-container header {
            background: #2c3e50;
            color: white;
            padding: 25px;
            text-align: center;
        }
        
        #stats-container h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        #stats-container .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        #stats-container .content {
            padding: 35px;
        }
        
        #stats-container .user-form {
            display: flex;
            margin-bottom: 30px;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        #stats-container input {
            flex: 1;
            min-width: 250px;
            padding: 15px 20px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 18px;
            transition: border-color 0.3s;
        }
        
        #stats-container input:focus {
            border-color: #3498db;
            outline: none;
        }
        
        #stats-container button {
            background: #3498db;
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
            font-weight: 600;
            transition: background 0.3s, transform 0.2s;
            min-width: 150px;
        }
        
        #stats-container button:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        
        #stats-container button:active {
            transform: translateY(0);
        }
        
        #stats-container .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }
        
        #stats-container .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        #stats-container .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        #stats-container .stat-card h3 {
            font-size: 1.4rem;
            color: #2c3e50;
            margin-bottom: 15px;
        }
        
        #stats-container .stat-value {
            font-size: 3rem;
            font-weight: bold;
            margin: 15px 0;
        }
        
        #stats-container .wins {
            color: #27ae60;
        }
        
        #stats-container .losses {
            color: #e74c3c;
        }
        
        #stats-container .ratio {
            color: #3498db;
        }
        
        #stats-container .user-info {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 5px solid #3498db;
        }
        
        #stats-container .user-info h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.8rem;
        }
        
        #stats-container .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        #stats-container .info-item {
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        #stats-container .info-label {
            font-weight: bold;
            color: #7f8c8d;
            display: block;
            margin-bottom: 5px;
            font-size: 1.1rem;
        }
        
        #stats-container .info-value {
            font-size: 1.3rem;
            color: #2c3e50;
            font-weight: 500;
        }
        
        #stats-container .chart {
            height: 250px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            gap: 40px;
            padding: 25px;
        }
        
        #stats-container .bar {
            width: 70px;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        #stats-container .bar-value {
            width: 100%;
            border-radius: 8px 8px 0 0;
            transition: height 1s ease-in-out;
            min-height: 10px;
        }
        
        #stats-container .wins-bar {
            background: #27ae60;
        }
        
        #stats-container .losses-bar {
            background: #e74c3c;
        }
        
        #stats-container .bar-label {
            margin-top: 15px;
            font-weight: bold;
            font-size: 1.1rem;
            color: #2c3e50;
        }
        
        #stats-container .error {
            background: #ffdddd;
            color: #e74c3c;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            display: none;
            border-left: 5px solid #e74c3c;
            font-size: 1.1rem;
        }
        
        #stats-container .loading {
            text-align: center;
            padding: 30px;
            display: none;
        }
        
        #stats-container .spinner {
            border: 5px solid rgba(0, 0, 0, 0.1);
            border-left: 5px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        #stats-container footer {
            text-align: center;
            padding: 25px;
            margin-top: 25px;
            background: #ecf0f1;
            color: #7f8c8d;
            width: 100%;
            font-size: 1.1rem;
        }

        /* Match history */
        .match-history-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 25px;
        }

        /* If window is small, show only 1 match per row */
        @media (max-width: 768px) {
          .match-history-grid {
            grid-template-columns: 1fr;
          }
        }

        .match-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .match-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .match-card h3 {
          margin-bottom: 10px;
          font-size: 1.3rem;
          color: #2c3e50;
        }

        .match-details div {
          font-size: 1.4rem; /* make names bigger */
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .match-details .winner {
          color: #27ae60;
          font-weight: bold;
        }

        .match-details .loser {
          color: #e74c3c;
          font-weight: bold;
        }

        .match-points {
          font-size: 1.2rem;
          color: #2c3e50;
        }

        /* Center the Match History section */
        #stats-container section {
            text-align: center;
        }
        
        /* Ensure "No matches yet" message is centered */
        #matchHistoryGrid p {
            grid-column: 1 / -1; /* span full width of grid */
            text-align: center;
            font-size: 1.2rem;
            color: #7f8c8d;
        }

        .match-date {
          color: #7f8c8d;
          font-size: 0.9rem;
          margin-bottom: 10px;
          font-style: italic;
        }
    </style>
</head>
<body>
    <div id="stats-container">
        <div class="container">
            <header>
                <h1>User Statistics Dashboard</h1>
                <p class="subtitle">View user wins, losses, and performance metrics</p>
            </header>

            <div class="content">
                <div class="error" id="errorMessage">
                    <strong>Invalid Username:</strong> Could not find the username in the database. 
                    Please insert a valid username.
                </div>
                
                <div class="user-form">
                    <input type="text" id="usernameInput" placeholder="Enter username (e.g., bot)" value="bot">
                    <button id="fetchData">Load User Data</button>
                </div>
                
                <div class="loading" id="loading">
                    <div class="spinner"></div>
                    <p>Fetching user data...</p>
                </div>
                
                <div class="user-info" id="userInfo">
                    <h2>User Information</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Username:</span>
                            <span id="infoUsername" class="info-value">-</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email:</span>
                            <span id="infoEmail" class="info-value">-</span>
                        </div>
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Wins</h3>
                        <div class="stat-value wins" id="winsCount">0</div>
                        <p>Total victories</p>
                    </div>
                    <div class="stat-card">
                        <h3>Losses</h3>
                        <div class="stat-value losses" id="lossesCount">0</div>
                        <p>Total defeats</p>
                    </div>
                    <div class="stat-card">
                        <h3>Win Ratio</h3>
                        <div class="stat-value ratio" id="winRatio">0%</div>
                        <p>Wins to total games</p>
                    </div>
                </div>
            </div>
            
            <div>
                <section>
                  <h2 class="text-xl font-bold">Match History</h2>
                  <div id="matchHistoryGrid" class="match-history-grid"></div>
                </section>
            </div>
            
            <footer>
                <p>User Statistics Dashboard | Data from SQLite Database</p>
            </footer>
        </div>
    </div>

    <!-- <script>
        console.log("Stats Script loaded");
        document.addEventListener('DOMContentLoaded', function() {
            const fetchButton = document.getElementById('fetchData');
            console.log("Fetch button element:", fetchButton);
            const usernameInput = document.getElementById('usernameInput');
            const errorMessage = document.getElementById('errorMessage');
            const loadingElement = document.getElementById('loading');
            
            // Elements to update
            const infoUsername = document.getElementById('infoUsername');
            const infoEmail = document.getElementById('infoEmail');
            const winsCount = document.getElementById('winsCount');
            const lossesCount = document.getElementById('lossesCount');
            const winRatio = document.getElementById('winRatio');
            const winsBar = document.getElementById('winsBar');
            const lossesBar = document.getElementById('lossesBar');
            
            // Show error initially since server is not running
            errorMessage.style.display = 'block';
            
            // Fetch user data from the server
            async function fetchUserData(username) {
                loadingElement.style.display = 'block';
                errorMessage.style.display = 'none';
                
                try {
                    // Try to fetch from the database
                    const response = await fetch(\`/stats/api/user-stats?username=\${username}\`);
                    const response_match_history = await fetch(\`/stats/api/matches/\${username}\`);
                    
                    // Check if the response is OK (status 200-299)
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || \`Server returned \${response.status}\`);
                    }
                    if (!response_match_history.ok) {
                        const errorData = await response_match_history.json();
                        throw new Error(errorData.error || \`Server returned \${response.status}\`);
                    }
                    
                    const userData = await response.json();
                    console.log('API Response:', userData); // Debug log

                    const user_match_history = await response_match_history.json();
                    console.log('API Response:', user_match_history); // Debug log
                    
                    // Update the UI with the user data
                    updateUserData(userData, user_match_history);
                }
                catch (error){
                    // If the API call fails, show a message with instructions
                    errorMessage.textContent = \`Error: \${error.message}\`;
                    errorMessage.style.display = 'block';
                    
                    console.error('Fetch error:', error);
                }
                finally {
                    loadingElement.style.display = 'none';
                }
            }
            
            // Update the UI with user data
            function updateUserData(userData, user_match_history) {
                infoUsername.textContent = userData.username;
                infoEmail.textContent = userData.email;
                let wins = 0;
                let losses = 0;

                user_match_history.matches.forEach(match => {
                    if (match.winner === userData.username) {
                        wins++;
                    } else if (match.loser === userData.username){
                        losses++;
                    }
                });
                winsCount.textContent = wins;
                lossesCount.textContent = losses;

                // Calculate win ratio
                const totalGames = wins + losses;
                const ratio = totalGames > 0 ? (wins / totalGames * 100).toFixed(1) : 0;
                winRatio.textContent = \`\${ratio}%\`;

                // Render match history rows
                renderMatchHistory(user_match_history);
            }

            function renderMatchHistory(user_match_history) {
              const grid = document.getElementById("matchHistoryGrid");
              grid.innerHTML = ""; // clear old cards

              if (!user_match_history.matches || user_match_history.matches.length === 0) {
                grid.innerHTML = \`<p class="text-center p-2">No matches yet</p>\`;
                return;
              }
          
              user_match_history.matches.forEach(match => {
                const card = document.createElement("div");
                card.classList.add("match-card");
            
                card.innerHTML = \`
                  <h3>Match #\${match.id}</h3>
                  <div class="match-details">
                    <span class="winner">\${match.winner} <span class="match-points">(\${match.winner_points} points)</span></span>
                    <span class="vs">VS</span>
                    <span class="loser">\${match.loser} <span class="match-points">(\${match.loser_points} points)</span></span>
                  </div>
                \`;
              
                grid.appendChild(card);
              });
            }

            
            // Event listener for the fetch button
            fetchButton.addEventListener('click', function() {
                const username = usernameInput.value.trim();
                if (username) {
                    fetchUserData(username);
                    console.log("Button clicked");
                } else {
                    errorMessage.textContent = 'Please enter a username';
                    errorMessage.style.display = 'block';
                }
            });
            
            // Load test data by default
            //fetchUserData('bot');
        });
    <\/script> -->
</body>
</html>`,ke=`<section>
  <h1 class="text-2xl font-bold">USER SETTINGS</h1>
</section>`,Ee=`<div id="login-modal" class="fixed inset-0 flex flex-col items-end justify-start mt-22 mr-4 h-screen hidden">
  <div class="w-full max-w-md bg-[#0E172B] border-1 border-[#F5CB5C] rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-[#F5CB5C] mb-4">Login</h2>
    
    <!-- Google OAuth Button - SIMPLIFIED -->
    <button id="google-login-btn" 
            class="w-full bg-white text-gray-800 py-3 px-4 rounded-md font-semibold mb-4 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors border border-gray-300">
      <!-- Simple Google "G" logo using text -->
      <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-300">
        <span class="text-blue-500 font-bold text-xs">G</span>
      </div>
      Continue with Google
    </button>

    <!-- Divider -->
    <div class="flex items-center my-4">
      <div class="flex-1 border-t border-gray-600"></div>
      <span class="px-3 text-gray-400 text-sm">OR</span>
      <div class="flex-1 border-t border-gray-600"></div>
    </div>

    <form id="login-form" class="flex flex-col">
      <input id="login-email" type="email" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-white transition ease-in-out duration-150" placeholder="Email address" required>
      <input id="login-password" type="password" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-white transition ease-in-out duration-150" placeholder="Password" required>
      <div class="flex items-center justify-between flex-wrap">
        <label for="remember-me" class="text-sm text-white flex items-center gap-2">
          <input
            type="checkbox"
            id="remember-me"
            class="appearance-none w-4 h-4 border border-[#F5CB5C] rounded-sm
                   checked:bg-[#F5CB5C] checked:border-[#F5CB5C]
                   checked:after:content-['✓'] checked:after:block checked:after:text-black
                   checked:after:text-xs checked:after:leading-4 checked:after:text-center
                   flex items-center justify-center cursor-pointer"/>
            Remember me
        </label>
        <button type="button" id="forgotPass" class="text-sm text-[#F5CB5C] hover:underline mb-0.5 cursor-pointer">Forgot password?</button>
        <p class="text-white mt-4 w-full"> Don't have an account? 
          <button id="open-signup" type="button" class="text-sm text-[#F5CB5C] hover:underline cursor-pointer">
            Signup
          </button>
        </p>
      </div>
      <button id="login-submit" type="submit" disabled class="bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] text-black font-bold py-2 px-4 rounded-md mt-4 transition ease-in-out duration-150 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:opacity-80">Login</button>
      <p id="login-message" class="text-sm text-red-500 mt-2 hidden"></p>
    </form>
  </div>
</div>`,Ce=`<!-- From Uiverse.io by themrsami --> 
<div id="signup-modal" class="fixed inset-0 flex flex-col items-end justify-start mt-22 mr-4 h-screen hidden">
  <div class="w-full max-w-md bg-[#0E172B] border-1 border-[#F5CB5C] rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-[#F5CB5C] mb-4">Sign Up</h2>
    <form id="signup-form" class="flex flex-col">
      <input id="signup-username" placeholder="Username" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-white transition ease-in-out duration-150" type="text">
      <input id="signup-email" placeholder="Email" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-white transition ease-in-out duration-150" type="email">
      <input id="signup-comfirmEmail" placeholder="Confirm Email" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 mt-4 focus:outline-none focus:ring-1 focus:ring-white transition ease-in-out duration-150" type="email">
      <input id="signup-password" placeholder="Password" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 mt-4 focus:outline-none focus:ring-1 focus:ring-white transition ease-in-out duration-150" type="password">
      <input id="signup-confirmPassword" placeholder="Confirm Password" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 mt-4 focus:outline-none focus:ring-1 focus:ring-white transition ease-in-out duration-150" type="password">
      <button class="bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] text-black font-bold py-2 px-4 rounded-md mt-4 hover:opacity-80 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" type="submit">Sign Up</button>
    </form>
  </div>
</div>
`,Se=`<!-- Sidebar -->
<aside
  id="sidebar"
  class="fixed flex-col justify-between top-18 left-0 w-48 h-screen bg-[#0E172B] gray-100 shadow-lg transform -translate-x-full transition-transform duration-300 z-40"
>
  <!-- Sidebar content -->
  <div class="p-4 flex-1">
    <h2 class="text-lg text-[#F5CB5C] font-bold mb-4">Menu</h2>
    <ul class="space-y-2 text-[#F5CB5C]">
      <li><a href="#home" class="hover:underline">Home</a></li>
      <li><a href="#chat" class="hover:underline">Chat</a></li>
      <li><a href="#stats" class="hover:underline">Player Stats</a></li>
      <li><a href="#friends" class="hover:underline">Friends</a></li>
      <li><a href="#about" class="hover:underline">About this Project</a></li>
      <li><a href="#contact" class="hover:underline">Contact us!</a></li>
    </ul>
  </div>
</aside>
`,Le=`<div id="controlPanel"
  class="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                               bg-[#0E172B] p-6 rounded-lg shadow-lg mt-8 border-1 border-[#F5CB5C]"
  style="width: 800px; height: 600px; aspect-ratio: 4 / 3;">

  <!-- Close Button -->
  <button id="closeSettings"
    class="absolute top-2 right-2 rounded-full group w-12 h-12" type="button">
    <p
      class="font-lucky text-4xl h-full w-full flex justify-center items-center text-red-500 duration-500 itens-center relative z-10 hover:text-red-900">
      x
    </p>
  </button> 

  <h2
    class="text-2xl font-lucky font-semibold mb-4 text-center text-[#F5CB5C]">Game
    Settings</h2>

  <!-- Flex layout for horizontal arrangement -->
  <div class="flex h-full gap-8">
    <!-- Column 1 -->
    <div class="flex-1 space-y-4 overflow-y-auto pr-4">
      <!-- Difficulty -->
      <div class="flex flex-col space-y-2 ">
        <label class="block font-medium mb-3 text-[#F5CB5C]">Difficulty:</label>
        <label class="relative flex items-start cursor-pointer">
          <input
            checked
            class="sr-only peer"
            name="difficulty"
            type="radio"
            value="0.05" />
          <div
            class="w-5 h-5 bg-transparent border-2 border-red-500 rounded-full peer-checked:bg-red-500 peer-checked:border-red-500 
            peer-hover:shadow-lg peer-hover:shadow-red-500/50 peer-checked:shadow-lg peer-checked:shadow-red-500/50 transition duration-300 ease-in-out"></div>
          <span class="ml-2 text-white">Hard</span>
        </label>
        <label class="relative flex items-center cursor-pointer">
          <input class="sr-only peer" name="difficulty" type="radio"
            value="0.1" />
          <div
            class="w-5 h-5 bg-transparent border-2 border-yellow-500 rounded-full peer-checked:bg-yellow-500 peer-checked:border-yellow-500 peer-hover:shadow-lg peer-hover:shadow-yellow-500/50 peer-checked:shadow-lg peer-checked:shadow-yellow-500/50 transition duration-300 ease-in-out"></div>
          <span class="ml-2 text-white">Normal</span>
        </label>
        <label class="relative flex items-center cursor-pointer">
          <input class="sr-only peer" name="difficulty" type="radio"
            value="0.3" />
          <div
            class="w-5 h-5 bg-transparent border-2 border-green-500 rounded-full peer-checked:bg-green-500 peer-checked:border-green-500 peer-hover:shadow-lg peer-hover:shadow-green-500/50 peer-checked:shadow-lg peer-checked:shadow-green-500/50 transition duration-300 ease-in-out"></div>
          <span class="ml-2 text-white">Easy</span>
        </label>
      </div>

      <!-- Control method -->
      <div class="flex-1 space-y-2 overflow-y-auto pr-4">
        <label class="block font-medium mb-3 text-[#F5CB5C]">Control Method
          (Single Player):</label>
        <label class="relative flex items-center cursor-pointer">
          <input class="sr-only peer" name="mouse" type="radio"
            value="true" />
          <div
            class="w-5 h-5 bg-transparent border-2 border-blue-500 rounded-full peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-hover:shadow-lg peer-hover:shadow-blue-500/50 peer-checked:shadow-lg peer-checked:shadow-blue-500/50 transition duration-300 ease-in-out"></div>
          <span class="ml-2 text-white">Mouse</span>
        </label>
        <label class="relative flex items-center cursor-pointer">
          <input class="sr-only peer" name="mouse" type="radio"
            value="false" />
          <div
            class="w-5 h-5 bg-transparent border-2 border-blue-500 rounded-full peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-hover:shadow-lg peer-hover:shadow-green-blue/50 peer-checked:shadow-lg peer-checked:shadow-blue-500/50 transition duration-300 ease-in-out"></div>
          <span class="ml-2 text-white">Keyboard</span>
        </label>
      </div>

      <!-- Modes -->
      <div class="flex-1 space-y-2 overflow-y-auto pr-4">
        <label class="block font-medium mb-3 text-[#F5CB5C]">Mode:</label>
        <label class="relative flex items-center cursor-pointer">
          <input class="sr-only peer" name="multiplayer" type="radio"
            value="true" />
          <div
            class="w-5 h-5 bg-transparent border-2 border-blue-500 rounded-full peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-hover:shadow-lg peer-hover:shadow-blue-500/50 peer-checked:shadow-lg peer-checked:shadow-blue-500/50 transition duration-300 ease-in-out"></div>
          <span class="ml-2 text-white">Multiplayer</span>
        </label>
        <label class="relative flex items-center cursor-pointer">
          <input class="sr-only peer" name="multiplayer" type="radio"
            value="false" />
          <div
            class="w-5 h-5 bg-transparent border-2 border-blue-500 rounded-full peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-hover:shadow-lg peer-hover:shadow-green-blue/50 peer-checked:shadow-lg peer-checked:shadow-blue-500/50 transition duration-300 ease-in-out"></div>
          <span class="ml-2 text-white">Single Player</span>
        </label>
      </div>

      <!-- Reset Speed -->
      <div">
        <label class="relative flex items-center cursor-pointer">
          <input class="sr-only peer" id="resetSpeed" type="checkbox"/>
          <div
            class="w-5 h-5 bg-transparent border-2 border-blue-500 peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-hover:shadow-lg peer-hover:shadow-green-blue/50 peer-checked:shadow-lg peer-checked:shadow-blue-500/50 transition duration-300 ease-in-out"></div>
          <span class="ml-2 text-white">Reset Ball Speed After Score</span>
        </label>

      </div>

    <!-- Column 2 -->
    <div class="flex-1 space-y-4 overflow-y-auto pr-4">
      <!-- Paddle Speed -->
      <div>
        <label class="block font-medium mb-1 text-[#F5CB5C]">Paddle Speed: <span
            id="paddleSpeedValue"></span></label>
        <input type="range" id="paddleSpeed" min="1" max="10">
      </div>

      <!-- Ball Speed -->
      <div>
        <label class="block font-medium mb-1 text-[#F5CB5C]">Inicial Ball Speed:
          <span id="ballSpeedValue"></span></label>
        <input type="range" id="ballSpeed" min="1" max="10">
      </div>

      <!-- Score Limit -->
      <div>
        <label class="block font-medium mb-1 text-[#F5CB5C]">Score
          Limit:</label>
        <input type="number" id="scoreLimit" min="1"
          class="border border-[#F5CB5C] text-white rounded p-1 w-full">
      </div>

      <!-- Background Color -->
      <div>
        <label class="block font-medium mb-1 text-[#F5CB5C]">Background
          Color:</label>
        <input type="color" id="bgColor">
      </div>

      <!-- Items Color -->
      <div>
        <label class="block font-medium mb-1 text-[#F5CB5C]">Items
          Color:</label>
        <input type="color" id="itemsColor">
      </div>

      <!-- Reset to Default -->
      <div class="text-center pt-4">
        <button 
          id="resetDefaults" class="cursor-pointer transition-all 
        bg-[#00091D] text-[#F5CB5C] px-6 py-2 rounded-lg
        border-[#D39E0D] border-[1px]
          border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
          active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl active:shadow-none">
            Reset to Default
        </button>
      </div>
    </div>
  </div>
</div>
`,Be=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Friends - Your Site</title>
    <style>
        /* Friends page specific styles - won't affect your existing navigation */
        .friends-container {
            max-width: 800px;
            margin: 80px auto 20px;
            padding: 20px;
        }

        .friends-header {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }

        .friends-header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .friends-header .subtitle {
            color: #666;
            font-size: 1.1rem;
        }

        .add-friend-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border: 1px solid #e9ecef;
        }

        .add-friend-section h2 {
            margin-bottom: 15px;
            color: #333;
        }

        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }

        .friend-input {
            flex: 1;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            outline: none;
        }

        .friend-input:focus {
            border-color: #4CAF50;
        }

        .add-friend-btn {
            padding: 12px 25px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }

        .add-friend-btn:hover {
            background: #45a049;
        }

        .friends-message {
            margin-top: 10px;
            font-size: 0.9rem;
            min-height: 20px;
        }

        .friends-list-section h2 {
            margin-bottom: 20px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .friends-count {
            background: #4CAF50;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.9rem;
        }

        .filter-btn {
            padding: 8px 15px;
            background: #e9ecef;
            border: 1px solid #ddd;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }

        .filter-btn.active {
            background: #4CAF50;
            color: white;
            border-color: #4CAF50;
        }

        .friends-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .friend-item {
            display: flex;
            align-items: center;
            background: white;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
        }

        .friend-item:hover {
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }

        .friend-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #6c757d;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-weight: bold;
            font-size: 1.2rem;
            color: white;
        }

        .friend-info {
            flex: 1;
        }

        .friend-name {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }

        .friend-status {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.9rem;
            color: #666;
        }

        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }

        .status-online {
            background: #4CAF50;
            box-shadow: 0 0 5px #4CAF50;
        }

        .status-offline {
            background: #6c757d;
        }

        .status-away {
            background: #ffc107;
        }

        .friend-actions {
            display: flex;
            gap: 10px;
        }

        .friend-action-btn {
            padding: 8px 15px;
            border-radius: 5px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }

        .message-btn {
            background: #2196F3;
            color: white;
        }

        .message-btn:hover {
            background: #0b7dda;
        }

        .remove-btn {
            background: #dc3545;
            color: white;
        }

        .remove-btn:hover {
            background: #c82333;
        }

        .no-friends {
            text-align: center;
            padding: 40px;
            color: #6c757d;
            font-style: italic;
            background: white;
            border-radius: 10px;
            border: 1px solid #e9ecef;
        }

        @media (max-width: 768px) {
            .friends-container {
                margin: 60px auto 20px;
                padding: 15px;
            }
            
            .input-group {
                flex-direction: column;
            }
            
            .friend-item {
                flex-direction: column;
                text-align: center;
            }
            
            .friend-avatar {
                margin-right: 0;
                margin-bottom: 10px;
            }
            
            .friend-actions {
                margin-top: 10px;
                justify-content: center;
            }
        }

        #friendsErrorMessage {
          color: #d32f2f;
          background-color: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 4px;
          padding: 12px;
          margin: 10px 0;
          font-size: 14px;
          display: none;
        }

        .friend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
        }

        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .status-indicator.online {
          background-color: #4CAF50;
          box-shadow: 0 0 5px #4CAF50;
        }

        .status-indicator.offline {
          background-color: #f44336;
        }

        .status-indicator.away {
          background-color: #ff9800;
        }

        .friend-name {
          font-weight: bold;
        }

        .friend-status {
          color: #666;
          font-size: 0.9em;
        }

        .no-friends-message {
          color: #666;
          font-style: italic;
          text-align: center;
          padding: 20px;
          list-style: none;
        }
    </style>
</head>
<body>    
    <main class="friends-container">
        <header class="friends-header">
            <h1>Friends List</h1>
            <p class="subtitle">Connect with other players and see who's online</p>
        </header>

        <section class="add-friend-section">
            <h2>Add a Friend</h2>
            <div class="input-group">
                <input type="text" class="friend-input" id="friendInput" placeholder="Enter username">
                <button class="add-friend-btn" id="addFriendBtn">Add Friend</button>
            </div>
            <p class="friends-message" id="friendsMsg"></p>
        </section>

        <section class="friends-list-section">
            <h2>
                Your Friends
                <span class="friends-count" id="friendsCount">0</span>
            </h2>
            
            <div class="friends-list" id="friendsList">
                <div class="no-friends">No friends added yet. Start by adding some friends!</div>
            </div>
        </section>
    </main>

    <script type="module">
        // Friends management functionality
        class FriendsManager {
            constructor() {
                this.friends = [];
                this.initializeElements();
                this.setupEventListeners();
            }

            initializeElements() {
                this.friendInput = document.getElementById('friendInput');
                this.addFriendBtn = document.getElementById('addFriendBtn');
                this.friendsMsg = document.getElementById('friendsMsg');
                this.friendsList = document.getElementById('friendsList');
                this.friendsCount = document.getElementById('friendsCount');

                if (!this.friendInput || !this.addFriendBtn || !this.friendsList) {
                    console.error("Friends page elements not found");
                    return;
                }
            }

            setupEventListeners() {
                this.addFriendBtn.addEventListener('click', () => this.addFriend());
                
                this.friendInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addFriend();
                });
            }

            async initFriendsPage() {
                // Get current user from your existing auth system
                const currentUser = await this.getCurrentUser();
                if (currentUser) {
                    await this.loadFriends(currentUser);
                } else {
                    this.showMessage("Please log in to manage your friends", "error");
                    this.friendsList.innerHTML = '<div class="no-friends">Please log in to see your friends.</div>';
                }
            }

            async getCurrentUser() {
                // Use your existing authentication system
                // This is a placeholder - replace with your actual auth check
                try {
                    // Example: Check if user is logged in via your existing system
                    const response = await fetch('/auth/check', { 
                        credentials: 'include' 
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        return userData.username;
                    }
                } catch (error) {
                    console.error('Error checking auth status:', error);
                }
                return null;
            }

            async loadFriends(username) {
                try {
                    const res = await fetch(\`/stats/api/friends/\${username}\`);
                    const data = await res.json();

                    if (!res.ok) throw new Error(data.error || "Failed to fetch friends");

                    this.friends = await Promise.all(
                        data.friends.map(async (friendUsername, index) => {
                            const status = await this.getFriendStatus(friendUsername);
                            return {
                                id: index + 1,
                                name: friendUsername,
                                status: status,
                                avatar: friendUsername.substring(0, 2).toUpperCase()
                            };
                        })
                    );
                    
                    this.renderFriendsList();
                } catch (err) {
                    console.error('Error loading friends:', err);
                    this.showMessage("Error loading friends", "error");
                }
            }

            async getFriendStatus(username) {
                try {
                    // Try to get actual status from your backend
                    const res = await fetch(\`/stats/api/user-status/\${username}\`);
                    if (res.ok) {
                        const data = await res.json();
                        return data.status || 'offline';
                    }
                } catch (err) {
                    console.error('Error fetching friend status:', err);
                }
                
                // Fallback to mock status
                const statuses = ['online', 'offline', 'away'];
                return statuses[Math.floor(Math.random() * statuses.length)];
            }

            renderFriendsList() {       
                this.friendsCount.textContent = filteredFriends.length.toString();
                
                if (filteredFriends.length === 0) {
                    this.friendsList.innerHTML = '<div class="no-friends">No friends match the selected filter.</div>';
                    return;
                }
                
                this.friendsList.innerHTML = filteredFriends.map(friend => \`
                    <div class="friend-item" data-id="\${friend.id}">
                        <div class="friend-avatar">\${friend.avatar}</div>
                        <div class="friend-info">
                            <div class="friend-name">\${friend.name}</div>
                            <div class="friend-status">
                                <div class="status-indicator status-\${friend.status}"></div>
                                <span>\${friend.status.charAt(0).toUpperCase() + friend.status.slice(1)}</span>
                            </div>
                        </div>
                        <div class="friend-actions">
                            <button class="friend-action-btn message-btn" data-id="\${friend.id}">Message</button>
                            <button class="friend-action-btn remove-btn" data-id="\${friend.id}">Remove</button>
                        </div>
                    </div>
                \`).join('');
                
                // Add event listeners to dynamically created buttons
                this.friendsList.querySelectorAll('.message-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = parseInt(e.target.getAttribute('data-id'));
                        this.messageFriend(id);
                    });
                });
                
                this.friendsList.querySelectorAll('.remove-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = parseInt(e.target.getAttribute('data-id'));
                        this.removeFriend(id);
                    });
                });
            }

            async addFriend() {
                const currentUser = await this.getCurrentUser();
                if (!currentUser) {
                    this.showMessage("You must be logged in to add friends.", "error");
                    return;
                }

                const friendUsername = this.friendInput.value.trim();
                if (!friendUsername) {
                    this.showMessage("Please enter a username", "error");
                    return;
                }

                if (this.friends.some(friend => friend.name.toLowerCase() === friendUsername.toLowerCase())) {
                    this.showMessage("This user is already in your friends list", "error");
                    return;
                }

                try {
                    const res = await fetch(\`/stats/api/friends/\${currentUser}\`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ friendUsername }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        this.showMessage(data.error || "Failed to add friend", "error");
                        return;
                    }

                    this.friendInput.value = '';
                    this.showMessage(\`Successfully added \${friendUsername} to your friends list\`, "success");
                    await this.loadFriends(currentUser);
                } catch (err) {
                    console.error('Error adding friend:', err);
                    this.showMessage("Error adding friend", "error");
                }
            }

            async removeFriend(id) {
                const friend = this.friends.find(f => f.id === id);
                if (!friend) return;

                if (!confirm(\`Are you sure you want to remove \${friend.name} from your friends?\`)) {
                    return;
                }

                const currentUser = await this.getCurrentUser();
                if (!currentUser) {
                    this.showMessage("You must be logged in to remove friends.", "error");
                    return;
                }

                try {
                    const res = await fetch(\`/stats/api/friends/\${currentUser}/\${friend.name}\`, {
                        method: "DELETE",
                    });

                    if (!res.ok) {
                        throw new Error("Failed to remove friend");
                    }

                    this.friends = this.friends.filter(f => f.id !== id);
                    this.renderFriendsList();
                    this.showMessage("Friend removed successfully", "success");
                } catch (err) {
                    console.error('Error removing friend:', err);
                    this.showMessage("Error removing friend", "error");
                }
            }

            messageFriend(id) {
                const friend = this.friends.find(f => f.id === id);
                if (friend) {
                    // Use your existing messaging system
                    alert(\`Opening chat with \${friend.name}...\`);
                }
            }

            showMessage(message, type) {
                this.friendsMsg.textContent = message;
                this.friendsMsg.style.color = type === 'success' ? '#4CAF50' : '#dc3545';
                
                setTimeout(() => {
                    this.friendsMsg.textContent = '';
                }, 3000);
            }
        }

        // Initialize friends page
        document.addEventListener('DOMContentLoaded', () => {
            const friendsManager = new FriendsManager();
            friendsManager.initFriendsPage();
        });
    <\/script>
</body>
</html>`,Ie=`<!-- <button id="open-login" class="px-4 py- border border-amber-400 rounded text-white hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
    Log in
</button>
<button id="open-signup" class="mr-3 px-4 py-2 bg-amber-400 rounded hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
    Sign up
</button> -->
<!-- From Uiverse.io by carlosepcc --> 
<!-- <button id="open-login" class="cursor-pointer transition-all bg-[#F5CB5C] text-[#242423] px-6 py-2 rounded-lg
border-[#D39E0D]
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
  Login
</button> -->

<!-- From Uiverse.io by carlosepcc --> 
<button id="open-login" class="cursor-pointer transition-all 
bg-[#00091D] text-[#F5CB5C] px-6 py-2 rounded-lg
border-[#D39E0D] border-[1px]
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl active:shadow-none">
  Login
</button>`,Fe=`<!-- components/navLoggedin.html (tooltips use peer-hover so they show only on the specific button) -->
<div id="user-wrapper" class="relative inline-flex items-center gap-4 group">
  <!-- Username -->
  <span id="user-greeting" class="text-[#F5CB5C] font-bold transition-opacity duration-200 group-hover:opacity-0">
    User
  </span>

  <!-- Navbar avatar (fades out while modal visible) -->
  <div id="user-avatar-wrap"
       class="w-10 h-10 rounded-full border-2 border-[#F5CB5C] bg-gray-200 flex items-center justify-center overflow-hidden
              transition-opacity duration-200 group-hover:opacity-0">
    <img id="user-avatar" alt="Profile" class="w-full h-full object-cover hidden" />
    <svg id="default-avatar" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  </div>

  <!-- Modal: anchored to right of wrapper. Modal appears on hover of wrapper (group-hover) -->
  <div
    id="user-modal"
    class="absolute top-1/2 right-0 -translate-y-1/2 transform translate-x-2 opacity-0
           transition-transform transition-opacity duration-200 ease-out pointer-events-none
           group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto"
    aria-hidden="true"
  >
    <nav
      class="flex items-center justify-between rounded-full bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95
             px-3 py-2 gap-3 shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-yellow-300/20 backdrop-blur-md
             min-w-[200px] max-w-[320px]"
    >
      <!-- Left: buttons -->
      <div class="flex items-center gap-2">
        <!-- Logout -->
        <div class="relative">
          <!-- peer is on the button; tooltip uses peer-hover so it's tied to this button only -->
          <button id="logout-btn" class="peer p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors duration-150 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7"></path>
              <path d="M7 4v16"></path>
            </svg>
          </button>

          <!-- tooltip: invisible by default, visible only on this button hover (peer-hover) -->
          <div class="absolute top-full mt-2 left-1/2 -translate-x-1/2 invisible opacity-0 pointer-events-none
                      transition-opacity duration-150 peer-hover:visible peer-hover:opacity-100 peer-hover:pointer-events-auto z-50">
            <div class="relative bg-black/85 text-red-500 text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-yellow-300/10 shadow-[0_0_10px_rgba(0,0,0,0.4)]">
              <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4
                          border-l-transparent border-r-transparent border-b-black"></div>
              Logout
            </div>
          </div>
        </div>

        <!-- Analytics -->
        <div class="relative">
          <button class="peer p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors duration-150 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-100/80 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 21H4.6c-1.1 0-2-.9-2-2V3"></path>
              <path d="M19 8l-7 6-4-4-4 4"></path>
            </svg>
          </button>

          <div class="absolute top-full mt-2 left-1/2 -translate-x-1/2 invisible opacity-0 pointer-events-none
                      transition-opacity duration-150 peer-hover:visible peer-hover:opacity-100 peer-hover:pointer-events-auto z-50">
            <div class="relative bg-black/85 text-yellow-300 text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-yellow-300/10 shadow-[0_0_10px_rgba(0,0,0,0.4)]">
              <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4
                          border-l-transparent border-r-transparent border-b-black"></div>
              Analytics
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="relative">
          <button class="peer p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors duration-150 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-100/80 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>

          <div class="absolute top-full mt-2 left-1/2 -translate-x-1/2 invisible opacity-0 pointer-events-none
                      transition-opacity duration-150 peer-hover:visible peer-hover:opacity-100 peer-hover:pointer-events-auto z-50">
            <div class="relative bg-black/85 text-yellow-300 text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-yellow-300/10 shadow-[0_0_10px_rgba(0,0,0,0.4)]">
              <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4
                          border-l-transparent border-r-transparent border-b-black"></div>
              Notifications
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div class="relative">
          <button class="peer p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors duration-150 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-100/80 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </button>

          <div class="absolute top-full mt-2 left-1/2 -translate-x-1/2 invisible opacity-0 pointer-events-none
                      transition-opacity duration-150 peer-hover:visible peer-hover:opacity-100 peer-hover:pointer-events-auto z-50">
            <div class="relative bg-black/85 text-yellow-300 text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-yellow-300/10 shadow-[0_0_10px_rgba(0,0,0,0.4)]">
              <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4
                          border-l-transparent border-r-transparent border-b-black"></div>
              Messages
            </div>
          </div>
        </div>

      <!-- Settings -->
        <div class="relative">
          <button id="settings-btn" class="peer p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors duration-150 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-100/80 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>

          <div class="absolute top-full mt-2 left-1/2 -translate-x-1/2 invisible opacity-0 pointer-events-none
                      transition-opacity duration-150 peer-hover:visible peer-hover:opacity-100 peer-hover:pointer-events-auto z-50">
            <div class="relative bg-black/85 text-yellow-300 text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-yellow-300/10 shadow-[0_0_10px_rgba(0,0,0,0.4)]">
              <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4
                          border-l-transparent border-r-transparent border-b-black"></div>
              Settings
            </div>
          </div>
        </div>

        <!-- Settings modal (hidden by default) -->
        <div id="settings-modal" class="fixed inset-0 flex flex-col items-end justify-start mt-22 mr-4 h-screen hidden">
          <div class="w-full max-w-md bg-[#0E172B] border-1 border-[#F5CB5C] rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-[#F5CB5C] mb-4">Update user information</h2>
          
            <form id="settings-form" class="flex flex-col">
              <input id="settings-username" placeholder="Username" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 mb-3" type="text">
              <input id="settings-email" placeholder="New Email" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 mb-3" type="email">
              <input id="settings-password" placeholder="New Password" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 mb-3" type="password">

              <!-- ✅ Add the profile picture upload here -->
              <div class="mt-4">
                <label for="avatar-upload" class="block text-sm font-medium text-gray-300 mb-1">
                  Change profile picture
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  class="block w-full text-sm text-gray-400
                         file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                         file:text-sm file:font-semibold file:bg-yellow-600 file:text-white
                         hover:file:bg-yellow-500"
                />
              </div>
              <div class="flex gap-2 justify-end mt-2">
                <button type="button" id="settings-close" class="px-4 py-2 rounded bg-gray-700 text-white">Close</button>
                <button type="submit" class="px-4 py-2 rounded bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] text-black">Save</button>
              </div>
            </form>
          </div>
        </div>

      <!-- Right: avatar inside modal -->
      <div class="ml-3 w-10 h-10 rounded-full border-2 border-[#F5CB5C] bg-gray-200 flex items-center justify-center overflow-hidden">
        <img id="user-avatar-modal" alt="Profile" class="w-full h-full object-cover hidden" />
        <svg id="default-avatar-modal" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </div>
    </nav>
  </div>
</div>





`;function B(){try{const e=localStorage.getItem("userSession");if(!e)return null;const n=JSON.parse(e);return!n||typeof n!="object"||!n.token?null:n}catch(e){return console.error("Error loading session:",e),null}}function V(e,n){const o={token:e,user:{id:n.id,username:n.username,email:n.email,avatarUrl:n.avatar_url||n.avatarUrl||"/default-avatar.png"}};localStorage.setItem("userSession",JSON.stringify(o))}function G(){localStorage.removeItem("userSession")}function ae(){return B()?.user||null}function Me(){try{return B()?.token||null}catch{return null}}async function Ue(){try{const e=B();if(!e?.token)return console.log("No stored session found"),U({isLoggedIn:!1,username:void 0,avatarUrl:void 0}),!1;console.log("Found stored token, verifying...");const o=await fetch("https://10.19.250.99:3000/auth/me",{headers:{Authorization:`Bearer ${e.token}`}});if(!o.ok)return console.warn("Stored session invalid, clearing..."),G(),U({isLoggedIn:!1,username:void 0,avatarUrl:void 0}),!1;const t=await o.json();return console.log("User data received:",t),V(e.token,t),U({isLoggedIn:!0,username:t.username,avatarUrl:t.avatar_url||t.avatarUrl||"/default-avatar.png"}),console.log("✅ Session restored:",t.username),!0}catch(e){return console.error("Error verifying stored session:",e),G(),U({isLoggedIn:!1,username:void 0,avatarUrl:void 0}),!1}}const ie=`<div class="flex flex-row gap-2 justify-center items-center">
    <div class="w-2 h-2 rounded-full bg-black animate-bounce"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.3s]"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.5s]"></div>
</div>`,Ae="undefined/auth/login";function de(){console.log("🔄 setupLoginForm() called");const e=document.getElementById("login-modal"),n=document.getElementById("open-login"),o=document.getElementById("login-form"),t=document.getElementById("login-email"),s=document.getElementById("login-password"),r=document.getElementById("login-submit"),m=document.getElementById("login-message"),g=document.getElementById("open-signup"),i=document.getElementById("signup-modal"),c=document.getElementById("google-login-btn");if(console.log("🔍 All elements found:",{loginModal:!!e,openBtnLogin:!!n,loginForm:!!o,openBtnSignup:!!g,signupModal:!!i,googleLoginBtn:!!c}),!e||!n||!o||!t||!s||!r){console.warn("Login modal setup failed: missing elements.");return}function l(){const a=t.value.trim()&&s.value.trim();r.disabled=!a}if(t.addEventListener("input",l),s.addEventListener("input",l),l(),n.addEventListener("click",()=>{console.log("✅ Login button clicked - opening login modal"),e.classList.remove("hidden")}),e.addEventListener("click",a=>{a.target===e&&(console.log("✅ Login modal background clicked - closing"),e.classList.add("hidden"))}),c&&c.addEventListener("click",()=>{console.log("✅ Google login clicked"),window.location.href="undefined/oauth/google"}),g)console.log("✅ Found open-signup button, adding event listener"),g.addEventListener("click",a=>{a.preventDefault(),console.log("✅ Signup button clicked in login modal"),console.log("   - Closing login modal"),e.classList.add("hidden"),i?(console.log("   - Opening signup modal"),i.classList.remove("hidden")):console.error("❌ Signup modal not found!")});else{console.error("❌ open-signup button not found in DOM!");const a=e.querySelectorAll("button");console.log("🔍 Buttons in login modal:",a.length),a.forEach(u=>{console.log("   - Button:",{id:u.id,text:u.textContent,type:u.type})})}o.addEventListener("submit",async a=>{if(a.preventDefault(),!t.value||!s.value)return;m&&(m.textContent="");const u=r.innerHTML;r.innerHTML=ie,r.disabled=!0;try{const b=await fetch(Ae,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t.value,password:s.value})});if(!b.ok){m&&(m.textContent="Invalid email or password"),r.innerHTML=u,r.disabled=!1;return}const f=await b.json();f.token&&f.user&&(V(f.token,{username:f.user.username,avatarUrl:"/default-avatar.png"}),U({isLoggedIn:!0,username:f.user.username,avatarUrl:"/default-avatar.png"})),await fetch("/stats/api/friends/online",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:f.user.username})}),e.classList.add("hidden"),t.value="",s.value="",l()}catch(b){console.error("Login error:",b),m&&(m.textContent="An error occurred. Please try again.")}finally{r.innerHTML=u,l()}}),console.log("✅ Login form setup complete")}const Pe="undefined/auth/register";function le(){const e=document.getElementById("signup-modal"),n=document.getElementById("open-login"),o=document.getElementById("signup-form"),t=document.getElementById("signup-username"),s=document.getElementById("signup-email"),r=document.getElementById("signup-comfirmEmail"),m=document.getElementById("signup-password"),g=document.getElementById("signup-confirmPassword"),i=o?.querySelector('button[type="submit"]');if(!e||!o||!t||!s||!r||!m||!g||!i){console.warn("Signup modal setup failed: missing elements.");return}function c(u){return u.length>=8&&/[A-Z]/.test(u)&&/[0-9]/.test(u)}function l(u,b,f,v){b?(u.classList.remove("border-red-500","focus:ring-red-500"),u.classList.add("border-green-500","focus:ring-green-500")):(u.classList.remove("border-green-500","focus:ring-green-500"),u.classList.add("border-red-500","focus:ring-red-500"))}function a(){let u=!0;t.value.trim()?l(t,!0):(u=!1,l(t,!1)),s.value.trim()?l(s,!0):(u=!1,l(s,!1)),r.value.trim()!==s.value.trim()?(u=!1,l(r,!1)):l(r,!0),c(m.value)?l(m,!0):(u=!1,l(m,!1)),g.value!==m.value?(u=!1,l(g,!1)):l(g,!0),i.disabled=!u}[t,s,r,m,g].forEach(u=>u?.addEventListener("input",a)),n&&n.addEventListener("click",()=>e.classList.add("hidden")),e.addEventListener("click",u=>{u.target===e&&e.classList.add("hidden")}),o.addEventListener("submit",async u=>{u.preventDefault();const b=t.value.trim(),f=s.value.trim(),v=m.value.trim(),h=i.innerHTML;i.innerHTML=ie,i.disabled=!0;try{const p=new AbortController,E=setTimeout(()=>p.abort(),15e3),C=await fetch(Pe,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:b,email:f,password:v}),signal:p.signal});if(clearTimeout(E),!C.ok){alert("Signup failed. Please try again."),m.value="",g.value="";return}const L=await C.json();L.token&&V(L.token,{username:L.username||b,avatarUrl:L.avatarUrl||"/default-avatar.png"}),U({isLoggedIn:!0,username:L.username||b,avatarUrl:L.avatarUrl||"/default-avatar.png"}),await fetch("/stats/api/friends/online",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:L.user.username})}),e.classList.add("hidden"),console.log("Signup successful!")}catch(p){console.error("Signup error:",p),alert("Network error or request timeout.")}finally{i.innerHTML=h,i.disabled=!1}})}function Te(e,n="user-avatar"){const o=document.getElementById(n);o&&(o.src=`undefined/uploads/avatars/${e}?${Date.now()}`)}async function Ne(e,n){if(e)try{const o=await e.arrayBuffer();console.log("Uploading avatar for",n,"size:",e.size);const t=performance.now(),s=await fetch(`undefined/uploads/upload-avatar/${n}`,{method:"POST",headers:{"Content-Type":"application/octet-stream"},body:o});if(console.log("Upload finished in",performance.now()-t,"ms"),!s.ok){console.error("❌ Upload failed:",await s.text());return}console.log("✅ Avatar uploaded successfully")}catch(o){console.error("Error uploading avatar:",o)}}async function $e(){const e=document.getElementById("user-section");if(!e){console.warn("⚠️ user-section not found in DOM");return}function n(){if(k.isLoggedIn){e.innerHTML=Fe;const o=document.getElementById("user-greeting");o&&(o.textContent=k.username||"User");const t=document.getElementById("user-avatar"),s=document.getElementById("default-avatar");t&&k.username?(Te(k.username,"user-avatar"),t.classList.remove("hidden"),s&&s.classList.add("hidden")):(t&&t.classList.add("hidden"),s&&s.classList.remove("hidden"));const r=document.getElementById("logout-btn");r&&r.addEventListener("click",()=>{k.username&&fetch("/stats/api/friends/offline",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:k.username})}).then(()=>console.log("👋 User marked offline")).catch(c=>console.error("❌ Failed to mark user offline:",c)),G(),k.setState({isLoggedIn:!1,username:void 0,avatarUrl:void 0})});const m=document.getElementById("settings-btn"),g=document.getElementById("settings-modal"),i=document.getElementById("settings-close");if(m&&g){m.addEventListener("click",l=>{l.stopPropagation(),g.classList.remove("hidden"),g.classList.add("opacity-100","pointer-events-auto")}),i&&i.addEventListener("click",()=>{g.classList.add("hidden"),g.classList.remove("opacity-100","pointer-events-auto")}),g.addEventListener("click",l=>{l.target===g&&(g.classList.add("hidden"),g.classList.remove("opacity-100","pointer-events-auto"))});const c=document.getElementById("avatar-upload");c&&c.addEventListener("change",async l=>{l.stopPropagation(),l.preventDefault();const a=c.files?.[0];if(a&&k.username){await Ne(a,k.username);const u=Date.now(),b=void 0;["user-avatar","user-avatar-modal"].forEach(f=>{const v=document.getElementById(f),h=document.getElementById(f.replace("user-avatar","default-avatar"));v&&(v.src=`${b}/uploads/avatars/${k.username}?${u}`,v.classList.remove("hidden")),h&&h.classList.add("hidden")}),console.log("✅ Avatar refreshed successfully")}})}}else e.innerHTML=Ie,de(),le()}n(),k.subscribe(n)}function De(){const e=document.getElementById("menu-toggle"),n=document.getElementById("sidebar"),o=document.getElementById("page-content");!e||!n||!o||e.addEventListener("change",()=>{q.sidebarOpen=e.checked,q.sidebarOpen?(n.classList.remove("-translate-x-full"),o.classList.add("ml-48")):(n.classList.add("-translate-x-full"),o.classList.remove("ml-48"))})}let y=null,P=[],F=0;const $=5;let A=null;function Oe(){return window.anonymousId||(window.anonymousId="Anonymous"+Math.floor(1e3+Math.random()*9e3)),window.anonymousId}function J(e){if(A&&(clearTimeout(A),A=null),y){try{y.close(1e3,"Reconnecting")}catch(a){console.warn("Error closing existing socket:",a)}y=null}let n=null;try{n=typeof B=="function"?B():null}catch{n=null}const o=n?.token??null,t=n?.user?.username??n?.username??Oe(),s=window.location.protocol==="https:",r=s?"wss:":"ws:",g=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?window.location.host:"10.19.250.99:3000",i=`${r}//${g}/ws`,c=o?`${i}?token=${o}`:i;console.log(`🔌 Connecting to WebSocket (attempt ${F+1}/${$}):`),console.log(`   URL: ${c.replace(/token=[^&]+/,"token=***")}`),console.log(`   Username: ${t}`),console.log(`   Secure: ${s}`);try{y=new WebSocket(c)}catch(a){console.error("❌ Failed to create WebSocket:",a),z(e);return}const l=setTimeout(()=>{y&&y.readyState!==WebSocket.OPEN&&(console.warn("⏱️ WebSocket connection timeout"),y.close(),z(e))},1e4);y.addEventListener("open",()=>{clearTimeout(l),F=0,console.log("✅ WebSocket connected successfully");try{y?.send(JSON.stringify({type:"setUsername",username:t})),console.log("📤 Sent setUsername:",t)}catch(u){console.warn("⚠️ Failed to send setUsername:",u)}let a=0;for(;P.length>0&&y&&y.readyState===WebSocket.OPEN;){const u=P.shift();try{y.send(u),a++}catch(b){console.error("❌ Failed to send queued message:",b),P.unshift(u);break}}a>0&&console.log(`📤 Flushed ${a} queued message(s)`)}),y.addEventListener("error",a=>{clearTimeout(l),console.error("❌ WebSocket error:",a)}),y.addEventListener("close",a=>{clearTimeout(l),console.log("❌ WebSocket disconnected",{code:a.code,reason:a.reason||"No reason provided",wasClean:a.wasClean}),y=null,a.code!==1e3?z(e):(console.log("✅ WebSocket closed normally"),F=0)}),y.addEventListener("message",a=>{try{const u=JSON.parse(a.data);console.log("📨 Received:",u),e&&e(u)}catch{console.log("📩 WS (raw):",a.data),e&&e(a.data)}})}function z(e){if(F>=$){console.error(`❌ Max reconnection attempts (${$}) reached. Giving up.`);return}const n=Math.min(1e3*Math.pow(2,F),3e4);F++,console.log(`🔄 Reconnecting in ${n}ms... (attempt ${F}/${$})`),A=window.setTimeout(()=>{J(e)},n)}function Y(e){const n=JSON.stringify(e);if(y&&y.readyState===WebSocket.OPEN)try{console.log("📤 Sending:",e),y.send(n)}catch(o){console.error("❌ Failed to send message:",o),P.push(n)}else console.warn("⚠️ WebSocket not connected. Queueing message.",{socket:!!y,readyState:y?.readyState}),P.push(n)}function _e(){if(A&&(clearTimeout(A),A=null),y){try{y.close(1e3,"User logout")}catch(e){console.warn("Error closing socket:",e)}y=null}F=0,P=[],console.log("🔌 WebSocket closed by user")}const He=_e,K=window.location.origin;async function je(e){const n=B();if(!n?.token)throw new Error("Not authenticated");console.log(`🚫 Blocking user ID: ${e}`);const o=await fetch(`${K}/block/block`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n.token}`},body:JSON.stringify({blockedUserId:e})});if(!o.ok){const s=await o.text();throw console.error("❌ Block failed:",s),new Error("Failed to block user")}const t=await o.json();console.log("✅ Block successful:",t)}async function ze(e){const n=B();if(!n?.token)throw new Error("Not authenticated");console.log(`✅ Unblocking user ID: ${e}`);const o=await fetch(`${K}/block/unblock`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n.token}`},body:JSON.stringify({blockedUserId:e})});if(!o.ok){const s=await o.text();throw console.error("❌ Unblock failed:",s),new Error("Failed to unblock user")}const t=await o.json();console.log("✅ Unblock successful:",t)}async function Re(e){const n=B();if(!n?.token)return!1;try{const o=await fetch(`${K}/block/is-blocked/${e}`,{headers:{"Content-Type":"application/json",Authorization:`Bearer ${n.token}`}});if(!o.ok)return console.warn(`Block check failed with status: ${o.status}`),!1;const t=o.headers.get("content-type");if(!t||!t.includes("application/json"))return console.warn("Block check returned non-JSON response"),!1;const s=await o.json();return console.log(`🔍 User ${e} blocked status:`,s.isBlocked),s.isBlocked}catch(o){return console.error("❌ Error checking block status:",o),!1}}let R=null;function Ge(){const e=ae();if(!e){console.warn("⚠️ User not logged in, chat disabled.");const i=document.getElementById("chat-container");i&&(i.innerHTML=`
        <div class="flex items-center justify-center p-8">
          <div class="text-red-500 text-center">
            <p class="text-lg font-semibold">Please log in to use chat</p>
            <p class="text-sm text-gray-600 mt-2">You need to be authenticated to send and receive messages.</p>
          </div>
        </div>
      `);return}const n=document.getElementById("chat-input"),o=document.getElementById("chat-send"),t=document.getElementById("chat-messages"),s=document.getElementById("chat-users");if(!n||!o||!t){console.warn("⚠️ Chat elements not found on page.");return}const r=Me();if(!r){console.error("❌ No authentication token available"),S("Authentication required");return}fetch("https://10.19.250.99:3000/api/users",{headers:{Authorization:`Bearer ${r}`}}).then(i=>{if(!i.ok)throw new Error(`Failed to fetch users: ${i.status}`);return i.json()}).then(i=>{if(s){if(s.innerHTML="",i.length===0){s.innerHTML=`
          <div class="text-center text-gray-500 py-4">
            No other users online
          </div>
        `;return}i.forEach(c=>{if(c.username===e.username)return;const l=document.createElement("div");l.className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 user-item transition-colors duration-200";const a=document.createElement("div");a.className="flex items-center space-x-3";const u=document.createElement("div");u.className="w-2 h-2 bg-green-500 rounded-full";const b=document.createElement("span");b.textContent=c.username,b.className="text-gray-900 dark:text-white font-medium",a.appendChild(u),a.appendChild(b);const f=document.createElement("div");f.className="flex space-x-1";const v=document.createElement("button");v.innerHTML="💬",v.title="Message",v.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",v.onclick=()=>{R=c.username,c.id,t.innerHTML="",S(`Now chatting with ${c.username}`),document.querySelectorAll(".user-item").forEach(C=>{C.classList.remove("bg-blue-200","dark:bg-blue-600","ring-2","ring-blue-500")}),l.classList.add("bg-blue-200","dark:bg-blue-600","ring-2","ring-blue-500")};const h=document.createElement("button");h.innerHTML="🚫",h.title="Block",h.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",h.dataset.userId=String(c.id),Re(c.id).then(C=>{C&&(h.classList.add("text-red-500","bg-red-100","dark:bg-red-900"),h.innerHTML="✓ Blocked",h.title="Unblock")}).catch(C=>{console.error("Failed to check block status:",C)}),h.onclick=async C=>{C.stopPropagation(),h.disabled=!0;try{h.classList.contains("text-red-500")?(await ze(c.id),h.classList.remove("text-red-500","bg-red-100","dark:bg-red-900"),h.innerHTML="🚫",h.title="Block",S(`✅ Unblocked ${c.username}`)):(await je(c.id),h.classList.add("text-red-500","bg-red-100","dark:bg-red-900"),h.innerHTML="✓ Blocked",h.title="Unblock",S(`🚫 Blocked ${c.username}`))}catch(L){console.error("Block/unblock error:",L),S(`❌ Error: ${L.message}`)}finally{h.disabled=!1}};const p=document.createElement("button");p.innerHTML="🏓",p.title="Invite to Pong",p.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",p.onclick=C=>{C.stopPropagation(),Y({type:"invite",to:c.username,from:e.username,text:`${e.username} invited you to a Pong match!`}),S(`Invite sent to ${c.username}`)};const E=document.createElement("button");E.innerHTML="👤",E.title="View Profile",E.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",E.onclick=C=>{C.stopPropagation(),window.location.hash="stats",sessionStorage.setItem("selectedUserForStats",c.username)},f.append(v,p,h,E),l.append(a,f),s.appendChild(l)})}}).catch(i=>{console.error("Failed to load users:",i),S("Failed to load user list"),s&&(s.innerHTML=`
          <div class="text-center text-red-500 py-4">
            Error loading users
          </div>
        `)});function g(){if(!n)return;if(!R){S("⚠️ Select a user first!");return}const i=n.value.trim();if(!i)return;const c={from:e.username,to:R,text:i,type:"direct",timestamp:new Date().toISOString()};Y(c),ce(c,!0),n.value=""}o.addEventListener("click",g),n.addEventListener("keypress",i=>{i.key==="Enter"&&g()}),n.focus()}function ce(e,n=!1){const o=document.getElementById("chat-messages");if(!o)return;const t=document.createElement("div");t.className=`flex ${n?"justify-end":"justify-start"} mb-4`;const s=document.createElement("div");s.className=`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${n?"bg-blue-500 text-white rounded-br-none":"bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"} shadow-sm`;const r=document.createElement("div");r.className=`text-xs font-semibold mb-1 ${n?"text-blue-100":"text-gray-500 dark:text-gray-400"}`,r.textContent=e.from;const m=document.createElement("div");m.className="text-sm break-words",m.textContent=e.text;const g=document.createElement("div");g.className=`text-xs mt-1 text-right ${n?"text-blue-100":"text-gray-500 dark:text-gray-400"}`,g.textContent=new Date(e.timestamp).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),s.appendChild(r),s.appendChild(m),s.appendChild(g),t.appendChild(s),o.appendChild(t),o.scrollTop=o.scrollHeight}function S(e){const n=document.getElementById("chat-messages");if(!n)return;const o=document.createElement("div");o.className="flex justify-center my-2";const t=document.createElement("div");t.className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full italic",t.textContent=`⚙️ ${e}`,o.appendChild(t),n.appendChild(o),n.scrollTop=n.scrollHeight}function ue(e){if(!e||typeof e!="object")return;const n=ae();if(!n)return;switch(e.type||"direct"){case"direct":e.to&&e.to.toLowerCase()===n.username.toLowerCase()&&ce({from:e.from||"Anonymous",text:e.text||"",timestamp:e.timestamp||new Date().toISOString()},!1);break;case"system":S(e.text);break;case"error":S(`❌ ${e.text}`);break;case"invite":if(e.to&&e.to.toLowerCase()===n.username.toLowerCase()&&confirm(`🏓 ${e.from} invited you to a Pong match! Click OK to accept.`)){const s=crypto.randomUUID();Y({type:"invite_accept",to:e.from,from:n.username,matchId:s}),sessionStorage.setItem("matchId",s),sessionStorage.setItem("role","left"),window.location.hash="pong"}break;case"invite_accept":e.to&&e.to.toLowerCase()===n.username.toLowerCase()&&(S(`${e.from} accepted your invite! Starting game...`),sessionStorage.setItem("matchId",e.matchId),sessionStorage.setItem("role","right"),window.location.hash="pong");break;case"tournament":S(`🏆 Tournament update: ${e.text}`);break}}let d={difficulty:.05,mouse:!0,multiplayer:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!1};function Ye(){const e=document.getElementById("openSettings"),n=document.getElementById("closeSettings"),o=document.getElementById("controlPanel"),t=document.getElementById("paddleSpeed"),s=document.getElementById("paddleSpeedValue"),r=document.getElementById("ballSpeed"),m=document.getElementById("ballSpeedValue"),g=document.getElementById("scoreLimit"),i=document.getElementById("bgColor"),c=document.getElementById("itemsColor"),l=document.getElementById("resetSpeed"),a=document.getElementById("resetDefaults"),u=document.querySelectorAll('input[name="difficulty"]'),b=document.querySelectorAll('input[name="mouse"]'),f=document.querySelectorAll('input[name="multiplayer"]');function v(){u.forEach(p=>{p.checked=Number(p.value)===d.difficulty}),b.forEach(p=>{p.checked=p.value==="true"===d.mouse}),f.forEach(p=>{p.checked=p.value==="true"===d.multiplayer}),l.checked=d.resetSpeed,t.value=d.paddleSpeed.toString(),s.textContent=t.value,r.value=d.ballSpeed.toString(),m.textContent=r.value,g.value=d.scoreLimit.toString(),i.value=d.bgColor,c.value=d.itemsColor}function h(){u.forEach(p=>{p.addEventListener("change",()=>{d.difficulty=Number(p.value)})}),b.forEach(p=>{p.addEventListener("change",()=>{d.multiplayer===!1&&(d.mouse=p.value==="true")})}),f.forEach(p=>{p.addEventListener("change",()=>{d.multiplayer=p.value==="true",d.mouse=!1})}),l.addEventListener("change",()=>{d.resetSpeed=l.checked}),t.addEventListener("input",()=>{d.paddleSpeed=Number(t.value),s.textContent=t.value}),r.addEventListener("input",()=>{d.ballSpeed=Number(r.value),m.textContent=r.value}),g.addEventListener("input",()=>{const p=Number(g.value);p>0&&(d.scoreLimit=p)}),i.addEventListener("input",()=>{d.bgColor=i.value}),c.addEventListener("input",()=>{d.itemsColor=c.value}),a.addEventListener("click",()=>{d={...d,difficulty:.05,mouse:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!0},v()})}e?.addEventListener("click",()=>{v(),o?.classList.toggle("hidden")}),n?.addEventListener("click",()=>{o?.classList.add("hidden")}),h()}function Z(){if(!document.getElementById("stats-container"))return;const n=document.getElementById("fetchData"),o=document.getElementById("usernameInput"),t=document.getElementById("errorMessage"),s=document.getElementById("loading"),r=document.getElementById("infoUsername"),m=document.getElementById("infoEmail"),g=document.getElementById("winsCount"),i=document.getElementById("lossesCount"),c=document.getElementById("winRatio");async function l(f){s.style.display="block",t.style.display="none";try{const v=await fetch(`/stats/api/user-stats?username=${f}`),h=await fetch(`/stats/api/matches/${f}`);if(!v.ok||!h.ok)throw new Error("Invalid user");const p=await v.json(),E=await h.json();a(p,E)}catch(v){t.textContent=`Error: ${v.message}`,t.style.display="block"}finally{s.style.display="none"}}function a(f,v){r.textContent=f.username,m.textContent=f.email;let h=0,p=0;v.matches.forEach(E=>{E.winner===f.username?h++:E.loser===f.username&&p++}),g.textContent=String(h),i.textContent=String(p),c.textContent=`${(h/(h+p)*100||0).toFixed(1)}%`,u(v)}function u(f){const v=document.getElementById("matchHistoryGrid");if(v.innerHTML="",!f.matches||f.matches.length===0){v.innerHTML="<p>No matches yet</p>";return}f.matches.forEach(h=>{const p=document.createElement("div");p.classList.add("match-card");const E=new Date(h.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});p.innerHTML=`
        <h3>Match #${h.id}</h3>
        <div class="match-date">${E}</div>
        <div class="match-details">
          <span class="winner">${h.winner} (${h.winner_points})</span>
          <span class="vs">VS</span>
          <span class="loser">${h.loser} (${h.loser_points})</span>
        </div>
      `,v.appendChild(p)})}n.addEventListener("click",()=>{const f=o.value.trim();f?l(f):(t.textContent="Please enter a username",t.style.display="block")});const b=sessionStorage.getItem("selectedUserForStats");b&&b.trim()!==""&&(o.value=b,l(b),sessionStorage.removeItem("selectedUserForStats"))}async function We(e,n,o){const t=B();if(!t){console.log("Match not saved: No user logged in");return}if(!t.user.username){console.log("Match not saved: No user logged in");return}const s=t.user.username,r=k.username;console.log("Debug - Session username:",s),console.log("Debug - SharedState username:",r),console.log("Debug - Full session:",t);const m=s;if(console.log("Debug - Final username to use:",m),!m){console.log("Match not saved: No user logged in");return}var g,i,c,l;e>n?(c=e,l=n,g=m,o?i="guest_multiplayer":i="bot"):(c=n,l=e,i=m,o?g="guest_multiplayer":g="bot");try{const a=await fetch("/stats/api/match",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({winner:g,loser:i,winner_points:c,loser_points:l})});if(!a.ok){const b=await a.json();console.error("Failed to save match:",b);return}const u=await a.json();return console.log("Match saved for user:",m),u}catch(a){console.error("Error saving match:",a)}}let ee=!1,ne=!1;const x={START:"start",PLAYING:"playing",PAUSED:"paused",GAME_OVER:"gameOver"};let w=x.START,N=null,H=!1,j=!1,X=!1,Q=!1;window.addEventListener("keydown",e=>{(e.key==="w"||e.key==="W")&&(H=!0),(e.key==="s"||e.key==="S")&&(j=!0),e.key==="ArrowUp"&&(X=!0),e.key==="ArrowDown"&&(Q=!0)});window.addEventListener("keyup",e=>{(e.key==="w"||e.key==="W")&&(H=!1),(e.key==="s"||e.key==="S")&&(j=!1),e.key==="ArrowUp"&&(X=!1),e.key==="ArrowDown"&&(Q=!1)});function qe(e){const n=document.getElementById("game-overlay"),o=document.getElementById("game-message");!n||!o||(o.textContent=e,n.classList.remove("hidden"))}function T(e,n){const o=document.getElementById("game-overlay"),t=document.getElementById("overlay-buttons");!o||!t||(t.innerHTML="",e===1&&n.forEach(s=>{const r=document.createElement("button");r.textContent=s.text,r.className="px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-green-600 							hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none hover:text-green-600",r.onclick=s.onClick,t.appendChild(r)}),e===2&&n.forEach(s=>{const r=document.createElement("button");r.textContent=s.text,r.className="w-35 px-8 py-2 text-white font-lucky text-lg rounded-lg shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-blue-600 							hover:shadow-blue-500/50 hover:shadow-2xl focus:outline-none hover:text-blue-600",r.onclick=s.onClick,t.appendChild(r)}),o.classList.remove("hidden"))}function M(){const e=document.getElementById("game-overlay");e&&e.classList.add("hidden")}function Ve(){on();const{canvas:e,context:n}=Qe();if(!e||!n)return;const o={x:30,y:e.height/2-100/2,width:10,height:100,score:0},t={x:e.width-40,y:e.height/2-100/2,width:10,height:100,score:0},s={x:e.width/2,y:e.height/2,radius:10,velocityX:0,velocityY:0,speed:d.ballSpeed},r={x:e.width/2-1,y:0,width:2,height:10};o.y=e.height/2-o.height/2,t.y=e.height/2-t.height/2,s.x=e.width/2,s.y=e.height/2,s.velocityX=0,s.velocityY=0;const m=document.getElementById("pause-btn"),g=document.getElementById("openSettings"),i=a=>{Je(a,e,o)};d.mouse&&!d.multiplayer&&e.addEventListener("mousemove",i),T(1,[{text:"Start",onClick:()=>{w=x.PLAYING,M(),_(s)}}]),m&&m.addEventListener("click",()=>{w===x.PLAYING&&(w=x.PAUSED,T(2,[{text:"Resume",onClick:()=>{w=x.PLAYING,M()}},{text:"Restart",onClick:()=>{D(e,o,t,s)}}]))}),g&&g.addEventListener("click",()=>{w===x.PLAYING&&(w=x.PAUSED,T(2,[{text:"Resume",onClick:()=>{w=x.PLAYING,M()}},{text:"Restart",onClick:()=>{D(e,o,t,s)}}]))}),window.addEventListener("keydown",a=>{a.code==="Space"&&(w===x.PLAYING?(w=x.PAUSED,T(2,[{text:"Resume",onClick:()=>{w=x.PLAYING,M()}},{text:"Restart",onClick:()=>{D(e,o,t,s)}}])):w===x.PAUSED?(w=x.PLAYING,M()):w===x.START&&(w=x.PLAYING,M(),_(s)))});function c(){if(w===x.START||w===x.PAUSED||w===x.GAME_OVER){oe(e,n,o,t,s,r);return}d.multiplayer&&Ke(e,o,t),!d.multiplayer&&!d.mouse&&Xe(e,o),tn(e,o,t,s),oe(e,n,o,t,s,r)}function l(){(!d.mouse||d.multiplayer)&&e.removeEventListener("mousemove",i),c(),N=requestAnimationFrame(l)}N=requestAnimationFrame(l)}function Je(e,n,o){const t=n.getBoundingClientRect();let s=e.clientY-t.top-o.height/2;s<0&&(s=0),s+o.height>n.height&&(s=n.height-o.height),o.y=s}function D(e,n,o,t){n.score=0,o.score=0,n.y=e.height/2-n.height/2,o.y=e.height/2-o.height/2,t.x=e.width/2,t.y=e.height/2,t.velocityX=0,t.velocityY=0,w=x.PLAYING,M(),_(t)}function _(e){let n=e.speed;ee===!1&&(n=d.ballSpeed,ee=!0);const o=Math.random()*Math.PI/2-Math.PI/4,t=Math.random()<.5?1:-1;e.velocityX=t*n*Math.cos(o),e.velocityY=n*Math.sin(o)}function Ke(e,n,o){H&&(n.y-=d.paddleSpeed),j&&(n.y+=d.paddleSpeed),X&&(o.y-=d.paddleSpeed),Q&&(o.y+=d.paddleSpeed),n.y=Math.max(0,Math.min(n.y,e.height-n.height)),o.y=Math.max(0,Math.min(o.y,e.height-o.height))}function Xe(e,n){H&&(n.y-=d.paddleSpeed),j&&(n.y+=d.paddleSpeed),n.y=Math.max(0,Math.min(n.y,e.height-n.height))}function Qe(){const e=document.getElementById("pong");return e?{canvas:e,context:e.getContext("2d")}:{canvas:null,context:null}}function O(e,n,o,t,s,r,m=!1,g="none"){e.fillStyle=r,e.fillRect(n,o,t,s),m&&(e.strokeStyle=g,e.lineWidth=2,e.strokeRect(0,0,t,s))}function me(e,n,o,t,s){e.fillStyle=s,e.beginPath(),e.arc(n,o,t,0,Math.PI*2,!1),e.closePath(),e.fill()}function te(e,n,o,t,s){e.fillStyle=s,e.font="45px fantasy",e.fillText(n.toString(),o,t)}function Ze(e,n,o){me(n,o.x,0,30,d.itemsColor);for(let t=0;t<=e.height;t+=15)O(n,o.x,o.y+t,o.width,o.height,d.itemsColor)}function oe(e,n,o,t,s,r){O(n,0,0,e.width,e.height,d.bgColor,!0,d.itemsColor),Ze(e,n,r),te(n,o.score,e.width/4,e.height/5,d.itemsColor),te(n,t.score,3*e.width/4,e.height/5,d.itemsColor),O(n,o.x,o.y,o.width,o.height,d.itemsColor),O(n,t.x,t.y,t.width,t.height,d.itemsColor),me(n,s.x,s.y,s.radius,d.itemsColor)}function en(e,n){return e.top=e.y-e.radius,e.bottom=e.y+e.radius,e.left=e.x-e.radius,e.right=e.x+e.radius,n.top=n.y,n.bottom=n.y+n.height,n.left=n.x,n.right=n.x+n.width,e.right>n.left&&e.bottom>n.top&&e.left<n.right&&e.top<n.bottom}function se(e,n){n.x=e.width/2,n.y=e.height/2,d.resetSpeed&&(n.speed=d.ballSpeed),_(n)}function nn(e,n,o){const t=n.y+n.height/2;n.y+=(o.y-t)*d.difficulty,n.y=Math.max(0,Math.min(n.y,e.height-n.height))}function tn(e,n,o,t){t.x+=t.velocityX,t.y+=t.velocityY,d.multiplayer||nn(e,o,t),t.y+t.radius>e.height?(t.y=e.height-t.radius,t.velocityY=-t.velocityY):t.y-t.radius<0&&(t.y=t.radius,t.velocityY=-t.velocityY);const s=t.x<e.width/2?n:o;if(en(t,s)){ne===!1&&(t.speed=d.ballSpeed,ne=!0);let r=t.y-(s.y+s.height/2);r=r/(s.height/2);const m=r*Math.PI/4,g=t.x<e.width/2?1:-1;t.velocityX=g*t.speed*Math.cos(m),t.velocityY=t.speed*Math.sin(m),t.speed+=.1,g===1?t.x=s.x+s.width+t.radius:t.x=s.x-t.radius}if(t.x-t.radius<0?(o.score++,se(e,t)):t.x+t.radius>e.width&&(n.score++,se(e,t)),n.score===d.scoreLimit||o.score===d.scoreLimit){w=x.GAME_OVER;let r;n.score===d.scoreLimit?r="PLAYER 1 WINS!!!":d.multiplayer?r="PLAYER 2 WINS!!!":r="PLAYER 1 LOSES!!!",T(1,[{text:"Restart",onClick:()=>{D(e,n,o,t)}}]),qe(r),setTimeout(()=>{We(n.score,o.score,d.multiplayer)},16)}}function on(){N!==null&&(cancelAnimationFrame(N),N=null)}function sn(){const e=document.getElementById("friendInput"),n=document.getElementById("addFriendBtn"),o=document.getElementById("friendsList");let t=document.getElementById("friendsErrorMessage");if(t||(t=document.createElement("div"),t.id="friendsErrorMessage",t.style.cssText=`
      color: red;
      margin: 10px 0;
      padding: 10px;
      border-radius: 5px;
      background-color: #ffe6e6;
      border: 1px solid #ffcccc;
      min-height: 20px;
    `,o&&o.parentNode&&o.parentNode.insertBefore(t,o)),!e||!n||!o)return;function s(i){t.textContent=i,t.style.display="block",setTimeout(()=>{t.textContent="",t.style.display="none"},5e3)}function r(){t.textContent="",t.style.display="none"}async function m(){const i=k.username;if(!i){o.innerHTML='<li class="no-friends-message">Please log in to see your friends.</li>';return}try{const c=await fetch(`/stats/api/friends/${i}`),l=await c.json();if(!c.ok)throw new Error(l.error||"Failed to fetch friends");if(o.innerHTML="",l.friends.length===0){o.innerHTML='<li class="no-friends-message">No friends yet. Add some friends to get started!</li>';return}l.friends.forEach(a=>{const u=document.createElement("li");u.innerHTML=`
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${a.status==="online"?"#4CAF50":"#f44336"};"></div>
            <span>${a.username}</span>
            <small style="color: #666;">(${a.status})</small>
          </div>
        `,o.appendChild(u)})}catch(c){console.error(c),s("Error loading friends")}}async function g(){const i=k.username;if(!i){s("You must be logged in to add friends.");return}const c=e.value.trim();if(!c){s("Please enter a username");return}r();try{const l=await fetch(`/stats/api/friends/${i}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({friendUsername:c})}),a=await l.json();if(!l.ok){s(a.error||"Failed to add friend");return}e.value="",m()}catch(l){console.error(l),s("Error adding friend")}}n.addEventListener("click",g),e.addEventListener("input",r),m()}const ge="https://10.19.250.99:3000";function rn(){const e=document.getElementById("google-login-btn");e&&e.addEventListener("click",re),document.querySelectorAll(".google-login-modal").forEach(o=>{o.addEventListener("click",re)})}async function re(e){e.preventDefault();try{console.log("✅ Google login clicked");const n=window.location.hash||"#home";sessionStorage.setItem("preOAuthHash",n),window.location.href=`${ge}/oauth/google`}catch(n){console.error("❌ Google OAuth error:",n),W("Failed to initiate Google login. Please try again.")}}function an(){const e=new URLSearchParams(window.location.search),n=e.get("token"),o=e.get("error");if(o){console.error("❌ OAuth error:",o);let t="Authentication failed. Please try again.";o==="missing_code"?t="Authorization code was missing. Please try again.":o==="oauth_failed"&&(t="OAuth authentication failed. Please check your credentials."),W(t),window.history.replaceState({},document.title,window.location.pathname+window.location.hash);return}if(n){console.log("✅ OAuth token received, logging in...");try{const t=JSON.parse(atob(n.split(".")[1]));hn(n,{username:t.username,email:t.email,avatarUrl:t.avatarUrl||t.avatar_url}).then(()=>{console.log("✅ OAuth login successful"),window.history.replaceState({},document.title,window.location.pathname);const s=sessionStorage.getItem("preOAuthHash");sessionStorage.removeItem("preOAuthHash"),window.location.hash=s||"#home";const r=document.getElementById("login-modal");r&&r.classList.add("hidden"),dn("Successfully logged in with Google!")})}catch(t){console.error("❌ Failed to process OAuth token:",t),W("Login failed. Invalid token received."),window.history.replaceState({},document.title,window.location.pathname+window.location.hash)}}}function W(e){const n=document.getElementById("login-message");n?(n.textContent=e,n.className="text-red-500 text-sm mt-2",n.classList.remove("hidden"),setTimeout(()=>{n.classList.add("hidden")},5e3)):alert(e)}function dn(e){const n=document.getElementById("login-message");n&&(n.textContent=e,n.className="text-green-500 text-sm mt-2",n.classList.remove("hidden"),setTimeout(()=>{n.classList.add("hidden")},3e3))}async function ln(){try{return(await(await fetch(`${ge}/oauth/config`)).json()).googleEnabled===!0}catch(e){return console.error("❌ Error checking OAuth availability:",e),!1}}async function cn(){const e=await ln(),n=document.getElementById("google-login-btn");n&&(n.style.display=e?"flex":"none"),document.querySelectorAll(".google-login-modal").forEach(t=>{t.style.display=e?"flex":"none"})}const un=document.querySelector("#app"),q={sidebarOpen:!1};class mn{constructor(){this._isLoggedIn=!1,this.listeners=[]}get isLoggedIn(){return this._isLoggedIn}get username(){return this._username}get avatarUrl(){return this._avatarUrl}setState(n){const o=this._isLoggedIn;let t=!1;n.isLoggedIn!==void 0&&n.isLoggedIn!==this._isLoggedIn&&(this._isLoggedIn=n.isLoggedIn,t=!0),n.username!==void 0&&n.username!==this._username&&(this._username=n.username,t=!0),n.avatarUrl!==void 0&&n.avatarUrl!==this._avatarUrl&&(this._avatarUrl=n.avatarUrl,t=!0),t&&(o!==this._isLoggedIn&&gn(this._isLoggedIn),this.listeners.forEach(s=>s()))}subscribe(n){this.listeners.push(n)}}function gn(e){e?(console.log("🔌 Initializing WebSocket for logged-in user..."),J(n=>{console.log("📥 WebSocket message received in main:",n),ue(n)})):(console.log("🔌 Disconnecting WebSocket - user logged out"),He())}const k=new mn;function U(e){k.setState(e)}function pn(e,n){const o={username:n.username,avatarUrl:n.avatarUrl,token:e};localStorage.setItem("userSession",JSON.stringify(o))}async function hn(e,n){pn(e,n),U({isLoggedIn:!0,username:n.username,avatarUrl:n.avatarUrl})}async function I(e){un.innerHTML=`
    ${fe}
    <main id="page-content" class="transition-all duration-300 pt-16 p-4">
      ${e}
    </main>
    ${Ee}
    ${Ce}
    ${Se}
    ${Le}
  `,$e(),De(),Ge(),Ve(),Ye(),Z(),de(),le(),rn(),Z(),sn()}function pe(){switch(window.location.hash.slice(1)||"home"){case"about":I(be);break;case"tournament":I(ve);break;case"chat":I(ye);break;case"contact":I(xe);break;case"stats":I(we);break;case"userSettings":I(ke);break;case"friends":I(Be);break;default:I(he)}q.sidebarOpen=!1}window.addEventListener("error",e=>{console.error("🛑 Global error caught:",e.error)});window.addEventListener("unhandledrejection",e=>{console.error("🛑 Unhandled promise rejection:",e.reason)});window.addEventListener("DOMContentLoaded",async()=>{console.log("🚀 App initializing...");try{await an()}catch(n){console.error("OAuth callback handling failed:",n)}try{await cn()}catch(n){console.warn("initOAuthUI failed:",n)}await Ue()?(console.log("🔌 Initializing WebSocket for authenticated user..."),J(n=>{console.log("📥 WebSocket message received in main:",n),ue(n)})):console.log("🚫 No valid session, skipping WebSocket initialization"),await pe()});window.addEventListener("hashchange",pe);

(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const Re=`<main id="page-content" class="pt-16 flex-1">
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






 `,He=`<nav class="bg-[#0E172B] text-[#242423] font-bold w-screen
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
</nav>`,je=`<section class="bg-amber-400 w-full h-screen m-0 p-0">
  <h1 class="text-2xl font-bold">ABOUT</h1>
</section>`,Ge=`<section>
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
`,ze=`<section>
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
</section>`,We=`<section>
  <h1 class="text-2xl font-bold">CONTACT US!</h1>
</section>`,Ye=`
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
</html>
`,qe=`<section>
  <h1 class="text-2xl font-bold">USER SETTINGS</h1>
</section>`,Ve=`<div id="login-modal" class="fixed inset-0 flex flex-col items-end justify-start mt-22 mr-4 h-screen hidden">
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
</div>`,Je=`<!-- From Uiverse.io by themrsami --> 
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
`,Ke=`<!-- Sidebar -->
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
      <li><a href="#tournament" class="hover:underline">Tournaments</a></li>
      <li><a href="#stats" class="hover:underline">Player Stats</a></li>
      <li><a href="#friends" class="hover:underline">Friends</a></li>
      <li><a href="#about" class="hover:underline">About this Project</a></li>
      <li><a href="#contact" class="hover:underline">Contact us!</a></li>
    </ul>
  </div>
</aside>
`,Xe=`<div id="controlPanel"
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
`,Qe=`<!DOCTYPE html>
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
</html>`,Ze=`<!-- <button id="open-login" class="px-4 py- border border-amber-400 rounded text-white hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
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
</button>`,en=`<!-- components/navLoggedin.html (tooltips use peer-hover so they show only on the specific button) -->
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





`,Ce=`<div class="flex flex-row gap-2 justify-center items-center">
    <div class="w-2 h-2 rounded-full bg-black animate-bounce"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.3s]"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.5s]"></div>
</div>`,nn="undefined/auth/login";function oe(e){try{alert(e)}catch(n){console.warn("showMessage fallback:",e,n)}}function Se(){console.log("🔄 setupLoginForm() called");const e=document.getElementById("login-modal"),n=document.getElementById("open-login"),t=document.getElementById("login-form"),o=document.getElementById("login-email"),r=document.getElementById("login-password"),s=document.getElementById("login-submit"),i=document.getElementById("open-signup"),a=document.getElementById("signup-modal"),l=document.getElementById("google-login-btn");if(console.log("🔍 All elements found:",{loginModal:!!e,openBtnLogin:!!n,loginForm:!!t,openBtnSignup:!!i,signupModal:!!a,googleLoginBtn:!!l}),!e||!n||!t||!o||!r||!s){console.warn("Login modal setup failed: missing elements.");return}n.addEventListener("click",()=>{e.classList.toggle("hidden")}),e.addEventListener("click",g=>{g.target===e&&e.classList.add("hidden")}),i&&a&&i.addEventListener("click",()=>{e.classList.add("hidden"),a.classList.remove("hidden")});function c(){const g=o.value.trim()&&r.value.trim();s.disabled=!g}if(o.addEventListener("input",c),r.addEventListener("input",c),c(),n.addEventListener("click",()=>{console.log("✅ Login button clicked - opening login modal"),e.classList.remove("hidden")}),e.addEventListener("click",g=>{g.target===e&&(console.log("✅ Login modal background clicked - closing"),e.classList.add("hidden"))}),l&&l.addEventListener("click",()=>{console.log("✅ Google login clicked"),window.location.href="undefined/oauth/google"}),i)console.log("✅ Found open-signup button, adding event listener"),i.addEventListener("click",g=>{g.preventDefault(),console.log("✅ Signup button clicked in login modal"),console.log("   - Closing login modal"),e.classList.add("hidden"),a?(console.log("   - Opening signup modal"),a.classList.remove("hidden")):console.error("❌ Signup modal not found!")});else{console.error("❌ open-signup button not found in DOM!");const g=e.querySelectorAll("button");console.log("🔍 Buttons in login modal:",g.length),g.forEach(u=>{console.log("   - Button:",{id:u.id,text:u.textContent,type:u.type})})}t.addEventListener("submit",async g=>{if(g.preventDefault(),!o.value||!r.value)return;const u=s.innerHTML;s.innerHTML=Ce,s.disabled=!0;const v=new AbortController,f=setTimeout(()=>v.abort(),15e3);try{const b=await fetch(nn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o.value,password:r.value}),signal:v.signal});if(clearTimeout(f),!b.ok){oe("Invalid email or password"),r.value="",c(),s.innerHTML=u,s.disabled=!1;return}const h=await b.json();localStorage.setItem("auth_token",h.token),D({isLoggedIn:!0,username:h.username,avatarUrl:h.avatarUrl}),e.classList.add("hidden"),o.value="",r.value="",s.innerHTML=u,s.disabled=!0}catch{v.signal.aborted?oe("Login request timed out. Please try again."):oe("An error occurred. Please try again."),s.innerHTML=u,s.disabled=!0}}),console.log("✅ Login form setup complete")}const tn="undefined/auth/register";function Le(){const e=document.getElementById("signup-modal"),n=document.getElementById("open-login"),t=document.getElementById("signup-form"),o=document.getElementById("signup-username"),r=document.getElementById("signup-email"),s=document.getElementById("signup-comfirmEmail"),i=document.getElementById("signup-password"),a=document.getElementById("signup-confirmPassword"),l=t?.querySelector('button[type="submit"]');if(!e||!t||!o||!r||!s||!i||!a||!l){console.warn("Signup modal setup failed: missing elements.");return}function c(y){let w=y.nextElementSibling;return(!w||!w.classList.contains("error-msg"))&&(w=document.createElement("span"),w.className="error-msg text-red-500 text-sm block hidden",y.insertAdjacentElement("afterend",w)),w}const g=c(o),u=c(r),v=c(s),f=c(i),b=c(a);l.disabled=!0;function h(y){const w=y.length>=8,I=/[A-Z]/.test(y),M=/[0-9]/.test(y);return w&&I&&M}function m(y,w,I,M){w?(y.classList.remove("border-red-500","focus:ring-red-500"),y.classList.add("border-green-500","focus:ring-green-500"),M&&M.classList.add("hidden")):(y.classList.remove("border-green-500","focus:ring-green-500"),y.classList.add("border-red-500","focus:ring-red-500"),M&&I&&(M.textContent=I,M.classList.remove("hidden")))}function p(){let y=!0;o.value.trim().length===0?(m(o,!1,"Username is required.",g),y=!1):m(o,!0,"",g),r.value.trim().length===0?(m(r,!1,"Email is required.",u),y=!1):m(r,!0,"",u),s.value.trim()!==r.value.trim()||s.value.trim()===""?(m(s,!1,"Emails do not match.",v),y=!1):m(s,!0,"",v),h(i.value)?m(i,!0,"",f):(m(i,!1,"Password must be ≥ 8 chars, 1 uppercase & 1 number.",f),y=!1),a.value!==i.value||a.value===""?(m(a,!1,"Passwords do not match.",b),y=!1):m(a,!0,"",b),l.disabled=!y}o.addEventListener("input",p),r.addEventListener("input",p),s.addEventListener("input",p),i.addEventListener("input",p),a.addEventListener("input",p),n&&n.addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",y=>{y.target===e&&e.classList.add("hidden")}),t.addEventListener("submit",async y=>{y.preventDefault();const w=o.value.trim(),I=r.value.trim(),M=i.value.trim(),_e=l.innerHTML;l.innerHTML=Ce,l.disabled=!0;try{const q=new AbortController,De=setTimeout(()=>q.abort(),15e3),pe=await fetch(tn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:w,email:I,password:M}),signal:q.signal});if(clearTimeout(De),pe.ok){const V=await pe.json();console.log("Signup response:",V),localStorage.setItem("auth_token",V.token),D({username:V.user.username,avatarUrl:V.avatarUrl||"/default-avatar.png",isLoggedIn:!0}),e.classList.add("hidden"),console.log("Signup successful!")}else alert("Signup failed. Please try again."),i.value="",a.value=""}catch(q){console.error("Signup error:",q),alert("Network error or request timeout."),i.value="",a.value=""}finally{l.innerHTML=_e,l.disabled=!1}})}function on(e,n="user-avatar"){const t=document.getElementById(n);t&&(t.src=`undefined/uploads/avatars/${e}?${Date.now()}`)}async function rn(e,n){if(e)try{const t=await e.arrayBuffer();console.log("Uploading avatar for",n,"size:",e.size);const o=performance.now(),r=await fetch(`undefined/uploads/upload-avatar/${n}`,{method:"POST",headers:{"Content-Type":"application/octet-stream"},body:t});if(console.log("Upload finished in",performance.now()-o,"ms"),!r.ok){console.error("❌ Upload failed:",await r.text());return}console.log("✅ Avatar uploaded successfully")}catch(t){console.error("Error uploading avatar:",t)}}async function sn(){const e=document.getElementById("user-section");if(!e){console.warn("⚠️ user-section not found in DOM");return}function n(){if(S.isLoggedIn){e.innerHTML=en;const t=document.getElementById("user-greeting");t&&(t.textContent=S.username||"User");const o=document.getElementById("user-avatar"),r=document.getElementById("default-avatar");o&&S.username?(on(S.username,"user-avatar"),o.classList.remove("hidden"),r&&r.classList.add("hidden")):(o&&o.classList.add("hidden"),r&&r.classList.remove("hidden"));const s=document.getElementById("logout-btn");s&&s.addEventListener("click",()=>{S.setState({isLoggedIn:!1,username:void 0,avatarUrl:void 0})});const i=document.getElementById("settings-btn"),a=document.getElementById("settings-modal"),l=document.getElementById("settings-close");if(i&&a){i.addEventListener("click",g=>{g.stopPropagation(),a.classList.remove("hidden"),a.classList.add("opacity-100","pointer-events-auto")}),l&&l.addEventListener("click",()=>{a.classList.add("hidden"),a.classList.remove("opacity-100","pointer-events-auto")}),a.addEventListener("click",g=>{g.target===a&&(a.classList.add("hidden"),a.classList.remove("opacity-100","pointer-events-auto"))});const c=document.getElementById("avatar-upload");c&&c.addEventListener("change",async g=>{g.stopPropagation(),g.preventDefault();const u=c.files?.[0];if(u&&S.username){await rn(u,S.username);const v=Date.now(),f=void 0;["user-avatar","user-avatar-modal"].forEach(b=>{const h=document.getElementById(b),m=document.getElementById(b.replace("user-avatar","default-avatar"));h&&(h.src=`${f}/uploads/avatars/${S.username}?${v}`,h.classList.remove("hidden")),m&&m.classList.add("hidden")}),console.log("✅ Avatar refreshed successfully")}})}}else e.innerHTML=Ze,Se(),Le()}n(),S.subscribe(n)}function an(){const e=document.getElementById("menu-toggle"),n=document.getElementById("sidebar"),t=document.getElementById("page-content");!e||!n||!t||e.addEventListener("change",()=>{de.sidebarOpen=e.checked,de.sidebarOpen?(n.classList.remove("-translate-x-full"),t.classList.add("ml-48")):(n.classList.add("-translate-x-full"),t.classList.remove("ml-48"))})}function $(){try{const e=localStorage.getItem("userSession");if(!e)return null;const n=JSON.parse(e);return!n||typeof n!="object"||!n.token?null:n}catch(e){return console.error("Error loading session:",e),null}}function ln(e,n){const t={token:e,user:{id:n.id,username:n.username,email:n.email,avatarUrl:n.avatar_url||n.avatarUrl||"/default-avatar.png"}};localStorage.setItem("userSession",JSON.stringify(t))}function he(){localStorage.removeItem("userSession")}function Be(){return $()?.user||null}function dn(){try{return $()?.token||null}catch{return null}}async function cn(){try{const e=$();if(!e?.token)return console.log("No stored session found"),D({isLoggedIn:!1,username:void 0,avatarUrl:void 0}),!1;console.log("Found stored token, verifying...");const t=await fetch("https://pongpong.duckdns.org:3000/auth/me",{headers:{Authorization:`Bearer ${e.token}`}});if(!t.ok)return console.warn("Stored session invalid, clearing..."),he(),D({isLoggedIn:!1,username:void 0,avatarUrl:void 0}),!1;const o=await t.json();return console.log("User data received:",o),ln(e.token,o),D({isLoggedIn:!0,username:o.username,avatarUrl:o.avatar_url||o.avatarUrl||"/default-avatar.png"}),console.log("✅ Session restored:",o.username),!0}catch(e){return console.error("Error verifying stored session:",e),he(),D({isLoggedIn:!1,username:void 0,avatarUrl:void 0}),!1}}let x=null,j=[],T=0;const J=5;let R=null;function un(){return window.anonymousId||(window.anonymousId="Anonymous"+Math.floor(1e3+Math.random()*9e3)),window.anonymousId}function ce(e){if(R&&(clearTimeout(R),R=null),x){try{x.close(1e3,"Reconnecting")}catch(u){console.warn("Error closing existing socket:",u)}x=null}let n=null;try{n=typeof $=="function"?$():null}catch{n=null}const t=n?.token??null,o=n?.user?.username??n?.username??un(),r=window.location.protocol==="https:",s=r?"wss:":"ws:",a=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?window.location.host:"pongpong.duckdns.org:3000",l=`${s}//${a}/ws`,c=t?`${l}?token=${t}`:l;console.log(`🔌 Connecting to WebSocket (attempt ${T+1}/${J}):`),console.log(`   URL: ${c.replace(/token=[^&]+/,"token=***")}`),console.log(`   Username: ${o}`),console.log(`   Secure: ${r}`);try{x=new WebSocket(c)}catch(u){console.error("❌ Failed to create WebSocket:",u),re(e);return}const g=setTimeout(()=>{x&&x.readyState!==WebSocket.OPEN&&(console.warn("⏱️ WebSocket connection timeout"),x.close(),re(e))},1e4);x.addEventListener("open",()=>{clearTimeout(g),T=0,console.log("✅ WebSocket connected successfully");try{x?.send(JSON.stringify({type:"setUsername",username:o})),console.log("📤 Sent setUsername:",o)}catch(v){console.warn("⚠️ Failed to send setUsername:",v)}let u=0;for(;j.length>0&&x&&x.readyState===WebSocket.OPEN;){const v=j.shift();try{x.send(v),u++}catch(f){console.error("❌ Failed to send queued message:",f),j.unshift(v);break}}u>0&&console.log(`📤 Flushed ${u} queued message(s)`)}),x.addEventListener("error",u=>{clearTimeout(g),console.error("❌ WebSocket error:",u)}),x.addEventListener("close",u=>{clearTimeout(g),console.log("❌ WebSocket disconnected",{code:u.code,reason:u.reason||"No reason provided",wasClean:u.wasClean}),x=null,u.code!==1e3?re(e):(console.log("✅ WebSocket closed normally"),T=0)}),x.addEventListener("message",u=>{try{const v=JSON.parse(u.data);console.log("📨 Received:",v),e&&e(v)}catch{console.log("📩 WS (raw):",u.data),e&&e(u.data)}})}function re(e){if(T>=J){console.error(`❌ Max reconnection attempts (${J}) reached. Giving up.`);return}const n=Math.min(1e3*Math.pow(2,T),3e4);T++,console.log(`🔄 Reconnecting in ${n}ms... (attempt ${T}/${J})`),R=window.setTimeout(()=>{ce(e)},n)}function ae(e){const n=JSON.stringify(e);if(x&&x.readyState===WebSocket.OPEN)try{console.log("📤 Sending:",e),x.send(n)}catch(t){console.error("❌ Failed to send message:",t),j.push(n)}else console.warn("⚠️ WebSocket not connected. Queueing message.",{socket:!!x,readyState:x?.readyState}),j.push(n)}function gn(){if(R&&(clearTimeout(R),R=null),x){try{x.close(1e3,"User logout")}catch(e){console.warn("Error closing socket:",e)}x=null}T=0,j=[],console.log("🔌 WebSocket closed by user")}const Ie=gn;let d={difficulty:.05,mouse:!0,multiplayer:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!1};function mn(){const e=document.getElementById("openSettings"),n=document.getElementById("closeSettings"),t=document.getElementById("controlPanel"),o=document.getElementById("paddleSpeed"),r=document.getElementById("paddleSpeedValue"),s=document.getElementById("ballSpeed"),i=document.getElementById("ballSpeedValue"),a=document.getElementById("scoreLimit"),l=document.getElementById("bgColor"),c=document.getElementById("itemsColor"),g=document.getElementById("resetSpeed"),u=document.getElementById("resetDefaults"),v=document.querySelectorAll('input[name="difficulty"]'),f=document.querySelectorAll('input[name="mouse"]'),b=document.querySelectorAll('input[name="multiplayer"]');function h(){v.forEach(p=>{p.checked=Number(p.value)===d.difficulty}),f.forEach(p=>{p.checked=p.value==="true"===d.mouse}),b.forEach(p=>{p.checked=p.value==="true"===d.multiplayer}),g.checked=d.resetSpeed,o.value=d.paddleSpeed.toString(),r.textContent=o.value,s.value=d.ballSpeed.toString(),i.textContent=s.value,a.value=d.scoreLimit.toString(),l.value=d.bgColor,c.value=d.itemsColor}function m(){v.forEach(p=>{p.addEventListener("change",()=>{d.difficulty=Number(p.value)})}),f.forEach(p=>{p.addEventListener("change",()=>{d.multiplayer===!1&&(d.mouse=p.value==="true")})}),b.forEach(p=>{p.addEventListener("change",()=>{d.multiplayer=p.value==="true",d.mouse=!1})}),g.addEventListener("change",()=>{d.resetSpeed=g.checked}),o.addEventListener("input",()=>{d.paddleSpeed=Number(o.value),r.textContent=o.value}),s.addEventListener("input",()=>{d.ballSpeed=Number(s.value),i.textContent=s.value}),a.addEventListener("input",()=>{const p=Number(a.value);p>0&&(d.scoreLimit=p)}),l.addEventListener("input",()=>{d.bgColor=l.value}),c.addEventListener("input",()=>{d.itemsColor=c.value}),u.addEventListener("click",()=>{d={...d,difficulty:.05,mouse:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!0},h()})}e?.addEventListener("click",()=>{h(),t?.classList.toggle("hidden")}),n?.addEventListener("click",()=>{t?.classList.add("hidden")}),m()}let fe=!1,be=!1;const k={START:"start",PLAYING:"playing",PAUSED:"paused",GAME_OVER:"gameOver"};let E=k.START,ee=!1,ne=!1,ue=!1,ge=!1;window.addEventListener("keydown",e=>{(e.key==="w"||e.key==="W")&&(ee=!0),(e.key==="s"||e.key==="S")&&(ne=!0),e.key==="ArrowUp"&&(ue=!0),e.key==="ArrowDown"&&(ge=!0)});window.addEventListener("keyup",e=>{(e.key==="w"||e.key==="W")&&(ee=!1),(e.key==="s"||e.key==="S")&&(ne=!1),e.key==="ArrowUp"&&(ue=!1),e.key==="ArrowDown"&&(ge=!1)});function pn(e){const n=document.getElementById("game-overlay"),t=document.getElementById("game-message");!n||!t||(t.textContent=e,n.classList.remove("hidden"))}function W(e,n){const t=document.getElementById("game-overlay"),o=document.getElementById("overlay-buttons");!t||!o||(o.innerHTML="",e===1&&n.forEach(r=>{const s=document.createElement("button");s.textContent=r.text,s.className="px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-green-600 							hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none hover:text-green-600",s.onclick=r.onClick,o.appendChild(s)}),e===2&&n.forEach(r=>{const s=document.createElement("button");s.textContent=r.text,s.className="w-35 px-8 py-2 text-white font-lucky text-lg rounded-lg shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-blue-600 							hover:shadow-blue-500/50 hover:shadow-2xl focus:outline-none hover:text-blue-600",s.onclick=r.onClick,o.appendChild(s)}),t.classList.remove("hidden"))}function O(){const e=document.getElementById("game-overlay");e&&e.classList.add("hidden")}function hn(){const{canvas:e,context:n}=vn();if(!e||!n)return;const t={x:30,y:e.height/2-100/2,width:10,height:100,score:0},o={x:e.width-40,y:e.height/2-100/2,width:10,height:100,score:0},r={x:e.width/2,y:e.height/2,radius:10,velocityX:0,velocityY:0,speed:d.ballSpeed},s={x:e.width/2-1,y:0,width:2,height:10};t.y=e.height/2-t.height/2,o.y=e.height/2-o.height/2,r.x=e.width/2,r.y=e.height/2,r.velocityX=0,r.velocityY=0;const i=document.getElementById("pause-btn"),a=document.getElementById("openSettings"),l=u=>{fn(u,e,t)};d.mouse&&!d.multiplayer&&e.addEventListener("mousemove",l),W(1,[{text:"Start",onClick:()=>{E=k.PLAYING,O(),Z(r)}}]),i&&i.addEventListener("click",()=>{E===k.PLAYING&&(E=k.PAUSED,W(2,[{text:"Resume",onClick:()=>{E=k.PLAYING,O()}},{text:"Restart",onClick:()=>{K(e,t,o,r)}}]))}),a&&a.addEventListener("click",()=>{E===k.PLAYING&&(E=k.PAUSED,W(2,[{text:"Resume",onClick:()=>{E=k.PLAYING,O()}},{text:"Restart",onClick:()=>{K(e,t,o,r)}}]))}),window.addEventListener("keydown",u=>{u.code==="Space"&&(E===k.PLAYING?(E=k.PAUSED,W(2,[{text:"Resume",onClick:()=>{E=k.PLAYING,O()}},{text:"Restart",onClick:()=>{K(e,t,o,r)}}])):E===k.PAUSED?(E=k.PLAYING,O()):E===k.START&&(E=k.PLAYING,O(),Z(r)))});function c(){if(E===k.START||E===k.PAUSED||E===k.GAME_OVER){ve(e,n,t,o,r,s);return}d.multiplayer&&bn(e,t,o),!d.multiplayer&&!d.mouse&&yn(e,t),En(e,t,o,r),ve(e,n,t,o,r,s)}function g(){(!d.mouse||d.multiplayer)&&e.removeEventListener("mousemove",l),c(),requestAnimationFrame(g)}requestAnimationFrame(g)}function fn(e,n,t){const o=n.getBoundingClientRect();let r=e.clientY-o.top-t.height/2;r<0&&(r=0),r+t.height>n.height&&(r=n.height-t.height),t.y=r}function K(e,n,t,o){n.score=0,t.score=0,n.y=e.height/2-n.height/2,t.y=e.height/2-t.height/2,o.x=e.width/2,o.y=e.height/2,o.velocityX=0,o.velocityY=0,E=k.PLAYING,O(),Z(o)}function Z(e){let n=e.speed;fe===!1&&(n=d.ballSpeed,fe=!0);const t=Math.random()*Math.PI/2-Math.PI/4,o=Math.random()<.5?1:-1;e.velocityX=o*n*Math.cos(t),e.velocityY=n*Math.sin(t)}function bn(e,n,t){ee&&(n.y-=d.paddleSpeed),ne&&(n.y+=d.paddleSpeed),ue&&(t.y-=d.paddleSpeed),ge&&(t.y+=d.paddleSpeed),n.y=Math.max(0,Math.min(n.y,e.height-n.height)),t.y=Math.max(0,Math.min(t.y,e.height-t.height))}function yn(e,n){ee&&(n.y-=d.paddleSpeed),ne&&(n.y+=d.paddleSpeed),n.y=Math.max(0,Math.min(n.y,e.height-n.height))}function vn(){const e=document.getElementById("pong");return e?{canvas:e,context:e.getContext("2d")}:{canvas:null,context:null}}function X(e,n,t,o,r,s,i=!1,a="none"){e.fillStyle=s,e.fillRect(n,t,o,r),i&&(e.strokeStyle=a,e.lineWidth=2,e.strokeRect(0,0,o,r))}function Me(e,n,t,o,r){e.fillStyle=r,e.beginPath(),e.arc(n,t,o,0,Math.PI*2,!1),e.closePath(),e.fill()}function ye(e,n,t,o,r){e.fillStyle=r,e.font="45px fantasy",e.fillText(n.toString(),t,o)}function wn(e,n,t){Me(n,t.x,0,30,d.itemsColor);for(let o=0;o<=e.height;o+=15)X(n,t.x,t.y+o,t.width,t.height,d.itemsColor)}function ve(e,n,t,o,r,s){X(n,0,0,e.width,e.height,d.bgColor,!0,d.itemsColor),wn(e,n,s),ye(n,t.score,e.width/4,e.height/5,d.itemsColor),ye(n,o.score,3*e.width/4,e.height/5,d.itemsColor),X(n,t.x,t.y,t.width,t.height,d.itemsColor),X(n,o.x,o.y,o.width,o.height,d.itemsColor),Me(n,r.x,r.y,r.radius,d.itemsColor)}function xn(e,n){return e.top=e.y-e.radius,e.bottom=e.y+e.radius,e.left=e.x-e.radius,e.right=e.x+e.radius,n.top=n.y,n.bottom=n.y+n.height,n.left=n.x,n.right=n.x+n.width,e.right>n.left&&e.bottom>n.top&&e.left<n.right&&e.top<n.bottom}function we(e,n){n.x=e.width/2,n.y=e.height/2,d.resetSpeed&&(n.speed=d.ballSpeed),Z(n)}function kn(e,n,t){const o=n.y+n.height/2;n.y+=(t.y-o)*d.difficulty,n.y=Math.max(0,Math.min(n.y,e.height-n.height))}function En(e,n,t,o){o.x+=o.velocityX,o.y+=o.velocityY,d.multiplayer||kn(e,t,o),o.y+o.radius>e.height?(o.y=e.height-o.radius,o.velocityY=-o.velocityY):o.y-o.radius<0&&(o.y=o.radius,o.velocityY=-o.velocityY);const r=o.x<e.width/2?n:t;if(xn(o,r)){be===!1&&(o.speed=d.ballSpeed,be=!0);let s=o.y-(r.y+r.height/2);s=s/(r.height/2);const i=s*Math.PI/4,a=o.x<e.width/2?1:-1;o.velocityX=a*o.speed*Math.cos(i),o.velocityY=o.speed*Math.sin(i),o.speed+=.1,a===1?o.x=r.x+r.width+o.radius:o.x=r.x-o.radius}if(o.x-o.radius<0?(t.score++,we(e,o)):o.x+o.radius>e.width&&(n.score++,we(e,o)),n.score===d.scoreLimit||t.score===d.scoreLimit){E=k.GAME_OVER;let s;n.score===d.scoreLimit?s="PLAYER 1 WINS!!!":d.multiplayer?s="PLAYER 2 WINS!!!":s="PLAYER 1 LOSES!!!",W(1,[{text:"Restart",onClick:()=>{K(e,n,t,o)}}]),pn(s)}}let N={multiplayer:!1,bgColor:"#1C39BB",itemsColor:"#F5CB5C"},_=null,B=null;function Fe(){let e=document.getElementById("pong");if(!e)try{console.warn("#pong canvas not found — creating temporary canvas for debug");const t=document.getElementById("app")||document.body,o=document.createElement("div");o.id="pong-container",o.style.position="relative",o.style.width="100%",o.style.height="480px",o.style.zIndex="9999",o.style.display="flex",o.style.justifyContent="center",o.style.alignItems="center",e=document.createElement("canvas"),e.id="pong",e.width=Math.min(960,window.innerWidth-40),e.height=480,e.style.width=`${e.width}px`,e.style.height=`${e.height}px`,e.style.background="#000",e.style.border="1px solid #444",o.appendChild(e),t.appendChild(o),console.info("Temporary #pong canvas appended to DOM for debug")}catch(t){return console.error("Failed to create debug canvas:",t),{canvas:null,context:null}}const n=e.getContext("2d");return n?{canvas:e,context:n}:(console.error("2D context not available"),{canvas:e,context:null})}function Cn(e,n,t,o,r,s){n.fillStyle=N.bgColor,n.fillRect(0,0,e.width,e.height),n.fillStyle=N.itemsColor;const i=30;n.beginPath(),n.arc(s.x,0,i,0,Math.PI*2),n.fill();for(let l=0;l<=e.height;l+=15)n.fillRect(s.x-1,l,s.width,s.height);n.fillStyle=N.itemsColor,n.font="45px fantasy",n.textAlign="center",n.fillText(String(t?.score??0),e.width/4,e.height/5),n.fillText(String(o?.score??0),3*e.width/4,e.height/5),n.fillStyle=N.itemsColor,n.fillRect(t.x,t.y,t.width,t.height),n.fillRect(o.x,o.y,o.width,o.height),n.beginPath(),n.arc(r.x,r.y,r.radius,0,Math.PI*2),n.closePath(),n.fillStyle=N.itemsColor,n.fill();const a=window.currentGameState;a==="start"?Sn(n,e):a==="paused"?Ln(n,e):a==="game_over"&&Bn(n,e)}function Sn(e,n){e.fillStyle="rgba(0, 0, 0, 0.7)",e.fillRect(0,0,n.width,n.height),e.fillStyle="#fff",e.font="36px sans-serif",e.textAlign="center",e.fillText("READY TO PLAY",n.width/2,n.height/2-50),e.font="24px sans-serif",e.fillText("Waiting to start...",n.width/2,n.height/2);const t=window.playerRole;e.fillText(t==="left"?"You are LEFT player (W/S keys)":"You are RIGHT player (↑/↓ keys)",n.width/2,n.height/2+50)}function Ln(e,n){e.fillStyle="rgba(0, 0, 0, 0.7)",e.fillRect(0,0,n.width,n.height),e.fillStyle="#fff",e.font="36px sans-serif",e.textAlign="center",e.fillText("GAME PAUSED",n.width/2,n.height/2)}function Bn(e,n){e.fillStyle="rgba(0, 0, 0, 0.8)",e.fillRect(0,0,n.width,n.height),e.fillStyle="#fff",e.font="48px sans-serif",e.textAlign="center";const t=window.lastWinner;e.fillText(t?`${t} WINS!`:"GAME OVER",n.width/2,n.height/2-50),e.font="24px sans-serif"}function Ue(){_!==null&&cancelAnimationFrame(_);function e(){const{canvas:n,context:t}=Fe();if(!n||!t){console.warn("Canvas not available, stopping render loop");return}B&&Cn(n,t,B.paddles?.left??{x:30,y:n.height/2-50,width:10,height:100,score:0},B.paddles?.right??{x:n.width-40,y:n.height/2-50,width:10,height:100,score:0},B.ball??{x:n.width/2,y:n.height/2,radius:10},{x:n.width/2-1,width:2,height:10}),_=requestAnimationFrame(e)}_=requestAnimationFrame(e),console.log("✅ Render loop started")}function G(){_!==null&&(cancelAnimationFrame(_),_=null,console.log("🛑 Render loop stopped"))}function P(e,n=[]){const t=document.getElementById("game-overlay"),o=document.getElementById("game-message"),r=document.getElementById("overlay-buttons");if(!t||!o||!r){console.warn("Overlay elements not found in DOM");return}o.textContent=e,r.innerHTML="",n.forEach(s=>{const i=document.createElement("button");i.textContent=s.text,i.className="px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-green-600 hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none hover:text-green-600",i.onclick=s.onClick,r.appendChild(i)}),t.classList.remove("hidden")}function C(){const e=document.getElementById("game-overlay");e&&(e.classList.add("hidden"),console.log("✅ HTML overlay hidden"))}function Pe(){window.pongKeyDownHandler&&document.removeEventListener("keydown",window.pongKeyDownHandler),window.pongKeyUpHandler&&document.removeEventListener("keyup",window.pongKeyUpHandler);const e=t=>{const o=window.playerRole;if(!o)return;const r=o==="left",s=r?"w":"ArrowUp",i=r?"s":"ArrowDown";t.key===s||t.key===s.toUpperCase()?(se("up"),t.preventDefault()):(t.key===i||t.key===i.toUpperCase())&&(se("down"),t.preventDefault())},n=t=>{const o=window.playerRole;if(!o)return;const r=o==="left",s=r?"w":"ArrowUp",i=r?"s":"ArrowDown";(t.key===s||t.key===s.toUpperCase()||t.key===i||t.key===i.toUpperCase())&&(se("stop"),t.preventDefault())};window.pongKeyDownHandler=e,window.pongKeyUpHandler=n,document.addEventListener("keydown",e),document.addEventListener("keyup",n),console.log("✅ Input listeners registered")}function Ae(e){if(console.log("🎯 Starting game with match data:",e),typeof window.stopSearchingOverlay=="function")try{window.stopSearchingOverlay()}catch{}console.debug("handleMatchFound: calling setupPong/init and ensuring canvas exists"),window.matchId=e.matchId,window.playerRole=e.role,window.opponent=e.opponent,N.multiplayer=!0,(async()=>{if(typeof window.setupPong=="function")try{console.log("🛠️ Calling setupPong()"),window.setupPong()}catch(r){console.error("setupPong() error:",r)}else console.warn("setupPong function not found, UI may not be initialized");const{canvas:n,context:t}=Fe();if(!n||!t){console.warn("Canvas not available after setupPong(); match will not render");return}const o=e.initialState||e.state||e.startState;o?(B=o,window.currentGameState=o.gameState||"start"):B={gameState:"start",ball:{x:n.width/2,y:n.height/2,radius:10},paddles:{left:{x:30,y:n.height/2-50,width:10,height:100,score:0},right:{x:n.width-40,y:n.height/2-50,width:10,height:100,score:0}}},Pe(),Ue(),P(`Match found! Opponent: ${e.opponent}
You are ${String(e.role).toUpperCase()} player`,[{text:"Start Game",onClick:()=>{C(),On("start")}}]),console.log("✅ Game initialized and rendering")})()}function In(e){console.log(`🔄 Game state update: ${e.gameState}`,{ballMoving:e.ball.velocityX!==0||e.ball.velocityY!==0,ballPos:{x:e.ball.x,y:e.ball.y}}),B=e,window.currentGameState=e.gameState,e.gameState==="playing"&&(C(),console.log("✅ Game playing - overlay hidden"))}function Mn(e){console.log("🏁 Game over received:",e),window.currentGameState="game_over",window.lastWinner=e.winner,B&&(B.gameState="game_over",e.score&&B.paddles&&(B.paddles.left.score=e.score.left,B.paddles.right.score=e.score.right)),P(`Game Over! ${e.winner} wins!
Score: ${e.score?.left} - ${e.score?.right}`,[{text:"Main Menu",onClick:()=>{C(),G(),window.location.reload()}}])}function Fn(e){console.log("🔄 Rejoined match:",e),window.matchId=e.matchId,window.playerRole=e.role,window.opponent=e.opponent,N.multiplayer=!0,Pe(),Ue(),P(`Rejoined match vs ${e.opponent}`,[{text:"Continue",onClick:()=>C()}])}function Un(e){P(`Invite from ${e}`,[{text:"Accept",onClick:()=>{C();const n=window.pongSocket;n&&n.readyState===WebSocket.OPEN&&n.send(JSON.stringify({type:"acceptInvite",from:e}))}},{text:"Decline",onClick:()=>C()}])}function Pn(){console.warn("💤 Opponent disconnected"),P("Opponent disconnected - waiting for reconnection...",[{text:"Wait",onClick:()=>C()},{text:"Leave Match",onClick:()=>{C(),G(),window.location.reload()}}])}function An(e){console.log("🏁 Match ended:",e),G(),P(`Match ended: ${e}`,[{text:"Play Again",onClick:()=>{C(),window.location.reload()}},{text:"Main Menu",onClick:()=>{C(),window.location.reload()}}])}function Tn(e){console.error("❌ Matchmaking error:",e),typeof window.stopSearchingOverlay=="function"&&window.stopSearchingOverlay(),G(),P(e,[{text:"Retry",onClick:()=>{C(),window.location.reload()}},{text:"Back",onClick:()=>{C(),window.location.reload()}}])}function $n(e){const n=document.getElementById("server-stats");n&&(n.textContent=`Players: ${e.players} | Waiting: ${e.waiting} | Matches: ${e.matches}`)}function se(e){const n=window.pongSocket,t=window.playerRole;if(!n||n.readyState!==WebSocket.OPEN){console.warn("Cannot send input: WebSocket not connected");return}if(!t){console.warn("Cannot send input: player role not set");return}const o={type:"input",player:t==="left"?"left":"right",direction:e};try{n.send(JSON.stringify(o))}catch(r){console.error("Failed to send input:",r)}}function On(e){const n=window.pongSocket;if(!n||n.readyState!==WebSocket.OPEN){console.warn("Cannot send control: WebSocket not connected");return}console.log(`🎮 Sending control: ${e}, matchId: ${window.matchId}`);const t={type:"control",action:e};try{n.send(JSON.stringify(t))}catch(o){console.error("Failed to send control:",o)}}function Nn(e){e.addEventListener("message",n=>{let t=null;try{if(!n.data||typeof n.data=="string"&&n.data.trim()===""){console.warn("pong_client: empty payload");return}t=JSON.parse(n.data.toString())}catch{console.debug("pong_client: non-json message:",n.data);return}switch(console.debug("📩 pong_client message:",t.type),t.type){case"connected":window.playerId=t.id,window.gameUsername=t.username;break;case"waiting":break;case"matchFound":Ae(t);break;case"state":In(t);break;case"gameOver":Mn(t);break;case"opponentDisconnected":Pn();break;case"opponentRejoined":P(`${t.username} reconnected!`,[{text:"Continue",onClick:()=>C()}]);break;case"rejoined":Fn(t);break;case"matchEnded":An(t.reason);break;case"invite":Un(t.from);break;case"error":Tn(t.message||"Server error");break;case"serverStats":$n(t);break;default:console.debug("Unhandled message type:",t.type)}}),e.addEventListener("close",n=>{if(console.warn("🔌 Pong socket closed",n.code,n.reason),G(),typeof window.stopSearchingOverlay=="function")try{window.stopSearchingOverlay()}catch{}n.code!==1e3&&!n.reason?.includes("User stopped")&&P("Connection lost",[{text:"Reconnect",onClick:()=>{C(),window.location.reload()}},{text:"Main Menu",onClick:()=>{C(),window.location.reload()}}])}),e.addEventListener("error",n=>{if(console.error("❌ Pong socket error",n),G(),typeof window.stopSearchingOverlay=="function")try{window.stopSearchingOverlay()}catch{}}),window.pongSocket=e,console.log("✅ WebSocket handlers attached")}function xe(e,n){console.log("✅ initClientPong initialized"),Nn(e),n&&n.type==="matchFound"&&(console.log("📦 Processing initial match data in initClientPong"),Ae(n))}const _n={START:"start"};function Y(e,n,t){const o=document.getElementById("game-overlay"),r=document.getElementById("game-message"),s=document.getElementById("overlay-buttons");!o||!s||(s.innerHTML="",r&&(r.textContent=t??""),n.forEach(i=>{const a=document.createElement("button");a.textContent=i.text,a.className="px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-green-600 hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none hover:text-green-600",a.onclick=i.onClick,s.appendChild(a)}),o.classList.remove("hidden"))}function U(){const e=document.getElementById("game-overlay");e&&e.classList.add("hidden")}function z(){Y(1,[{text:"🎮 Single Player",onClick:()=>{U(),Dn()}},{text:"🌐 Multiplayer",onClick:()=>{U(),te()}}],"Select Game Mode")}function Dn(){console.log("Starting single player..."),window.gameState=_n.START,hn()}let Q,F=null;function te(){if(!document.getElementById("pong")){console.error("❌ Canvas #pong not found in DOM!"),Y(2,[{text:"Back",onClick:()=>{U(),z()}}],"Error: Game canvas not found. Please refresh the page.");return}console.log("✅ Canvas found, starting multiplayer..."),jn(),Q=window.setTimeout(()=>{H(),Y(2,[{text:"Retry",onClick:()=>{U(),te()}},{text:"Back",onClick:()=>{U(),z()}}],"⏰ No opponents found.")},3e4),Rn()}function Rn(){const e=window.location.protocol==="https:"?`wss://${window.location.host}/ws`:`ws://${window.location.host}:3000/ws`;console.log("🔌 Connecting to:",e),F=new WebSocket(e),F.addEventListener("open",()=>{console.log("✅ Connected to Pong WebSocket:",e),F.send(JSON.stringify({type:"findMatch"}))}),F.addEventListener("message",n=>{try{const t=JSON.parse(n.data);Hn(t)}catch(t){console.error("Failed to parse WS message:",t,n.data)}}),F.addEventListener("close",n=>{console.warn("❌ Pong WebSocket closed",n.code,n.reason),H()}),F.addEventListener("error",n=>{console.error("❌ WebSocket error:",n),H(),Y(2,[{text:"Retry",onClick:()=>{U(),te()}},{text:"Back",onClick:()=>{U(),z()}}],"Connection error. Please try again.")})}function Hn(e){switch(console.log("📥 Multiplayer WS message:",e.type,e),e.type){case"waiting":const n=document.getElementById("game-message");n&&(n.textContent=e.message);break;case"matchFound":console.log("🎉 Match found! Initializing client..."),H(),typeof xe=="function"?xe(F,e):console.error("❌ initClientPong function not found!");break;case"error":H(),Y(2,[{text:"Retry",onClick:()=>{U(),te()}},{text:"Back",onClick:()=>{U(),z()}}],e.message||"An error occurred");break;default:console.debug("Message will be handled by pong_client:",e.type)}}function jn(){const e=document.getElementById("game-overlay"),n=document.getElementById("game-message"),t=document.getElementById("overlay-buttons");if(!e||!n||!t)return;t.innerHTML="";const o=document.createElement("button");o.textContent="Cancel",o.className="px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-red-600 hover:shadow-red-500/50 hover:shadow-2xl focus:outline-none hover:text-red-600",o.onclick=()=>{F&&F.close(),H(),z()},t.appendChild(o),n.textContent="🔍 Searching for opponent...",e.classList.remove("hidden")}function H(){Q&&(clearTimeout(Q),Q=0),console.log("🛑 Searching overlay stopped")}window.stopSearchingOverlay=H;const me=window.location.origin;async function Gn(e){const n=$();if(!n?.token)throw new Error("Not authenticated");console.log(`🚫 Blocking user ID: ${e}`);const t=await fetch(`${me}/block/block`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n.token}`},body:JSON.stringify({blockedUserId:e})});if(!t.ok){const r=await t.text();throw console.error("❌ Block failed:",r),new Error("Failed to block user")}const o=await t.json();console.log("✅ Block successful:",o)}async function zn(e){const n=$();if(!n?.token)throw new Error("Not authenticated");console.log(`✅ Unblocking user ID: ${e}`);const t=await fetch(`${me}/block/unblock`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n.token}`},body:JSON.stringify({blockedUserId:e})});if(!t.ok){const r=await t.text();throw console.error("❌ Unblock failed:",r),new Error("Failed to unblock user")}const o=await t.json();console.log("✅ Unblock successful:",o)}async function Wn(e){const n=$();if(!n?.token)return!1;try{const t=await fetch(`${me}/block/is-blocked/${e}`,{headers:{"Content-Type":"application/json",Authorization:`Bearer ${n.token}`}});if(!t.ok)return console.warn(`Block check failed with status: ${t.status}`),!1;const o=t.headers.get("content-type");if(!o||!o.includes("application/json"))return console.warn("Block check returned non-JSON response"),!1;const r=await t.json();return console.log(`🔍 User ${e} blocked status:`,r.isBlocked),r.isBlocked}catch(t){return console.error("❌ Error checking block status:",t),!1}}let ie=null;function Yn(){const e=Be();if(!e){console.warn("⚠️ User not logged in, chat disabled.");const l=document.getElementById("chat-container");l&&(l.innerHTML=`
        <div class="flex items-center justify-center p-8">
          <div class="text-red-500 text-center">
            <p class="text-lg font-semibold">Please log in to use chat</p>
            <p class="text-sm text-gray-600 mt-2">You need to be authenticated to send and receive messages.</p>
          </div>
        </div>
      `);return}const n=document.getElementById("chat-input"),t=document.getElementById("chat-send"),o=document.getElementById("chat-messages"),r=document.getElementById("chat-users");if(!n||!t||!o){console.warn("⚠️ Chat elements not found on page.");return}const s=dn();if(!s){console.error("❌ No authentication token available"),L("Authentication required");return}fetch("https://pongpong.duckdns.org:3000/api/users",{headers:{Authorization:`Bearer ${s}`}}).then(l=>{if(!l.ok)throw new Error(`Failed to fetch users: ${l.status}`);return l.json()}).then(l=>{if(r){if(r.innerHTML="",l.length===0){r.innerHTML=`
          <div class="text-center text-gray-500 py-4">
            No other users online
          </div>
        `;return}l.forEach(c=>{if(c.username===e.username)return;const g=document.createElement("div");g.className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 user-item transition-colors duration-200";const u=document.createElement("div");u.className="flex items-center space-x-3";const v=document.createElement("div");v.className="w-2 h-2 bg-green-500 rounded-full";const f=document.createElement("span");f.textContent=c.username,f.className="text-gray-900 dark:text-white font-medium",u.appendChild(v),u.appendChild(f);const b=document.createElement("div");b.className="flex space-x-1";const h=document.createElement("button");h.innerHTML="💬",h.title="Message",h.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",h.onclick=()=>{ie=c.username,c.id,o.innerHTML="",L(`Now chatting with ${c.username}`),document.querySelectorAll(".user-item").forEach(w=>{w.classList.remove("bg-blue-200","dark:bg-blue-600","ring-2","ring-blue-500")}),g.classList.add("bg-blue-200","dark:bg-blue-600","ring-2","ring-blue-500")};const m=document.createElement("button");m.innerHTML="🚫",m.title="Block",m.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",m.dataset.userId=String(c.id),Wn(c.id).then(w=>{w&&(m.classList.add("text-red-500","bg-red-100","dark:bg-red-900"),m.innerHTML="✓ Blocked",m.title="Unblock")}).catch(w=>{console.error("Failed to check block status:",w)}),m.onclick=async w=>{w.stopPropagation(),m.disabled=!0;try{m.classList.contains("text-red-500")?(await zn(c.id),m.classList.remove("text-red-500","bg-red-100","dark:bg-red-900"),m.innerHTML="🚫",m.title="Block",L(`✅ Unblocked ${c.username}`)):(await Gn(c.id),m.classList.add("text-red-500","bg-red-100","dark:bg-red-900"),m.innerHTML="✓ Blocked",m.title="Unblock",L(`🚫 Blocked ${c.username}`))}catch(I){console.error("Block/unblock error:",I),L(`❌ Error: ${I.message}`)}finally{m.disabled=!1}};const p=document.createElement("button");p.innerHTML="🏓",p.title="Invite to Pong",p.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",p.onclick=w=>{w.stopPropagation(),ae({type:"invite",to:c.username,from:e.username,text:`${e.username} invited you to a Pong match!`}),L(`Invite sent to ${c.username}`)};const y=document.createElement("button");y.innerHTML="👤",y.title="View Profile",y.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",y.onclick=w=>{w.stopPropagation(),window.location.hash=`userSettings?user=${encodeURIComponent(c.username)}`},b.append(h,p,m,y),g.append(u,b),r.appendChild(g)})}}).catch(l=>{console.error("Failed to load users:",l),L("Failed to load user list"),r&&(r.innerHTML=`
          <div class="text-center text-red-500 py-4">
            Error loading users
          </div>
        `)});function a(){if(!n)return;if(!ie){L("⚠️ Select a user first!");return}const l=n.value.trim();if(!l)return;const c={from:e.username,to:ie,text:l,type:"direct",timestamp:new Date().toISOString()};ae(c),Te(c,!0),n.value=""}t.addEventListener("click",a),n.addEventListener("keypress",l=>{l.key==="Enter"&&a()}),n.focus()}function Te(e,n=!1){const t=document.getElementById("chat-messages");if(!t)return;const o=document.createElement("div");o.className=`flex ${n?"justify-end":"justify-start"} mb-4`;const r=document.createElement("div");r.className=`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${n?"bg-blue-500 text-white rounded-br-none":"bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"} shadow-sm`;const s=document.createElement("div");s.className=`text-xs font-semibold mb-1 ${n?"text-blue-100":"text-gray-500 dark:text-gray-400"}`,s.textContent=e.from;const i=document.createElement("div");i.className="text-sm break-words",i.textContent=e.text;const a=document.createElement("div");a.className=`text-xs mt-1 text-right ${n?"text-blue-100":"text-gray-500 dark:text-gray-400"}`,a.textContent=new Date(e.timestamp).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),r.appendChild(s),r.appendChild(i),r.appendChild(a),o.appendChild(r),t.appendChild(o),t.scrollTop=t.scrollHeight}function L(e){const n=document.getElementById("chat-messages");if(!n)return;const t=document.createElement("div");t.className="flex justify-center my-2";const o=document.createElement("div");o.className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full italic",o.textContent=`⚙️ ${e}`,t.appendChild(o),n.appendChild(t),n.scrollTop=n.scrollHeight}function qn(e){if(!e||typeof e!="object")return;const n=Be();if(!n)return;switch(e.type||"direct"){case"direct":e.to&&e.to.toLowerCase()===n.username.toLowerCase()&&Te({from:e.from||"Anonymous",text:e.text||"",timestamp:e.timestamp||new Date().toISOString()},!1);break;case"system":L(e.text);break;case"error":L(`❌ ${e.text}`);break;case"invite":e.to&&e.to.toLowerCase()===n.username.toLowerCase()&&L(`🏓 ${e.from} invited you to a Pong game!`);break;case"tournament":L(`🏆 Tournament update: ${e.text}`);break}}function Vn(){const e=document.getElementById("friendInput"),n=document.getElementById("addFriendBtn"),t=document.getElementById("friendsList");let o=document.getElementById("friendsErrorMessage");if(o||(o=document.createElement("div"),o.id="friendsErrorMessage",o.style.cssText=`
      color: red;
      margin: 10px 0;
      padding: 10px;
      border-radius: 5px;
      background-color: #ffe6e6;
      border: 1px solid #ffcccc;
      min-height: 20px;
    `,t&&t.parentNode&&t.parentNode.insertBefore(o,t)),!e||!n||!t){console.error("Friends page elements not found");return}function r(l){o.textContent=l,o.style.display="block",setTimeout(()=>{o.textContent="",o.style.display="none"},5e3)}function s(){o.textContent="",o.style.display="none"}async function i(){const l=S.username;if(!l){t.innerHTML='<li class="no-friends-message">Please log in to see your friends.</li>';return}try{const c=await fetch(`/stats/api/friends/${l}`),g=await c.json();if(!c.ok)throw new Error(g.error||"Failed to fetch friends");if(t.innerHTML="",g.friends.length===0){t.innerHTML='<li class="no-friends-message">No friends yet. Add some friends to get started!</li>';return}g.friends.forEach(u=>{const v=document.createElement("li");v.innerHTML=`
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${u.status==="online"?"#4CAF50":"#f44336"};"></div>
            <span>${u.username}</span>
            <small style="color: #666;">(${u.status})</small>
          </div>
        `,t.appendChild(v)})}catch(c){console.error(c),r("Error loading friends")}}async function a(){const l=S.username;if(!l){r("You must be logged in to add friends.");return}const c=e.value.trim();if(!c){r("Please enter a username");return}s();try{const g=await fetch(`/stats/api/friends/${l}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({friendUsername:c})}),u=await g.json();if(!g.ok){r(u.error||"Failed to add friend");return}e.value="",i()}catch(g){console.error(g),r("Error adding friend")}}n.addEventListener("click",a),e.addEventListener("input",s),i()}function ke(){if(!document.getElementById("stats-container"))return;const n=document.getElementById("fetchData"),t=document.getElementById("usernameInput"),o=document.getElementById("errorMessage"),r=document.getElementById("loading"),s=document.getElementById("infoUsername"),i=document.getElementById("infoEmail"),a=document.getElementById("winsCount"),l=document.getElementById("lossesCount"),c=document.getElementById("winRatio");async function g(f){r.style.display="block",o.style.display="none";try{const b=await fetch(`/stats/api/user-stats?username=${f}`),h=await fetch(`/stats/api/matches/${f}`);if(!b.ok||!h.ok)throw new Error("Invalid user");const m=await b.json(),p=await h.json();u(m,p)}catch(b){o.textContent=`Error: ${b.message}`,o.style.display="block"}finally{r.style.display="none"}}function u(f,b){s.textContent=f.username,i.textContent=f.email;let h=0,m=0;b.matches.forEach(p=>{p.winner===f.username?h++:p.loser===f.username&&m++}),a.textContent=String(h),l.textContent=String(m),c.textContent=`${(h/(h+m)*100||0).toFixed(1)}%`,v(b)}function v(f){const b=document.getElementById("matchHistoryGrid");if(b.innerHTML="",!f.matches||f.matches.length===0){b.innerHTML="<p>No matches yet</p>";return}f.matches.forEach(h=>{const m=document.createElement("div");m.classList.add("match-card");const p=new Date(h.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});m.innerHTML=`
        <h3>Match #${h.id}</h3>
        <div class="match-date">${p}</div>
        <div class="match-details">
          <span class="winner">${h.winner} (${h.winner_points})</span>
          <span class="vs">VS</span>
          <span class="loser">${h.loser} (${h.loser_points})</span>
        </div>
      `,b.appendChild(m)})}n.addEventListener("click",()=>{const f=t.value.trim();f?g(f):(o.textContent="Please enter a username",o.style.display="block")})}const $e="https://10.19.250.99:3000";function Jn(){const e=document.getElementById("google-login-btn");e&&e.addEventListener("click",Ee),document.querySelectorAll(".google-login-modal").forEach(t=>{t.addEventListener("click",Ee)})}async function Ee(e){e.preventDefault();try{console.log("✅ Google login clicked");const n=window.location.hash||"#home";sessionStorage.setItem("preOAuthHash",n),window.location.href=`${$e}/oauth/google`}catch(n){console.error("❌ Google OAuth error:",n),le("Failed to initiate Google login. Please try again.")}}function Kn(){const e=new URLSearchParams(window.location.search),n=e.get("token"),t=e.get("error");if(t){console.error("❌ OAuth error:",t);let o="Authentication failed. Please try again.";t==="missing_code"?o="Authorization code was missing. Please try again.":t==="oauth_failed"&&(o="OAuth authentication failed. Please check your credentials."),le(o),window.history.replaceState({},document.title,window.location.pathname+window.location.hash);return}if(n){console.log("✅ OAuth token received, logging in...");try{const o=JSON.parse(atob(n.split(".")[1]));localStorage.setItem("auth_token",n),rt(n,{username:o.username,email:o.email,avatarUrl:o.avatarUrl||o.avatar_url}).then(()=>{console.log("✅ OAuth login successful"),window.history.replaceState({},document.title,window.location.pathname);const r=sessionStorage.getItem("preOAuthHash");sessionStorage.removeItem("preOAuthHash"),window.location.hash=r||"#home";const s=document.getElementById("login-modal");s&&s.classList.add("hidden"),Xn("Successfully logged in with Google!")})}catch(o){console.error("❌ Failed to process OAuth token:",o),le("Login failed. Invalid token received."),localStorage.removeItem("auth_token"),window.history.replaceState({},document.title,window.location.pathname+window.location.hash)}}}function le(e){const n=document.getElementById("login-message");n?(n.textContent=e,n.className="text-red-500 text-sm mt-2",n.classList.remove("hidden"),setTimeout(()=>{n.classList.add("hidden")},5e3)):alert(e)}function Xn(e){const n=document.getElementById("login-message");n&&(n.textContent=e,n.className="text-green-500 text-sm mt-2",n.classList.remove("hidden"),setTimeout(()=>{n.classList.add("hidden")},3e3))}async function Qn(){try{return(await(await fetch(`${$e}/oauth/config`)).json()).googleEnabled===!0}catch(e){return console.error("❌ Error checking OAuth availability:",e),!1}}async function Zn(){const e=await Qn(),n=document.getElementById("google-login-btn");n&&(n.style.display=e?"flex":"none"),document.querySelectorAll(".google-login-modal").forEach(o=>{o.style.display=e?"flex":"none"})}const et=document.querySelector("#app"),de={sidebarOpen:!1};class nt{_isLoggedIn=!1;_username;_avatarUrl;listeners=[];get isLoggedIn(){return this._isLoggedIn}get username(){return this._username}get avatarUrl(){return this._avatarUrl}setState(n){const t=this._isLoggedIn;let o=!1;n.isLoggedIn!==void 0&&n.isLoggedIn!==this._isLoggedIn&&(this._isLoggedIn=n.isLoggedIn,o=!0),n.username!==void 0&&n.username!==this._username&&(this._username=n.username,o=!0),n.avatarUrl!==void 0&&n.avatarUrl!==this._avatarUrl&&(this._avatarUrl=n.avatarUrl,o=!0),o&&(t!==this._isLoggedIn&&tt(this._isLoggedIn),this.listeners.forEach(r=>r()))}subscribe(n){this.listeners.push(n)}}function tt(e){e?console.log("🔌 User logged in - WebSocket already initialized"):(console.log("🔌 Disconnecting WebSocket - user logged out"),Ie())}const S=new nt;function D(e){S.setState(e)}function ot(e,n){const t={username:n.username,avatarUrl:n.avatarUrl,token:e};localStorage.setItem("userSession",JSON.stringify(t))}async function rt(e,n){ot(e,n),D({isLoggedIn:!0,username:n.username,avatarUrl:n.avatarUrl})}function Oe(){window.initWebSocket=ce,window.sendMessage=ae,window.disconnectWebSocket=Ie,console.log("🔌 WebSocket functions exposed globally")}async function A(e){et.innerHTML=`
    ${He}
    <main id="page-content" class="transition-all duration-300 pt-16 p-4">
      ${e}
    </main>
    ${Ve}
    ${Je}
    ${Ke}
    ${Xe}
  `,Oe(),sn(),an(),Yn(),z(),mn(),ke(),Se(),Le(),Jn(),ke(),Vn()}function Ne(){switch(window.location.hash.slice(1)||"home"){case"about":A(je);break;case"tournament":A(Ge);break;case"chat":A(ze);break;case"contact":A(We);break;case"stats":A(Ye);break;case"userSettings":A(qe);break;case"friends":A(Qe);break;default:A(Re)}de.sidebarOpen=!1}window.addEventListener("error",e=>{console.error("🛑 Global error caught:",e.error)});window.addEventListener("unhandledrejection",e=>{console.error("🛑 Unhandled promise rejection:",e.reason)});window.addEventListener("DOMContentLoaded",async()=>{console.log("🚀 App initializing...");let e=!1;try{await Kn(),e=!0,console.log("OAuth callback processed:",e)}catch(t){console.error("OAuth callback handling failed:",t)}const n=await cn();console.log("Valid session:",n),n?(console.log("🔌 Initializing WebSocket for authenticated user..."),ce(t=>{console.log("📥 WebSocket message received in main:",t),qn(t)})):console.log("🚫 No valid session, skipping WebSocket initialization"),Oe(),await Ne();try{await Zn()}catch(t){console.warn("initOAuthUI failed:",t)}});window.addEventListener("hashchange",Ne);

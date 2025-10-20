(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function o(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=o(s);fetch(s.href,r)}})();const fe=`<main id="page-content" class="pt-16 flex-1">
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






 `,be=`<nav class="bg-[#0E172B] text-[#242423] font-bold w-screen
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
</nav>`,ve=`<section class="bg-amber-400 w-full h-screen m-0 p-0">
  <h1 class="text-2xl font-bold">ABOUT</h1>
</section>`,ye=`<section>
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
</section>`,we=`<section>
  <h1 class="text-2xl font-bold">CONTACT US!</h1>
</section>`,xe=`
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
    
    <!-- Google OAuth Button - Remove hidden class -->
    <button id="google-login-btn" 
            class="w-full bg-white text-gray-800 py-3 px-4 rounded-md font-semibold mb-4 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors border border-gray-300">
      <svg class="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
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
      <li><a href="#about" class="hover:underline">About this Project</a></li>
      <li><a href="#contact" class="hover:underline">Contact us!</a></li>
    </ul>
  </div>
</aside>
`,Be=`<div id="controlPanel"
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
`,Le=`<!-- <button id="open-login" class="px-4 py- border border-amber-400 rounded text-white hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
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
</button>`,Ie=`<!-- components/navLoggedin.html (tooltips use peer-hover so they show only on the specific button) -->
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
          <button class="peer p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors duration-150 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-100/80 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              ></path>            </svg>
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





`;function B(){try{const e=localStorage.getItem("userSession");if(!e)return null;const t=JSON.parse(e);return!t||typeof t!="object"||!t.token?null:t}catch(e){return console.error("Error loading session:",e),null}}function q(e,t){const o={token:e,user:{id:t.id,username:t.username,email:t.email,avatarUrl:t.avatar_url||t.avatarUrl||"/default-avatar.png"}};localStorage.setItem("userSession",JSON.stringify(o))}function Y(){localStorage.removeItem("userSession")}function ae(){return B()?.user||null}function Me(){try{return B()?.token||null}catch{return null}}async function Ue(){try{const e=B();if(!e?.token)return console.log("No stored session found"),U({isLoggedIn:!1,username:void 0,avatarUrl:void 0}),!1;console.log("Found stored token, verifying...");const o=await fetch("https://pongpong.duckdns.org:3000/auth/me",{headers:{Authorization:`Bearer ${e.token}`}});if(!o.ok)return console.warn("Stored session invalid, clearing..."),Y(),U({isLoggedIn:!1,username:void 0,avatarUrl:void 0}),!1;const n=await o.json();return console.log("User data received:",n),q(e.token,n),U({isLoggedIn:!0,username:n.username,avatarUrl:n.avatar_url||n.avatarUrl||"/default-avatar.png"}),console.log("✅ Session restored:",n.username),!0}catch(e){return console.error("Error verifying stored session:",e),Y(),U({isLoggedIn:!1,username:void 0,avatarUrl:void 0}),!1}}const ie=`<div class="flex flex-row gap-2 justify-center items-center">
    <div class="w-2 h-2 rounded-full bg-black animate-bounce"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.3s]"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.5s]"></div>
</div>`,Pe="undefined/auth/login";function le(){console.log("🔄 setupLoginForm() called");const e=document.getElementById("login-modal"),t=document.getElementById("open-login"),o=document.getElementById("login-form"),n=document.getElementById("login-email"),s=document.getElementById("login-password"),r=document.getElementById("login-submit"),d=document.getElementById("login-message"),u=document.getElementById("open-signup"),c=document.getElementById("signup-modal"),m=document.getElementById("google-login-btn");if(console.log("🔍 All elements found:",{loginModal:!!e,openBtnLogin:!!t,loginForm:!!o,openBtnSignup:!!u,signupModal:!!c,googleLoginBtn:!!m}),!e||!t||!o||!n||!s||!r){console.warn("Login modal setup failed: missing elements.");return}function p(){const i=n.value.trim()&&s.value.trim();r.disabled=!i}if(n.addEventListener("input",p),s.addEventListener("input",p),p(),t.addEventListener("click",()=>{console.log("✅ Login button clicked - opening login modal"),e.classList.remove("hidden")}),e.addEventListener("click",i=>{i.target===e&&(console.log("✅ Login modal background clicked - closing"),e.classList.add("hidden"))}),m&&m.addEventListener("click",()=>{console.log("✅ Google login clicked"),window.location.href="undefined/oauth/google"}),u)console.log("✅ Found open-signup button, adding event listener"),u.addEventListener("click",i=>{i.preventDefault(),console.log("✅ Signup button clicked in login modal"),console.log("   - Closing login modal"),e.classList.add("hidden"),c?(console.log("   - Opening signup modal"),c.classList.remove("hidden")):console.error("❌ Signup modal not found!")});else{console.error("❌ open-signup button not found in DOM!");const i=e.querySelectorAll("button");console.log("🔍 Buttons in login modal:",i.length),i.forEach(l=>{console.log("   - Button:",{id:l.id,text:l.textContent,type:l.type})})}o.addEventListener("submit",async i=>{if(i.preventDefault(),!n.value||!s.value)return;d&&(d.textContent="");const l=r.innerHTML;r.innerHTML=ie,r.disabled=!0;try{const h=await fetch(Pe,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n.value,password:s.value})});if(!h.ok){d&&(d.textContent="Invalid email or password"),r.innerHTML=l,r.disabled=!1;return}const b=await h.json();b.token&&b.user&&(q(b.token,{username:b.user.username,avatarUrl:"/default-avatar.png"}),U({isLoggedIn:!0,username:b.user.username,avatarUrl:"/default-avatar.png"})),e.classList.add("hidden"),n.value="",s.value="",p()}catch(h){console.error("Login error:",h),d&&(d.textContent="An error occurred. Please try again.")}finally{r.innerHTML=l,p()}}),console.log("✅ Login form setup complete")}const Ae="undefined/auth/register";function de(){const e=document.getElementById("signup-modal"),t=document.getElementById("open-login"),o=document.getElementById("signup-form"),n=document.getElementById("signup-username"),s=document.getElementById("signup-email"),r=document.getElementById("signup-comfirmEmail"),d=document.getElementById("signup-password"),u=document.getElementById("signup-confirmPassword"),c=o?.querySelector('button[type="submit"]');if(!e||!o||!n||!s||!r||!d||!u||!c){console.warn("Signup modal setup failed: missing elements.");return}function m(l){return l.length>=8&&/[A-Z]/.test(l)&&/[0-9]/.test(l)}function p(l,h,b,v){h?(l.classList.remove("border-red-500","focus:ring-red-500"),l.classList.add("border-green-500","focus:ring-green-500")):(l.classList.remove("border-green-500","focus:ring-green-500"),l.classList.add("border-red-500","focus:ring-red-500"))}function i(){let l=!0;n.value.trim()?p(n,!0):(l=!1,p(n,!1)),s.value.trim()?p(s,!0):(l=!1,p(s,!1)),r.value.trim()!==s.value.trim()?(l=!1,p(r,!1)):p(r,!0),m(d.value)?p(d,!0):(l=!1,p(d,!1)),u.value!==d.value?(l=!1,p(u,!1)):p(u,!0),c.disabled=!l}[n,s,r,d,u].forEach(l=>l?.addEventListener("input",i)),t&&t.addEventListener("click",()=>e.classList.add("hidden")),e.addEventListener("click",l=>{l.target===e&&e.classList.add("hidden")}),o.addEventListener("submit",async l=>{l.preventDefault();const h=n.value.trim(),b=s.value.trim(),v=d.value.trim(),f=c.innerHTML;c.innerHTML=ie,c.disabled=!0;try{const g=new AbortController,L=setTimeout(()=>g.abort(),15e3),k=await fetch(Ae,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:h,email:b,password:v}),signal:g.signal});if(clearTimeout(L),!k.ok){alert("Signup failed. Please try again."),d.value="",u.value="";return}const C=await k.json();C.token&&q(C.token,{username:C.username||h,avatarUrl:C.avatarUrl||"/default-avatar.png"}),U({isLoggedIn:!0,username:C.username||h,avatarUrl:C.avatarUrl||"/default-avatar.png"}),e.classList.add("hidden"),console.log("Signup successful!")}catch(g){console.error("Signup error:",g),alert("Network error or request timeout.")}finally{c.innerHTML=f,c.disabled=!1}})}async function Fe(){const e=document.getElementById("user-section");if(!e){console.warn("⚠️ user-section not found in DOM");return}function t(){if(M.isLoggedIn){e.innerHTML=Ie;const o=document.getElementById("user-greeting");o&&(o.textContent=M.username||"User");const n=document.getElementById("user-avatar"),s=document.getElementById("default-avatar");M.avatarUrl?(n&&(n.src=M.avatarUrl,n.classList.remove("hidden")),s&&s.classList.add("hidden")):(n&&n.classList.add("hidden"),s&&s.classList.remove("hidden"));const r=document.getElementById("logout-btn");r&&r.addEventListener("click",()=>{Y(),M.setState({isLoggedIn:!1,username:void 0,avatarUrl:void 0})})}else e.innerHTML=Le,le(),de()}t(),M.subscribe(t)}function Te(){const e=document.getElementById("menu-toggle"),t=document.getElementById("sidebar"),o=document.getElementById("page-content");!e||!t||!o||e.addEventListener("change",()=>{V.sidebarOpen=e.checked,V.sidebarOpen?(t.classList.remove("-translate-x-full"),o.classList.add("ml-48")):(t.classList.add("-translate-x-full"),o.classList.remove("ml-48"))})}let y=null,F=[],S=0;const $=5;let P=null;function _e(){return window.anonymousId||(window.anonymousId="Anonymous"+Math.floor(1e3+Math.random()*9e3)),window.anonymousId}function J(e){if(P&&(clearTimeout(P),P=null),y){try{y.close(1e3,"Reconnecting")}catch(i){console.warn("Error closing existing socket:",i)}y=null}let t=null;try{t=typeof B=="function"?B():null}catch{t=null}const o=t?.token??null,n=t?.user?.username??t?.username??_e(),s=window.location.protocol==="https:",r=s?"wss:":"ws:",u=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?window.location.host:"pongpong.duckdns.org:3000",c=`${r}//${u}/ws`,m=o?`${c}?token=${o}`:c;console.log(`🔌 Connecting to WebSocket (attempt ${S+1}/${$}):`),console.log(`   URL: ${m.replace(/token=[^&]+/,"token=***")}`),console.log(`   Username: ${n}`),console.log(`   Secure: ${s}`);try{y=new WebSocket(m)}catch(i){console.error("❌ Failed to create WebSocket:",i),G(e);return}const p=setTimeout(()=>{y&&y.readyState!==WebSocket.OPEN&&(console.warn("⏱️ WebSocket connection timeout"),y.close(),G(e))},1e4);y.addEventListener("open",()=>{clearTimeout(p),S=0,console.log("✅ WebSocket connected successfully");try{y?.send(JSON.stringify({type:"setUsername",username:n})),console.log("📤 Sent setUsername:",n)}catch(l){console.warn("⚠️ Failed to send setUsername:",l)}let i=0;for(;F.length>0&&y&&y.readyState===WebSocket.OPEN;){const l=F.shift();try{y.send(l),i++}catch(h){console.error("❌ Failed to send queued message:",h),F.unshift(l);break}}i>0&&console.log(`📤 Flushed ${i} queued message(s)`)}),y.addEventListener("error",i=>{clearTimeout(p),console.error("❌ WebSocket error:",i)}),y.addEventListener("close",i=>{clearTimeout(p),console.log("❌ WebSocket disconnected",{code:i.code,reason:i.reason||"No reason provided",wasClean:i.wasClean}),y=null,i.code!==1e3?G(e):(console.log("✅ WebSocket closed normally"),S=0)}),y.addEventListener("message",i=>{try{const l=JSON.parse(i.data);console.log("📨 Received:",l),e&&e(l)}catch{console.log("📩 WS (raw):",i.data),e&&e(i.data)}})}function G(e){if(S>=$){console.error(`❌ Max reconnection attempts (${$}) reached. Giving up.`);return}const t=Math.min(1e3*Math.pow(2,S),3e4);S++,console.log(`🔄 Reconnecting in ${t}ms... (attempt ${S}/${$})`),P=window.setTimeout(()=>{J(e)},t)}function Z(e){const t=JSON.stringify(e);if(y&&y.readyState===WebSocket.OPEN)try{console.log("📤 Sending:",e),y.send(t)}catch(o){console.error("❌ Failed to send message:",o),F.push(t)}else console.warn("⚠️ WebSocket not connected. Queueing message.",{socket:!!y,readyState:y?.readyState}),F.push(t)}function Ne(){if(P&&(clearTimeout(P),P=null),y){try{y.close(1e3,"User logout")}catch(e){console.warn("Error closing socket:",e)}y=null}S=0,F=[],console.log("🔌 WebSocket closed by user")}const De=Ne,K=window.location.origin;async function $e(e){const t=B();if(!t?.token)throw new Error("Not authenticated");console.log(`🚫 Blocking user ID: ${e}`);const o=await fetch(`${K}/block/block`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify({blockedUserId:e})});if(!o.ok){const s=await o.text();throw console.error("❌ Block failed:",s),new Error("Failed to block user")}const n=await o.json();console.log("✅ Block successful:",n)}async function He(e){const t=B();if(!t?.token)throw new Error("Not authenticated");console.log(`✅ Unblocking user ID: ${e}`);const o=await fetch(`${K}/block/unblock`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify({blockedUserId:e})});if(!o.ok){const s=await o.text();throw console.error("❌ Unblock failed:",s),new Error("Failed to unblock user")}const n=await o.json();console.log("✅ Unblock successful:",n)}async function Re(e){const t=B();if(!t?.token)return!1;try{const o=await fetch(`${K}/block/is-blocked/${e}`,{headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`}});if(!o.ok)return console.warn(`Block check failed with status: ${o.status}`),!1;const n=o.headers.get("content-type");if(!n||!n.includes("application/json"))return console.warn("Block check returned non-JSON response"),!1;const s=await o.json();return console.log(`🔍 User ${e} blocked status:`,s.isBlocked),s.isBlocked}catch(o){return console.error("❌ Error checking block status:",o),!1}}let W=null;function Oe(){const e=ae();if(!e){console.warn("⚠️ User not logged in, chat disabled.");const c=document.getElementById("chat-container");c&&(c.innerHTML=`
        <div class="flex items-center justify-center p-8">
          <div class="text-red-500 text-center">
            <p class="text-lg font-semibold">Please log in to use chat</p>
            <p class="text-sm text-gray-600 mt-2">You need to be authenticated to send and receive messages.</p>
          </div>
        </div>
      `);return}const t=document.getElementById("chat-input"),o=document.getElementById("chat-send"),n=document.getElementById("chat-messages"),s=document.getElementById("chat-users");if(!t||!o||!n){console.warn("⚠️ Chat elements not found on page.");return}const r=Me();if(!r){console.error("❌ No authentication token available"),E("Authentication required");return}fetch("https://pongpong.duckdns.org:3000/api/users",{headers:{Authorization:`Bearer ${r}`}}).then(c=>{if(!c.ok)throw new Error(`Failed to fetch users: ${c.status}`);return c.json()}).then(c=>{if(s){if(s.innerHTML="",c.length===0){s.innerHTML=`
          <div class="text-center text-gray-500 py-4">
            No other users online
          </div>
        `;return}c.forEach(m=>{if(m.username===e.username)return;const p=document.createElement("div");p.className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 user-item transition-colors duration-200";const i=document.createElement("div");i.className="flex items-center space-x-3";const l=document.createElement("div");l.className="w-2 h-2 bg-green-500 rounded-full";const h=document.createElement("span");h.textContent=m.username,h.className="text-gray-900 dark:text-white font-medium",i.appendChild(l),i.appendChild(h);const b=document.createElement("div");b.className="flex space-x-1";const v=document.createElement("button");v.innerHTML="💬",v.title="Message",v.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",v.onclick=()=>{W=m.username,m.id,n.innerHTML="",E(`Now chatting with ${m.username}`),document.querySelectorAll(".user-item").forEach(k=>{k.classList.remove("bg-blue-200","dark:bg-blue-600","ring-2","ring-blue-500")}),p.classList.add("bg-blue-200","dark:bg-blue-600","ring-2","ring-blue-500")};const f=document.createElement("button");f.innerHTML="🚫",f.title="Block",f.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",f.dataset.userId=String(m.id),Re(m.id).then(k=>{k&&(f.classList.add("text-red-500","bg-red-100","dark:bg-red-900"),f.innerHTML="✓ Blocked",f.title="Unblock")}).catch(k=>{console.error("Failed to check block status:",k)}),f.onclick=async k=>{k.stopPropagation(),f.disabled=!0;try{f.classList.contains("text-red-500")?(await He(m.id),f.classList.remove("text-red-500","bg-red-100","dark:bg-red-900"),f.innerHTML="🚫",f.title="Block",E(`✅ Unblocked ${m.username}`)):(await $e(m.id),f.classList.add("text-red-500","bg-red-100","dark:bg-red-900"),f.innerHTML="✓ Blocked",f.title="Unblock",E(`🚫 Blocked ${m.username}`))}catch(C){console.error("Block/unblock error:",C),E(`❌ Error: ${C.message}`)}finally{f.disabled=!1}};const g=document.createElement("button");g.innerHTML="🏓",g.title="Invite to Pong",g.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",g.onclick=k=>{k.stopPropagation(),Z({type:"invite",to:m.username,from:e.username,text:`${e.username} invited you to a Pong match!`}),E(`Invite sent to ${m.username}`)};const L=document.createElement("button");L.innerHTML="👤",L.title="View Profile",L.className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200",L.onclick=k=>{k.stopPropagation(),window.location.hash=`userSettings?user=${encodeURIComponent(m.username)}`},b.append(v,g,f,L),p.append(i,b),s.appendChild(p)})}}).catch(c=>{console.error("Failed to load users:",c),E("Failed to load user list"),s&&(s.innerHTML=`
          <div class="text-center text-red-500 py-4">
            Error loading users
          </div>
        `)});function u(){if(!t)return;if(!W){E("⚠️ Select a user first!");return}const c=t.value.trim();if(!c)return;const m={from:e.username,to:W,text:c,type:"direct",timestamp:new Date().toISOString()};Z(m),ce(m,!0),t.value=""}o.addEventListener("click",u),t.addEventListener("keypress",c=>{c.key==="Enter"&&u()}),t.focus()}function ce(e,t=!1){const o=document.getElementById("chat-messages");if(!o)return;const n=document.createElement("div");n.className=`flex ${t?"justify-end":"justify-start"} mb-4`;const s=document.createElement("div");s.className=`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${t?"bg-blue-500 text-white rounded-br-none":"bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"} shadow-sm`;const r=document.createElement("div");r.className=`text-xs font-semibold mb-1 ${t?"text-blue-100":"text-gray-500 dark:text-gray-400"}`,r.textContent=e.from;const d=document.createElement("div");d.className="text-sm break-words",d.textContent=e.text;const u=document.createElement("div");u.className=`text-xs mt-1 text-right ${t?"text-blue-100":"text-gray-500 dark:text-gray-400"}`,u.textContent=new Date(e.timestamp).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),s.appendChild(r),s.appendChild(d),s.appendChild(u),n.appendChild(s),o.appendChild(n),o.scrollTop=o.scrollHeight}function E(e){const t=document.getElementById("chat-messages");if(!t)return;const o=document.createElement("div");o.className="flex justify-center my-2";const n=document.createElement("div");n.className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full italic",n.textContent=`⚙️ ${e}`,o.appendChild(n),t.appendChild(o),t.scrollTop=t.scrollHeight}function ue(e){if(!e||typeof e!="object")return;const t=ae();if(!t)return;switch(e.type||"direct"){case"direct":e.to&&e.to.toLowerCase()===t.username.toLowerCase()&&ce({from:e.from||"Anonymous",text:e.text||"",timestamp:e.timestamp||new Date().toISOString()},!1);break;case"system":E(e.text);break;case"error":E(`❌ ${e.text}`);break;case"invite":e.to&&e.to.toLowerCase()===t.username.toLowerCase()&&E(`🏓 ${e.from} invited you to a Pong game!`);break;case"tournament":E(`🏆 Tournament update: ${e.text}`);break}}let a={difficulty:.05,mouse:!0,multiplayer:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!1};function je(){const e=document.getElementById("openSettings"),t=document.getElementById("closeSettings"),o=document.getElementById("controlPanel"),n=document.getElementById("paddleSpeed"),s=document.getElementById("paddleSpeedValue"),r=document.getElementById("ballSpeed"),d=document.getElementById("ballSpeedValue"),u=document.getElementById("scoreLimit"),c=document.getElementById("bgColor"),m=document.getElementById("itemsColor"),p=document.getElementById("resetSpeed"),i=document.getElementById("resetDefaults"),l=document.querySelectorAll('input[name="difficulty"]'),h=document.querySelectorAll('input[name="mouse"]'),b=document.querySelectorAll('input[name="multiplayer"]');function v(){l.forEach(g=>{g.checked=Number(g.value)===a.difficulty}),h.forEach(g=>{g.checked=g.value==="true"===a.mouse}),b.forEach(g=>{g.checked=g.value==="true"===a.multiplayer}),p.checked=a.resetSpeed,n.value=a.paddleSpeed.toString(),s.textContent=n.value,r.value=a.ballSpeed.toString(),d.textContent=r.value,u.value=a.scoreLimit.toString(),c.value=a.bgColor,m.value=a.itemsColor}function f(){l.forEach(g=>{g.addEventListener("change",()=>{a.difficulty=Number(g.value)})}),h.forEach(g=>{g.addEventListener("change",()=>{a.multiplayer===!1&&(a.mouse=g.value==="true")})}),b.forEach(g=>{g.addEventListener("change",()=>{a.multiplayer=g.value==="true",a.mouse=!1})}),p.addEventListener("change",()=>{a.resetSpeed=p.checked}),n.addEventListener("input",()=>{a.paddleSpeed=Number(n.value),s.textContent=n.value}),r.addEventListener("input",()=>{a.ballSpeed=Number(r.value),d.textContent=r.value}),u.addEventListener("input",()=>{const g=Number(u.value);g>0&&(a.scoreLimit=g)}),c.addEventListener("input",()=>{a.bgColor=c.value}),m.addEventListener("input",()=>{a.itemsColor=m.value}),i.addEventListener("click",()=>{a={...a,difficulty:.05,mouse:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!0},v()})}e?.addEventListener("click",()=>{v(),o?.classList.toggle("hidden")}),t?.addEventListener("click",()=>{o?.classList.add("hidden")}),f()}function ze(){if(!document.getElementById("stats-container"))return;const t=document.getElementById("fetchData"),o=document.getElementById("usernameInput"),n=document.getElementById("errorMessage"),s=document.getElementById("loading"),r=document.getElementById("infoUsername"),d=document.getElementById("infoEmail"),u=document.getElementById("winsCount"),c=document.getElementById("lossesCount"),m=document.getElementById("winRatio");async function p(h){s.style.display="block",n.style.display="none";try{const b=await fetch(`/stats/api/user-stats?username=${h}`),v=await fetch(`/stats/api/matches/${h}`);if(!b.ok||!v.ok)throw new Error("Invalid user");const f=await b.json(),g=await v.json();i(f,g)}catch(b){n.textContent=`Error: ${b.message}`,n.style.display="block"}finally{s.style.display="none"}}function i(h,b){r.textContent=h.username,d.textContent=h.email;let v=0,f=0;b.matches.forEach(g=>{g.winner===h.username?v++:g.loser===h.username&&f++}),u.textContent=String(v),c.textContent=String(f),m.textContent=`${(v/(v+f)*100||0).toFixed(1)}%`,l(b)}function l(h){const b=document.getElementById("matchHistoryGrid");if(b.innerHTML="",!h.matches||h.matches.length===0){b.innerHTML="<p>No matches yet</p>";return}h.matches.forEach(v=>{const f=document.createElement("div");f.classList.add("match-card"),f.innerHTML=`
        <h3>Match #${v.id}</h3>
        <div class="match-details">
          <span class="winner">${v.winner} (${v.winner_points})</span>
          <span class="vs">VS</span>
          <span class="loser">${v.loser} (${v.loser_points})</span>
        </div>
      `,b.appendChild(f)})}t.addEventListener("click",()=>{const h=o.value.trim();h?p(h):(n.textContent="Please enter a username",n.style.display="block")})}async function Ge(e,t,o){var n,s,r,d;e>t?(r=e,d=t,n="nome",o?s="guest_multiplayer":s="bot"):(r=t,d=e,s="nome",o?n="guest_multiplayer":n="bot");try{const u=await fetch("/stats/api/match",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({winner:n,loser:s,winner_points:r,loser_points:d})});if(!u.ok){const m=await u.json();console.error("Failed to save match:",m);return}return await u.json()}catch(u){console.error("Error saving match:",u)}}let ee=!1,te=!1;const w={START:"start",PLAYING:"playing",PAUSED:"paused",GAME_OVER:"gameOver"};let x=w.START,_=null,j=!1,z=!1,X=!1,Q=!1;window.addEventListener("keydown",e=>{(e.key==="w"||e.key==="W")&&(j=!0),(e.key==="s"||e.key==="S")&&(z=!0),e.key==="ArrowUp"&&(X=!0),e.key==="ArrowDown"&&(Q=!0)});window.addEventListener("keyup",e=>{(e.key==="w"||e.key==="W")&&(j=!1),(e.key==="s"||e.key==="S")&&(z=!1),e.key==="ArrowUp"&&(X=!1),e.key==="ArrowDown"&&(Q=!1)});function We(e){const t=document.getElementById("game-overlay"),o=document.getElementById("game-message");!t||!o||(o.textContent=e,t.classList.remove("hidden"))}function T(e,t){const o=document.getElementById("game-overlay"),n=document.getElementById("overlay-buttons");!o||!n||(n.innerHTML="",e===1&&t.forEach(s=>{const r=document.createElement("button");r.textContent=s.text,r.className="px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-green-600 							hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none hover:text-green-600",r.onclick=s.onClick,n.appendChild(r)}),e===2&&t.forEach(s=>{const r=document.createElement("button");r.textContent=s.text,r.className="w-35 px-8 py-2 text-white font-lucky text-lg rounded-lg shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-blue-600 							hover:shadow-blue-500/50 hover:shadow-2xl focus:outline-none hover:text-blue-600",r.onclick=s.onClick,n.appendChild(r)}),o.classList.remove("hidden"))}function I(){const e=document.getElementById("game-overlay");e&&e.classList.add("hidden")}function Ye(){tt();const{canvas:e,context:t}=Ke();if(!e||!t)return;const o={x:30,y:e.height/2-100/2,width:10,height:100,score:0},n={x:e.width-40,y:e.height/2-100/2,width:10,height:100,score:0},s={x:e.width/2,y:e.height/2,radius:10,velocityX:0,velocityY:0,speed:a.ballSpeed},r={x:e.width/2-1,y:0,width:2,height:10};o.y=e.height/2-o.height/2,n.y=e.height/2-n.height/2,s.x=e.width/2,s.y=e.height/2,s.velocityX=0,s.velocityY=0;const d=document.getElementById("pause-btn"),u=document.getElementById("openSettings"),c=i=>{Ve(i,e,o)};a.mouse&&!a.multiplayer&&e.addEventListener("mousemove",c),T(1,[{text:"Start",onClick:()=>{x=w.PLAYING,I(),O(s)}}]),d&&d.addEventListener("click",()=>{x===w.PLAYING&&(x=w.PAUSED,T(2,[{text:"Resume",onClick:()=>{x=w.PLAYING,I()}},{text:"Restart",onClick:()=>{H(e,o,n,s)}}]))}),u&&u.addEventListener("click",()=>{x===w.PLAYING&&(x=w.PAUSED,T(2,[{text:"Resume",onClick:()=>{x=w.PLAYING,I()}},{text:"Restart",onClick:()=>{H(e,o,n,s)}}]))}),window.addEventListener("keydown",i=>{i.code==="Space"&&(x===w.PLAYING?(x=w.PAUSED,T(2,[{text:"Resume",onClick:()=>{x=w.PLAYING,I()}},{text:"Restart",onClick:()=>{H(e,o,n,s)}}])):x===w.PAUSED?(x=w.PLAYING,I()):x===w.START&&(x=w.PLAYING,I(),O(s)))});function m(){if(x===w.START||x===w.PAUSED||x===w.GAME_OVER){oe(e,t,o,n,s,r);return}a.multiplayer&&qe(e,o,n),!a.multiplayer&&!a.mouse&&Je(e,o),et(e,o,n,s),oe(e,t,o,n,s,r)}function p(){(!a.mouse||a.multiplayer)&&e.removeEventListener("mousemove",c),m(),_=requestAnimationFrame(p)}_=requestAnimationFrame(p)}function Ve(e,t,o){const n=t.getBoundingClientRect();let s=e.clientY-n.top-o.height/2;s<0&&(s=0),s+o.height>t.height&&(s=t.height-o.height),o.y=s}function H(e,t,o,n){t.score=0,o.score=0,t.y=e.height/2-t.height/2,o.y=e.height/2-o.height/2,n.x=e.width/2,n.y=e.height/2,n.velocityX=0,n.velocityY=0,x=w.PLAYING,I(),O(n)}function O(e){let t=e.speed;ee===!1&&(t=a.ballSpeed,ee=!0);const o=Math.random()*Math.PI/2-Math.PI/4,n=Math.random()<.5?1:-1;e.velocityX=n*t*Math.cos(o),e.velocityY=t*Math.sin(o)}function qe(e,t,o){j&&(t.y-=a.paddleSpeed),z&&(t.y+=a.paddleSpeed),X&&(o.y-=a.paddleSpeed),Q&&(o.y+=a.paddleSpeed),t.y=Math.max(0,Math.min(t.y,e.height-t.height)),o.y=Math.max(0,Math.min(o.y,e.height-o.height))}function Je(e,t){j&&(t.y-=a.paddleSpeed),z&&(t.y+=a.paddleSpeed),t.y=Math.max(0,Math.min(t.y,e.height-t.height))}function Ke(){const e=document.getElementById("pong");return e?{canvas:e,context:e.getContext("2d")}:{canvas:null,context:null}}function R(e,t,o,n,s,r,d=!1,u="none"){e.fillStyle=r,e.fillRect(t,o,n,s),d&&(e.strokeStyle=u,e.lineWidth=2,e.strokeRect(0,0,n,s))}function me(e,t,o,n,s){e.fillStyle=s,e.beginPath(),e.arc(t,o,n,0,Math.PI*2,!1),e.closePath(),e.fill()}function ne(e,t,o,n,s){e.fillStyle=s,e.font="45px fantasy",e.fillText(t.toString(),o,n)}function Xe(e,t,o){me(t,o.x,0,30,a.itemsColor);for(let n=0;n<=e.height;n+=15)R(t,o.x,o.y+n,o.width,o.height,a.itemsColor)}function oe(e,t,o,n,s,r){R(t,0,0,e.width,e.height,a.bgColor,!0,a.itemsColor),Xe(e,t,r),ne(t,o.score,e.width/4,e.height/5,a.itemsColor),ne(t,n.score,3*e.width/4,e.height/5,a.itemsColor),R(t,o.x,o.y,o.width,o.height,a.itemsColor),R(t,n.x,n.y,n.width,n.height,a.itemsColor),me(t,s.x,s.y,s.radius,a.itemsColor)}function Qe(e,t){return e.top=e.y-e.radius,e.bottom=e.y+e.radius,e.left=e.x-e.radius,e.right=e.x+e.radius,t.top=t.y,t.bottom=t.y+t.height,t.left=t.x,t.right=t.x+t.width,e.right>t.left&&e.bottom>t.top&&e.left<t.right&&e.top<t.bottom}function se(e,t){t.x=e.width/2,t.y=e.height/2,a.resetSpeed&&(t.speed=a.ballSpeed),O(t)}function Ze(e,t,o){const n=t.y+t.height/2;t.y+=(o.y-n)*a.difficulty,t.y=Math.max(0,Math.min(t.y,e.height-t.height))}function et(e,t,o,n){n.x+=n.velocityX,n.y+=n.velocityY,a.multiplayer||Ze(e,o,n),n.y+n.radius>e.height?(n.y=e.height-n.radius,n.velocityY=-n.velocityY):n.y-n.radius<0&&(n.y=n.radius,n.velocityY=-n.velocityY);const s=n.x<e.width/2?t:o;if(Qe(n,s)){te===!1&&(n.speed=a.ballSpeed,te=!0);let r=n.y-(s.y+s.height/2);r=r/(s.height/2);const d=r*Math.PI/4,u=n.x<e.width/2?1:-1;n.velocityX=u*n.speed*Math.cos(d),n.velocityY=n.speed*Math.sin(d),n.speed+=.1,u===1?n.x=s.x+s.width+n.radius:n.x=s.x-n.radius}if(n.x-n.radius<0?(o.score++,se(e,n)):n.x+n.radius>e.width&&(t.score++,se(e,n)),t.score===a.scoreLimit||o.score===a.scoreLimit){x=w.GAME_OVER;let r;t.score===a.scoreLimit?r="PLAYER 1 WINS!!!":a.multiplayer?r="PLAYER 2 WINS!!!":r="PLAYER 1 LOSES!!!",T(1,[{text:"Restart",onClick:()=>{H(e,t,o,n)}}]),We(r),setTimeout(()=>{Ge(t.score,o.score,a.multiplayer)},16)}}function tt(){_!==null&&(cancelAnimationFrame(_),_=null)}const ge="https://pongpong.duckdns.org:3000";let N=null,D=null;function nt(){const e=document.getElementById("google-login-btn");e&&e.addEventListener("click",re),document.querySelectorAll(".google-login-modal").forEach(o=>{o.addEventListener("click",re)}),ot()}async function re(){try{const o=(window.screen.width-600)/2,n=(window.screen.height-600)/2;if(N=window.open(`${ge}/oauth/google`,"Google Login",`width=600,height=600,left=${o},top=${n},resizable=yes,scrollbars=yes,status=yes`),!N){alert("Popup blocked! Please allow popups for this site.");return}D=window.setInterval(()=>{N&&N.closed&&D&&(clearInterval(D),D=null)},500)}catch(e){console.error("Google OAuth error:",e),pe("Failed to initiate Google login. Please try again.")}}function ot(){const e=new URLSearchParams(window.location.search),t=e.get("oauth_token"),o=e.get("oauth_user");if(t&&o)try{const n=JSON.parse(decodeURIComponent(o));dt(t,n),window.history.replaceState({},document.title,window.location.pathname+window.location.hash);const s=document.getElementById("login-modal");s&&s.classList.add("hidden")}catch(n){console.error("Error processing OAuth callback:",n),pe("Failed to process login. Please try again.")}}function pe(e){const t=document.getElementById("login-message");t?(t.textContent=e,t.classList.remove("hidden")):alert(e)}async function st(){try{return(await(await fetch(`${ge}/oauth/config`)).json()).googleEnabled===!0}catch(e){return console.error("Error checking OAuth availability:",e),!1}}document.addEventListener("DOMContentLoaded",async()=>{const e=await st(),t=document.getElementById("google-login-btn");t&&(e?t.style.display="flex":t.style.display="none")});const rt=document.querySelector("#app"),V={sidebarOpen:!1};class at{constructor(){this._isLoggedIn=!1,this.listeners=[]}get isLoggedIn(){return this._isLoggedIn}get username(){return this._username}get avatarUrl(){return this._avatarUrl}setState(t){const o=this._isLoggedIn;let n=!1;t.isLoggedIn!==void 0&&t.isLoggedIn!==this._isLoggedIn&&(this._isLoggedIn=t.isLoggedIn,n=!0),t.username!==void 0&&t.username!==this._username&&(this._username=t.username,n=!0),t.avatarUrl!==void 0&&t.avatarUrl!==this._avatarUrl&&(this._avatarUrl=t.avatarUrl,n=!0),n&&(o!==this._isLoggedIn&&it(this._isLoggedIn),this.listeners.forEach(s=>s()))}subscribe(t){this.listeners.push(t)}}const M=new at;function it(e){e?(console.log("🔌 Initializing WebSocket for logged-in user..."),J(t=>{console.log("📥 WebSocket message received in main:",t),ue(t)})):(console.log("🔌 Disconnecting WebSocket - user logged out"),De())}function lt(e,t){localStorage.setItem("userSession",JSON.stringify({token:e,...t}))}function U(e){M.setState(e)}async function dt(e,t){lt(e,t),U({isLoggedIn:!0,username:t.username,avatarUrl:t.avatarUrl})}async function A(e){rt.innerHTML=`
    ${be}
    <main id="page-content" class="transition-all duration-300 pt-16 p-4">
      ${e}
    </main>
    ${Ee}
    ${Ce}
    ${Se}
    ${Be}
  `,Fe(),Te(),Oe(),Ye(),je(),ze(),le(),de(),nt()}async function he(){switch(window.location.hash.slice(1)||"home"){case"about":await A(ve);break;case"chat":await A(ye);break;case"contact":await A(we);break;case"stats":await A(xe);break;case"userSettings":await A(ke);break;default:await A(fe)}V.sidebarOpen=!1}window.addEventListener("error",e=>{console.error("🛑 Global error caught:",e.error)});window.addEventListener("unhandledrejection",e=>{console.error("🛑 Unhandled promise rejection:",e.reason)});window.addEventListener("DOMContentLoaded",async()=>{console.log("🚀 App initializing..."),await Ue()?(console.log("🔌 Initializing WebSocket for authenticated user..."),J(t=>{console.log("📥 WebSocket message received in main:",t),ue(t)})):console.log("🚫 No valid session, skipping WebSocket initialization"),await he()});window.addEventListener("hashchange",he);

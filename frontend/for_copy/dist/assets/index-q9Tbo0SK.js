(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=s(r);fetch(r.href,o)}})();const ee=`<main id="page-content" class="pt-16 flex-1">
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






 `,ne=`<nav class="bg-[#0E172B] text-[#242423] font-bold w-screen
			flex items-center justify-between fixed top-0 left-0 right-0 h-18 z-50" >
	<div class="flex gap-4 ml-7">
		<!-- <button id="menu-toggle" class="group cursor-pointer"> -->
			<label>
  				<div class="w-9 h-10 cursor-pointer flex flex-col items-center justify-center">
    				<input id="menu-toggle" class="hidden peer" type="checkbox" />
    				<div class="w-[70%] h-[2px] bg-[#F5CB5C] rounded-sm transition-all duration-300 origin-left translate-y-[0.63rem] peer-checked:rotate-[-45deg]"></div>
    				<div class="w-[70%] h-[2px] bg-[#F5CB5C] rounded-md transition-all duration-300 origin-center peer-checked:hidden"></div>
    				<div class="w-[70%] h-[2px] bg-[#F5CB5C] rounded-md transition-all duration-300 origin-left -translate-y-[0.63rem] peer-checked:rotate-[45deg]"></div>
  				</div>
			</label>
		<!-- </button> -->
	</div>
	<a href="#home"  class="flex items-center gap-2 ml-2 absolute left-1/2 transform -translate-x-1/2">
		<button class="flex items-center gap-2 p-2 cursor-pointer text-[#F5CB5C] text-5xl font-lucky">
			PONG
		</button>
	</a>
	<div id="user-section" class="flex gap-4 mr-7">
		<!-- Divided into 2 files -->
  	</div>
</nav>`,te=`<section class="bg-amber-400 w-full h-screen m-0 p-0">
  <h1 class="text-2xl font-bold">ABOUT</h1>
</section>`,se=`<section>
  <div class="p-4">
    <h2 class="text-xl font-bold">Chat</h2>
    <div id="chat-messages" class="border p-2 h-64 overflow-y-auto bg-gray-100"></div>
    <input id="chat-input" type="text" class="border p-2 w-full mt-2" placeholder="Type a message..." />
    <button id="chat-send" class="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Send</button>
  </div>
</section>`,re=`<section>
  <h1 class="text-2xl font-bold">CONTACT US!</h1>
</section>`,oe=`
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
</html>`,ie=`<section>
  <h1 class="text-2xl font-bold">USER SETTINGS</h1>
</section>`,ae=`<div id="login-modal" class="fixed inset-0 flex flex-col items-end justify-start mt-22 mr-4 h-screen hidden">
  <div class="w-full max-w-md bg-[#0E172B] border-1 border-[#F5CB5C] rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-[#F5CB5C] mb-4 ">Login</h2>
    <form id="login-form" class="flex flex-col">
      <input id="login-email" type="email" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-white transition ease-in-out duration-150" placeholder="Email address">
      <input id="login-password" type="password" class="bg-[#0E172B] text-white border-1 border-[#F5CB5C] rounded-md p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-white transition ease-in-out duration-150" placeholder="Password">
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
        <button type="button" id="forgotPass"  class="text-sm text-[#F5CB5C] hover:underline mb-0.5 cursor-pointer">Forgot password?</button>
        <p class="text-white mt-4"> Don't have an account? 
          <button id="open-signup" type="button" class="text-sm text-[#F5CB5C] -200 hover:underline mt-4 cursor-pointer">
            Signup
          </button>
        </p>
      </div>
      <button id="login-submit" type="submit" disabled class="bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] text-black font-bold py-2 px-4 rounded-md mt-4 transition ease-in-out duration-150 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:opacity-80">Login</button>
      <p id="login-message" class="text-sm text-red-500 mt-2 hidden"></p>
    </form>
  </div>
</div>
`,de=`<!-- From Uiverse.io by themrsami --> 
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
`,le=`<!-- Sidebar -->
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
`,ce=`<div id="controlPanel"
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
`,ue=`<!DOCTYPE html>
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
</html>`,pe=`<!-- <button id="open-login" class="px-4 py- border border-amber-400 rounded text-white hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
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
</button>`,me=`<!-- components/navLoggedin.html (tooltips use peer-hover so they show only on the specific button) -->
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





`,W=`<div class="flex flex-row gap-2 justify-center items-center">
    <div class="w-2 h-2 rounded-full bg-black animate-bounce"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.3s]"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.5s]"></div>
</div>`,he="/api/login";function fe(){const e=document.getElementById("login-modal"),t=document.getElementById("signup-modal"),s=document.getElementById("open-login"),n=document.getElementById("open-signup"),r=document.getElementById("login-form"),o=document.getElementById("login-email"),i=document.getElementById("login-password"),d=document.getElementById("login-submit"),l=document.getElementById("login-message");if(!e||!s||!r||!o||!i||!d){console.warn("Login modal setup failed: missing elements.");return}s.addEventListener("click",()=>{e.classList.toggle("hidden")}),e.addEventListener("click",y=>{y.target===e&&e.classList.add("hidden")}),n&&t&&n.addEventListener("click",()=>{e.classList.add("hidden"),t.classList.remove("hidden")});function p(){d.disabled=!(o.value.trim()&&i.value.trim())}o.addEventListener("input",p),i.addEventListener("input",p);function u(y){l&&(l.textContent=y,l.classList.remove("hidden"),l.classList.add("text-red-500"))}function f(){l&&l.classList.add("hidden")}r.addEventListener("submit",async y=>{y.preventDefault(),f();const h=d.innerHTML;d.innerHTML=W,d.disabled=!0;const b=new AbortController,g=setTimeout(()=>b.abort(),15e3);try{const m=await fetch(he,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o.value,password:i.value}),signal:b.signal});if(clearTimeout(g),!m.ok){u("Invalid email or password"),i.value="",p(),d.innerHTML=h,d.disabled=!1;return}const c=await m.json();K({isLoggedIn:!0,username:c.username,avatarUrl:c.avatarUrl}),e.classList.add("hidden"),o.value="",i.value="",d.innerHTML=h,d.disabled=!0}catch{b.signal.aborted?u("Login request timed out. Please try again."):u("An error occurred. Please try again."),d.innerHTML=h,d.disabled=!0}})}const ge="undefined/auth/register";function be(){const e=document.getElementById("signup-modal"),t=document.getElementById("open-login"),s=document.getElementById("signup-form"),n=document.getElementById("signup-username"),r=document.getElementById("signup-email"),o=document.getElementById("signup-comfirmEmail"),i=document.getElementById("signup-password"),d=document.getElementById("signup-confirmPassword"),l=s?.querySelector('button[type="submit"]');if(!e||!s||!n||!r||!o||!i||!d||!l){console.warn("Signup modal setup failed: missing elements.");return}function p(v){let C=v.nextElementSibling;return(!C||!C.classList.contains("error-msg"))&&(C=document.createElement("span"),C.className="error-msg text-red-500 text-sm block hidden",v.insertAdjacentElement("afterend",C)),C}const u=p(n),f=p(r),y=p(o),h=p(i),b=p(d);l.disabled=!0;function g(v){const C=v.length>=8,I=/[A-Z]/.test(v),L=/[0-9]/.test(v);return C&&I&&L}function m(v,C,I,L){C?(v.classList.remove("border-red-500","focus:ring-red-500"),v.classList.add("border-green-500","focus:ring-green-500"),L&&L.classList.add("hidden")):(v.classList.remove("border-green-500","focus:ring-green-500"),v.classList.add("border-red-500","focus:ring-red-500"),L&&I&&(L.textContent=I,L.classList.remove("hidden")))}function c(){let v=!0;n.value.trim().length===0?(m(n,!1,"Username is required.",u),v=!1):m(n,!0,"",u),r.value.trim().length===0?(m(r,!1,"Email is required.",f),v=!1):m(r,!0,"",f),o.value.trim()!==r.value.trim()||o.value.trim()===""?(m(o,!1,"Emails do not match.",y),v=!1):m(o,!0,"",y),g(i.value)?m(i,!0,"",h):(m(i,!1,"Password must be ≥ 8 chars, 1 uppercase & 1 number.",h),v=!1),d.value!==i.value||d.value===""?(m(d,!1,"Passwords do not match.",b),v=!1):m(d,!0,"",b),l.disabled=!v}n.addEventListener("input",c),r.addEventListener("input",c),o.addEventListener("input",c),i.addEventListener("input",c),d.addEventListener("input",c),t&&t.addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",v=>{v.target===e&&e.classList.add("hidden")}),s.addEventListener("submit",async v=>{v.preventDefault();const C=n.value.trim(),I=r.value.trim(),L=i.value.trim(),Z=l.innerHTML;l.innerHTML=W,l.disabled=!0;try{const U=new AbortController,Q=setTimeout(()=>U.abort(),15e3),z=await fetch(ge,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:C,email:I,password:L}),signal:U.signal});if(clearTimeout(Q),z.ok){const j=await z.json();console.log("Signup response:",j),K({username:C,avatarUrl:j.avatarUrl||"/default-avatar.png",isLoggedIn:!0}),e.classList.add("hidden"),console.log("Signup successful!")}else alert("Signup failed. Please try again."),i.value="",d.value=""}catch(U){console.error("Signup error:",U),alert("Network error or request timeout."),i.value="",d.value=""}finally{l.innerHTML=Z,l.disabled=!1}})}function ve(e,t="user-avatar"){const s=document.getElementById(t);s&&(s.src=`undefined/uploads/avatars/${e}?${Date.now()}`)}async function ye(e,t){if(e)try{const s=await e.arrayBuffer();console.log("Uploading avatar for",t,"size:",e.size);const n=performance.now(),r=await fetch(`undefined/uploads/upload-avatar/${t}`,{method:"POST",headers:{"Content-Type":"application/octet-stream"},body:s});if(console.log("Upload finished in",performance.now()-n,"ms"),!r.ok){console.error("❌ Upload failed:",await r.text());return}console.log("✅ Avatar uploaded successfully")}catch(s){console.error("Error uploading avatar:",s)}}async function xe(){const e=document.getElementById("user-section");if(!e){console.warn("⚠️ user-section not found in DOM");return}function t(){if(k.isLoggedIn){e.innerHTML=me;const s=document.getElementById("user-greeting");s&&(s.textContent=k.username||"User");const n=document.getElementById("user-avatar"),r=document.getElementById("default-avatar");n&&k.username?(ve(k.username,"user-avatar"),n.classList.remove("hidden"),r&&r.classList.add("hidden")):(n&&n.classList.add("hidden"),r&&r.classList.remove("hidden"));const o=document.getElementById("logout-btn");o&&o.addEventListener("click",()=>{k.setState({isLoggedIn:!1,username:void 0,avatarUrl:void 0})});const i=document.getElementById("settings-btn"),d=document.getElementById("settings-modal"),l=document.getElementById("settings-close");if(i&&d){i.addEventListener("click",u=>{u.stopPropagation(),d.classList.remove("hidden"),d.classList.add("opacity-100","pointer-events-auto")}),l&&l.addEventListener("click",()=>{d.classList.add("hidden"),d.classList.remove("opacity-100","pointer-events-auto")}),d.addEventListener("click",u=>{u.target===d&&(d.classList.add("hidden"),d.classList.remove("opacity-100","pointer-events-auto"))});const p=document.getElementById("avatar-upload");p&&p.addEventListener("change",async u=>{u.stopPropagation(),u.preventDefault();const f=p.files?.[0];if(f&&k.username){await ye(f,k.username);const y=Date.now(),h=void 0;["user-avatar","user-avatar-modal"].forEach(b=>{const g=document.getElementById(b),m=document.getElementById(b.replace("user-avatar","default-avatar"));g&&(g.src=`${h}/uploads/avatars/${k.username}?${y}`,g.classList.remove("hidden")),m&&m.classList.add("hidden")}),console.log("✅ Avatar refreshed successfully")}})}}else e.innerHTML=pe,fe(),be()}t(),k.subscribe(t)}function we(){const e=document.getElementById("menu-toggle"),t=document.getElementById("sidebar"),s=document.getElementById("page-content");!e||!t||!s||e.addEventListener("change",()=>{N.sidebarOpen=e.checked,N.sidebarOpen?(t.classList.remove("-translate-x-full"),s.classList.add("ml-48")):(t.classList.add("-translate-x-full"),s.classList.remove("ml-48"))})}let E=null;function q(e){const t=`ws://${window.location.hostname}:3000/ws`;return(!E||E.readyState===WebSocket.CLOSED||E.readyState===WebSocket.CLOSING)&&(E=new WebSocket(t),E.onopen=()=>{console.log("Connected to WebSocket:",t)},E.onclose=()=>{console.log("Disconnected from server!"),E=null},E.onerror=s=>{console.log("WebSocket error!",s),E=null}),E.onmessage=s=>{if(e)try{e(JSON.parse(s.data))}catch{console.warn("Received non-JSON message:",s.data)}},E}function Ee(e){E&&E.readyState===WebSocket.OPEN?E.send(JSON.stringify(e)):console.warn("WebSocket not connected!")}function Ce(){const e=localStorage.getItem("username");return e||(window.anonymousId||(window.anonymousId="Anonymous"+Math.floor(1e3+Math.random()*9e3)),window.anonymousId)}function ke(){const e=document.querySelector("#chat-input"),t=document.querySelector("#chat-send"),s=document.getElementById("chat-messages");if(s&&(s.innerHTML=""),q(n=>{if(s)if(console.log("Received message:",n),n.type==="chat"){const r=document.createElement("div");r.className="mb-2 p-2 rounded bg-gray-100";const o=n.username||"Anonymous",i=n.text||"";r.textContent=`${o}: ${i}`,s.appendChild(r),s.scrollTop=s.scrollHeight}else if(n.type==="welcome"){const r=document.createElement("div");r.className="mb-2 p-2 rounded bg-blue-100 text-blue-800",r.textContent=n.message,s.appendChild(r),s.scrollTop=s.scrollHeight}else console.warn("Unknown message type:",n)}),e&&t){const n=()=>{e.value.trim()&&(Ee({type:"chat",text:e.value.trim(),username:Ce()}),e.value="")};t.addEventListener("click",n),e.addEventListener("keypress",r=>{r.key==="Enter"&&n()})}}let a={difficulty:.05,mouse:!0,multiplayer:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!1};function Le(){const e=document.getElementById("openSettings"),t=document.getElementById("closeSettings"),s=document.getElementById("controlPanel"),n=document.getElementById("paddleSpeed"),r=document.getElementById("paddleSpeedValue"),o=document.getElementById("ballSpeed"),i=document.getElementById("ballSpeedValue"),d=document.getElementById("scoreLimit"),l=document.getElementById("bgColor"),p=document.getElementById("itemsColor"),u=document.getElementById("resetSpeed"),f=document.getElementById("resetDefaults"),y=document.querySelectorAll('input[name="difficulty"]'),h=document.querySelectorAll('input[name="mouse"]'),b=document.querySelectorAll('input[name="multiplayer"]');function g(){y.forEach(c=>{c.checked=Number(c.value)===a.difficulty}),h.forEach(c=>{c.checked=c.value==="true"===a.mouse}),b.forEach(c=>{c.checked=c.value==="true"===a.multiplayer}),u.checked=a.resetSpeed,n.value=a.paddleSpeed.toString(),r.textContent=n.value,o.value=a.ballSpeed.toString(),i.textContent=o.value,d.value=a.scoreLimit.toString(),l.value=a.bgColor,p.value=a.itemsColor}function m(){y.forEach(c=>{c.addEventListener("change",()=>{a.difficulty=Number(c.value)})}),h.forEach(c=>{c.addEventListener("change",()=>{a.multiplayer===!1&&(a.mouse=c.value==="true")})}),b.forEach(c=>{c.addEventListener("change",()=>{a.multiplayer=c.value==="true",a.mouse=!1})}),u.addEventListener("change",()=>{a.resetSpeed=u.checked}),n.addEventListener("input",()=>{a.paddleSpeed=Number(n.value),r.textContent=n.value}),o.addEventListener("input",()=>{a.ballSpeed=Number(o.value),i.textContent=o.value}),d.addEventListener("input",()=>{const c=Number(d.value);c>0&&(a.scoreLimit=c)}),l.addEventListener("input",()=>{a.bgColor=l.value}),p.addEventListener("input",()=>{a.itemsColor=p.value}),f.addEventListener("click",()=>{a={...a,difficulty:.05,mouse:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!0},g()})}e?.addEventListener("click",()=>{g(),s?.classList.toggle("hidden")}),t?.addEventListener("click",()=>{s?.classList.add("hidden")}),m()}function Be(){try{return JSON.parse(localStorage.getItem("userSession")||"null")}catch{return null}}function Se(){if(!document.getElementById("stats-container"))return;const t=document.getElementById("fetchData"),s=document.getElementById("usernameInput"),n=document.getElementById("errorMessage"),r=document.getElementById("loading"),o=document.getElementById("infoUsername"),i=document.getElementById("infoEmail"),d=document.getElementById("winsCount"),l=document.getElementById("lossesCount"),p=document.getElementById("winRatio");async function u(h){r.style.display="block",n.style.display="none";try{const b=await fetch(`/stats/api/user-stats?username=${h}`),g=await fetch(`/stats/api/matches/${h}`);if(!b.ok||!g.ok)throw new Error("Invalid user");const m=await b.json(),c=await g.json();f(m,c)}catch(b){n.textContent=`Error: ${b.message}`,n.style.display="block"}finally{r.style.display="none"}}function f(h,b){o.textContent=h.username,i.textContent=h.email;let g=0,m=0;b.matches.forEach(c=>{c.winner===h.username?g++:c.loser===h.username&&m++}),d.textContent=String(g),l.textContent=String(m),p.textContent=`${(g/(g+m)*100||0).toFixed(1)}%`,y(b)}function y(h){const b=document.getElementById("matchHistoryGrid");if(b.innerHTML="",!h.matches||h.matches.length===0){b.innerHTML="<p>No matches yet</p>";return}h.matches.forEach(g=>{const m=document.createElement("div");m.classList.add("match-card");const c=new Date(g.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});m.innerHTML=`
        <h3>Match #${g.id}</h3>
        <div class="match-date">${c}</div>
        <div class="match-details">
          <span class="winner">${g.winner} (${g.winner_points})</span>
          <span class="vs">VS</span>
          <span class="loser">${g.loser} (${g.loser_points})</span>
        </div>
      `,b.appendChild(m)})}t.addEventListener("click",()=>{const h=s.value.trim();h?u(h):(n.textContent="Please enter a username",n.style.display="block")})}async function Ie(e,t,s){const n=Be(),r=n.user.username,o=k.username;console.log("Debug - Session username:",r),console.log("Debug - SharedState username:",o),console.log("Debug - Full session:",n);const i=r;if(console.log("Debug - Final username to use:",i),!i){console.log("Match not saved: No user logged in");return}var d,l,p,u;e>t?(p=e,u=t,d=i,s?l="guest_multiplayer":l="bot"):(p=t,u=e,l=i,s?d="guest_multiplayer":d="bot");try{const f=await fetch("/stats/api/match",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({winner:d,loser:l,winner_points:p,loser_points:u})});if(!f.ok){const h=await f.json();console.error("Failed to save match:",h);return}const y=await f.json();return console.log("Match saved for user:",i),y}catch(f){console.error("Error saving match:",f)}}let O=!1,R=!1;const x={START:"start",PLAYING:"playing",PAUSED:"paused",GAME_OVER:"gameOver"};let w=x.START,M=null,T=!1,_=!1,H=!1,$=!1;window.addEventListener("keydown",e=>{(e.key==="w"||e.key==="W")&&(T=!0),(e.key==="s"||e.key==="S")&&(_=!0),e.key==="ArrowUp"&&(H=!0),e.key==="ArrowDown"&&($=!0)});window.addEventListener("keyup",e=>{(e.key==="w"||e.key==="W")&&(T=!1),(e.key==="s"||e.key==="S")&&(_=!1),e.key==="ArrowUp"&&(H=!1),e.key==="ArrowDown"&&($=!1)});function Fe(e){const t=document.getElementById("game-overlay"),s=document.getElementById("game-message");!t||!s||(s.textContent=e,t.classList.remove("hidden"))}function F(e,t){const s=document.getElementById("game-overlay"),n=document.getElementById("overlay-buttons");!s||!n||(n.innerHTML="",e===1&&t.forEach(r=>{const o=document.createElement("button");o.textContent=r.text,o.className="px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-green-600 							hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none hover:text-green-600",o.onclick=r.onClick,n.appendChild(o)}),e===2&&t.forEach(r=>{const o=document.createElement("button");o.textContent=r.text,o.className="w-35 px-8 py-2 text-white font-lucky text-lg rounded-lg shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-blue-600 							hover:shadow-blue-500/50 hover:shadow-2xl focus:outline-none hover:text-blue-600",o.onclick=r.onClick,n.appendChild(o)}),s.classList.remove("hidden"))}function S(){const e=document.getElementById("game-overlay");e&&e.classList.add("hidden")}function Me(){$e();const{canvas:e,context:t}=De();if(!e||!t)return;const s={x:30,y:e.height/2-100/2,width:10,height:100,score:0},n={x:e.width-40,y:e.height/2-100/2,width:10,height:100,score:0},r={x:e.width/2,y:e.height/2,radius:10,velocityX:0,velocityY:0,speed:a.ballSpeed},o={x:e.width/2-1,y:0,width:2,height:10};s.y=e.height/2-s.height/2,n.y=e.height/2-n.height/2,r.x=e.width/2,r.y=e.height/2,r.velocityX=0,r.velocityY=0;const i=document.getElementById("pause-btn"),d=document.getElementById("openSettings"),l=f=>{Ue(f,e,s)};a.mouse&&!a.multiplayer&&e.addEventListener("mousemove",l),F(1,[{text:"Start",onClick:()=>{w=x.PLAYING,S(),D(r)}}]),i&&i.addEventListener("click",()=>{w===x.PLAYING&&(w=x.PAUSED,F(2,[{text:"Resume",onClick:()=>{w=x.PLAYING,S()}},{text:"Restart",onClick:()=>{P(e,s,n,r)}}]))}),d&&d.addEventListener("click",()=>{w===x.PLAYING&&(w=x.PAUSED,F(2,[{text:"Resume",onClick:()=>{w=x.PLAYING,S()}},{text:"Restart",onClick:()=>{P(e,s,n,r)}}]))}),window.addEventListener("keydown",f=>{f.code==="Space"&&(w===x.PLAYING?(w=x.PAUSED,F(2,[{text:"Resume",onClick:()=>{w=x.PLAYING,S()}},{text:"Restart",onClick:()=>{P(e,s,n,r)}}])):w===x.PAUSED?(w=x.PLAYING,S()):w===x.START&&(w=x.PLAYING,S(),D(r)))});function p(){if(w===x.START||w===x.PAUSED||w===x.GAME_OVER){G(e,t,s,n,r,o);return}a.multiplayer&&Pe(e,s,n),!a.multiplayer&&!a.mouse&&Ae(e,s),He(e,s,n,r),G(e,t,s,n,r,o)}function u(){(!a.mouse||a.multiplayer)&&e.removeEventListener("mousemove",l),p(),M=requestAnimationFrame(u)}M=requestAnimationFrame(u)}function Ue(e,t,s){const n=t.getBoundingClientRect();let r=e.clientY-n.top-s.height/2;r<0&&(r=0),r+s.height>t.height&&(r=t.height-s.height),s.y=r}function P(e,t,s,n){t.score=0,s.score=0,t.y=e.height/2-t.height/2,s.y=e.height/2-s.height/2,n.x=e.width/2,n.y=e.height/2,n.velocityX=0,n.velocityY=0,w=x.PLAYING,S(),D(n)}function D(e){let t=e.speed;O===!1&&(t=a.ballSpeed,O=!0);const s=Math.random()*Math.PI/2-Math.PI/4,n=Math.random()<.5?1:-1;e.velocityX=n*t*Math.cos(s),e.velocityY=t*Math.sin(s)}function Pe(e,t,s){T&&(t.y-=a.paddleSpeed),_&&(t.y+=a.paddleSpeed),H&&(s.y-=a.paddleSpeed),$&&(s.y+=a.paddleSpeed),t.y=Math.max(0,Math.min(t.y,e.height-t.height)),s.y=Math.max(0,Math.min(s.y,e.height-s.height))}function Ae(e,t){T&&(t.y-=a.paddleSpeed),_&&(t.y+=a.paddleSpeed),t.y=Math.max(0,Math.min(t.y,e.height-t.height))}function De(){const e=document.getElementById("pong");return e?{canvas:e,context:e.getContext("2d")}:{canvas:null,context:null}}function A(e,t,s,n,r,o,i=!1,d="none"){e.fillStyle=o,e.fillRect(t,s,n,r),i&&(e.strokeStyle=d,e.lineWidth=2,e.strokeRect(0,0,n,r))}function J(e,t,s,n,r){e.fillStyle=r,e.beginPath(),e.arc(t,s,n,0,Math.PI*2,!1),e.closePath(),e.fill()}function Y(e,t,s,n,r){e.fillStyle=r,e.font="45px fantasy",e.fillText(t.toString(),s,n)}function Te(e,t,s){J(t,s.x,0,30,a.itemsColor);for(let n=0;n<=e.height;n+=15)A(t,s.x,s.y+n,s.width,s.height,a.itemsColor)}function G(e,t,s,n,r,o){A(t,0,0,e.width,e.height,a.bgColor,!0,a.itemsColor),Te(e,t,o),Y(t,s.score,e.width/4,e.height/5,a.itemsColor),Y(t,n.score,3*e.width/4,e.height/5,a.itemsColor),A(t,s.x,s.y,s.width,s.height,a.itemsColor),A(t,n.x,n.y,n.width,n.height,a.itemsColor),J(t,r.x,r.y,r.radius,a.itemsColor)}function _e(e,t){return e.top=e.y-e.radius,e.bottom=e.y+e.radius,e.left=e.x-e.radius,e.right=e.x+e.radius,t.top=t.y,t.bottom=t.y+t.height,t.left=t.x,t.right=t.x+t.width,e.right>t.left&&e.bottom>t.top&&e.left<t.right&&e.top<t.bottom}function V(e,t){t.x=e.width/2,t.y=e.height/2,a.resetSpeed&&(t.speed=a.ballSpeed),D(t)}function Ne(e,t,s){const n=t.y+t.height/2;t.y+=(s.y-n)*a.difficulty,t.y=Math.max(0,Math.min(t.y,e.height-t.height))}function He(e,t,s,n){n.x+=n.velocityX,n.y+=n.velocityY,a.multiplayer||Ne(e,s,n),n.y+n.radius>e.height?(n.y=e.height-n.radius,n.velocityY=-n.velocityY):n.y-n.radius<0&&(n.y=n.radius,n.velocityY=-n.velocityY);const r=n.x<e.width/2?t:s;if(_e(n,r)){R===!1&&(n.speed=a.ballSpeed,R=!0);let o=n.y-(r.y+r.height/2);o=o/(r.height/2);const i=o*Math.PI/4,d=n.x<e.width/2?1:-1;n.velocityX=d*n.speed*Math.cos(i),n.velocityY=n.speed*Math.sin(i),n.speed+=.1,d===1?n.x=r.x+r.width+n.radius:n.x=r.x-n.radius}if(n.x-n.radius<0?(s.score++,V(e,n)):n.x+n.radius>e.width&&(t.score++,V(e,n)),t.score===a.scoreLimit||s.score===a.scoreLimit){w=x.GAME_OVER;let o;t.score===a.scoreLimit?o="PLAYER 1 WINS!!!":a.multiplayer?o="PLAYER 2 WINS!!!":o="PLAYER 1 LOSES!!!",F(1,[{text:"Restart",onClick:()=>{P(e,t,s,n)}}]),Fe(o),setTimeout(()=>{Ie(t.score,s.score,a.multiplayer)},16)}}function $e(){M!==null&&(cancelAnimationFrame(M),M=null)}function ze(){const e=document.getElementById("friendInput"),t=document.getElementById("addFriendBtn"),s=document.getElementById("friendsList");let n=document.getElementById("friendsErrorMessage");if(n||(n=document.createElement("div"),n.id="friendsErrorMessage",n.style.cssText=`
      color: red;
      margin: 10px 0;
      padding: 10px;
      border-radius: 5px;
      background-color: #ffe6e6;
      border: 1px solid #ffcccc;
      min-height: 20px;
    `,s&&s.parentNode&&s.parentNode.insertBefore(n,s)),!e||!t||!s){console.error("Friends page elements not found");return}function r(l){n.textContent=l,n.style.display="block",setTimeout(()=>{n.textContent="",n.style.display="none"},5e3)}function o(){n.textContent="",n.style.display="none"}async function i(){const l=k.username;if(!l){s.innerHTML='<li class="no-friends-message">Please log in to see your friends.</li>';return}try{const p=await fetch(`/stats/api/friends/${l}`),u=await p.json();if(!p.ok)throw new Error(u.error||"Failed to fetch friends");if(s.innerHTML="",u.friends.length===0){s.innerHTML='<li class="no-friends-message">No friends yet. Add some friends to get started!</li>';return}u.friends.forEach(f=>{const y=document.createElement("li");y.innerHTML=`
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${f.status==="online"?"#4CAF50":"#f44336"};"></div>
            <span>${f.username}</span>
            <small style="color: #666;">(${f.status})</small>
          </div>
        `,s.appendChild(y)})}catch(p){console.error(p),r("Error loading friends")}}async function d(){const l=k.username;if(!l){r("You must be logged in to add friends.");return}const p=e.value.trim();if(!p){r("Please enter a username");return}o();try{const u=await fetch(`/stats/api/friends/${l}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({friendUsername:p})}),f=await u.json();if(!u.ok){r(f.error||"Failed to add friend");return}e.value="",i()}catch(u){console.error(u),r("Error adding friend")}}t.addEventListener("click",d),e.addEventListener("input",o),i()}const je=document.querySelector("#app"),N={sidebarOpen:!1};class Oe{constructor(){this._isLoggedIn=!1,this.listeners=[]}get isLoggedIn(){return this._isLoggedIn}get username(){return this._username}get avatarUrl(){return this._avatarUrl}setState(t){let s=!1;t.isLoggedIn!==void 0&&t.isLoggedIn!==this._isLoggedIn&&(this._isLoggedIn=t.isLoggedIn,s=!0),t.username!==void 0&&t.username!==this._username&&(this._username=t.username,s=!0),t.avatarUrl!==void 0&&t.avatarUrl!==this._avatarUrl&&(this._avatarUrl=t.avatarUrl,s=!0),s&&this.listeners.forEach(n=>n())}subscribe(t){this.listeners.push(t)}}const k=new Oe;function K(e){k.setState(e)}async function B(e){je.innerHTML=`
    ${ne}
    <main id="page-content" class="transition-all duration-300 pt-16 p-4">
      ${e}
    </main>
    ${ae}
    ${de}
    ${le}
    ${ce}
  `,xe(),we(),q(t=>{const s=document.getElementById("chat-messages");if(!s)return;const n=document.createElement("div"),r=o=>{if(o==null)return"";if(typeof o=="string")try{const i=JSON.parse(o);return String(i&&typeof i=="object"?i.chat??i.message??JSON.stringify(i):i)}catch{return o}if(typeof o=="object"){const i=o;return String(i.chat??i.message??JSON.stringify(i))}return String(o)};n.textContent=r(t),s.appendChild(n),s.scrollTop=s.scrollHeight}),ke(),Me(),Le(),Se(),ze()}function X(){switch(window.location.hash.slice(1)||"home"){case"about":B(te);break;case"chat":B(se);break;case"contact":B(re);break;case"stats":B(oe);break;case"userSettings":B(ie);break;case"friends":B(ue);break;default:B(ee)}N.sidebarOpen=!1}window.addEventListener("DOMContentLoaded",X);window.addEventListener("hashchange",X);

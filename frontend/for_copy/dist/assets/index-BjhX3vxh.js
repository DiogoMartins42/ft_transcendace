(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function o(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(s){if(s.ep)return;s.ep=!0;const r=o(s);fetch(s.href,r)}})();const Z=`<main id="page-content" class="pt-16 flex-1">
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






 `,Q=`<nav class="bg-[#0E172B] text-[#242423] font-bold w-screen
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
</nav>`,ee=`<section class="bg-amber-400 w-full h-screen m-0 p-0">
  <h1 class="text-2xl font-bold">ABOUT</h1>
</section>`,te=`<section>
  <h1 class="text-2xl font-bold">CHAT</h1>
  <div class="p-4">
    <h2 class="text-xl font-bold">Chat</h2>
    <div id="chat-messages" class="border p-2 h-64 overflow-y-auto bg-gray-100"></div>
    <input id="chat-input" type="text" class="border p-2 w-full mt-2" placeholder="Type a message..." />
    <button id="chat-send" class="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Send</button>
  </div>
</section>`,ne=`<section>
  <h1 class="text-2xl font-bold">CONTACT US!</h1>
</section>`,oe=`<!DOCTYPE html> <!-- Remove when merging -->

<!-- <section>
  <h1 class="text-2xl font-bold">STATS</h1>
</section> -->

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
            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
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
</html>`,se=`<section>
  <h1 class="text-2xl font-bold">USER SETTINGS</h1>
</section>`,re=`<div id="login-modal" class="fixed inset-0 flex flex-col items-end justify-start mt-22 mr-4 h-screen hidden">
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
`,ae=`<!-- From Uiverse.io by themrsami --> 
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
`,ie=`<!-- Sidebar -->
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
`,le=`<div id="controlPanel"
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
`,de=`<!-- <button id="open-login" class="px-4 py- border border-amber-400 rounded text-white hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
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
</button>`,ce=`<!-- components/navLoggedin.html (tooltips use peer-hover so they show only on the specific button) -->
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





`,$=`<div class="flex flex-row gap-2 justify-center items-center">
    <div class="w-2 h-2 rounded-full bg-black animate-bounce"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.3s]"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.5s]"></div>
</div>`,ue="http://localhost:3000/auth/login";function pe(){const e=document.getElementById("login-modal"),n=document.getElementById("signup-modal"),o=document.getElementById("open-login"),t=document.getElementById("open-signup"),s=document.getElementById("login-form"),r=document.getElementById("login-email"),l=document.getElementById("login-password"),i=document.getElementById("login-submit"),u=document.getElementById("login-message");if(!e||!o||!s||!r||!l||!i){console.warn("Login modal setup failed: missing elements.");return}o.addEventListener("click",()=>{e.classList.toggle("hidden")}),e.addEventListener("click",c=>{c.target===e&&e.classList.add("hidden")}),t&&n&&t.addEventListener("click",()=>{e.classList.add("hidden"),n.classList.remove("hidden")});function b(){r.value.trim()&&l.value.trim()?i.disabled=!1:i.disabled=!0}r.addEventListener("input",b),l.addEventListener("input",b);function x(c){u&&(u.textContent=c,u.classList.remove("hidden"),u.classList.toggle("text-red-500"))}function C(){u&&u.classList.add("hidden")}s.addEventListener("submit",async c=>{c.preventDefault(),C();const g=i.innerHTML;i.innerHTML=`${$}`,i.disabled=!0;const h=new AbortController,m=setTimeout(()=>h.abort(),15e3);try{const d=await fetch(ue,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r.value,password:l.value}),signal:h.signal});if(clearTimeout(m),!d.ok){x("Invalid email or password"),l.value="",b(),i.innerHTML=g,i.disabled=!1;return}const p=await d.json();y.isLoggedIn=!0,y.username=p.username,y.avatarUrl=p.avatarUrl,e.classList.add("hidden"),r.value="",l.value="",i.innerHTML=g,i.disabled=!0}catch{h.signal.aborted?(x("Login request timed out. Please try again."),r.value="",l.value=""):x("An error occurred. Please try again."),i.innerHTML=g,i.disabled=!0}}),document.getElementById("forgotPass").addEventListener("click",()=>{y.isLoggedIn=!0,e.classList.add("hidden")})}const me="http://localhost:3000/auth/register";function he(){const e=document.getElementById("signup-modal"),n=document.getElementById("open-login"),o=document.getElementById("signup-form"),t=document.getElementById("signup-username"),s=document.getElementById("signup-email"),r=document.getElementById("signup-comfirmEmail"),l=document.getElementById("signup-password"),i=document.getElementById("signup-confirmPassword"),u=o?.querySelector('button[type="submit"]');if(!e||!o||!t||!s||!r||!l||!i||!u){console.warn("Signup modal setup failed: missing elements.");return}function b(p){let w=p.nextElementSibling;return(!w||!w.classList.contains("error-msg"))&&(w=document.createElement("span"),w.className="error-msg text-red-500 text-sm block hidden",p.insertAdjacentElement("afterend",w)),w}const x=b(t),C=b(s),B=b(r),c=b(l),g=b(i);u.disabled=!0;function h(p){const w=p.length>=8,S=/[A-Z]/.test(p),E=/[0-9]/.test(p);return w&&S&&E}function m(p,w,S,E){w?(p.classList.remove("border-red-500","focus:ring-red-500"),p.classList.add("border-green-500","focus:ring-green-500"),E&&E.classList.add("hidden")):(p.classList.remove("border-green-500","focus:ring-green-500"),p.classList.add("border-red-500","focus:ring-red-500"),E&&S&&(E.textContent=S,E.classList.remove("hidden")))}function d(){let p=!0;t.value.trim().length===0?(m(t,!1,"Username is required.",x),p=!1):m(t,!0,"",x),s.value.trim().length===0?(m(s,!1,"Email is required.",C),p=!1):m(s,!0,"",C),r.value.trim()!==s.value.trim()||r.value.trim()===""?(m(r,!1,"Emails do not match.",B),p=!1):m(r,!0,"",B),h(l.value)?m(l,!0,"",c):(m(l,!1,"Password must be ≥ 8 chars, 1 uppercase & 1 number.",c),p=!1),i.value!==l.value||i.value===""?(m(i,!1,"Passwords do not match.",g),p=!1):m(i,!0,"",g),u.disabled=!p}t.addEventListener("input",d),s.addEventListener("input",d),r.addEventListener("input",d),l.addEventListener("input",d),i.addEventListener("input",d),n&&n.addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",p=>{p.target===e&&e.classList.add("hidden")}),o.addEventListener("submit",async p=>{p.preventDefault();const w=t.value.trim(),S=s.value.trim(),E=l.value.trim(),J=u.innerHTML;u.innerHTML=$,u.disabled=!0;try{const P=new AbortController,K=setTimeout(()=>P.abort(),15e3),R=await fetch(me,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:w,email:S,password:E}),signal:P.signal});if(clearTimeout(K),R.ok){const X=await R.json();console.log("Signup response:",X),y.isLoggedIn=!0,y.username=w,y.avatarUrl="/default-avatar.png",e.classList.add("hidden"),console.log("Signup successful!")}else alert("Signup failed. Please try again."),l.value="",i.value=""}catch(P){console.error("Signup error:",P),alert("Network error or request timeout."),l.value="",i.value=""}finally{u.innerHTML=J,u.disabled=!1}})}async function ge(){const e=document.getElementById("user-section");if(!e){console.warn("⚠️ user-section not found in DOM");return}function n(){if(y.isLoggedIn){e.innerHTML=ce;const o=document.getElementById("user-greeting");o&&(o.textContent=y.username?` ${y.username}`:" User");const t=document.getElementById("user-avatar"),s=document.getElementById("default-avatar"),r=document.getElementById("user-avatar-modal"),l=document.getElementById("default-avatar-modal");y.avatarUrl?(t&&(t.src=y.avatarUrl,t.classList.remove("hidden")),s&&s.classList.add("hidden"),r&&(r.src=y.avatarUrl,r.classList.remove("hidden")),l&&l.classList.add("hidden")):(t&&t.classList.add("hidden"),s&&s.classList.remove("hidden"),r&&r.classList.add("hidden"),l&&l.classList.remove("hidden"));const i=document.getElementById("logout-btn");i&&i.addEventListener("click",()=>{y.isLoggedIn=!1,y.username=void 0,y.avatarUrl=void 0})}else e.innerHTML=de,pe(),he()}n(),y.subscribe&&y.subscribe(n)}function fe(){const e=document.getElementById("menu-toggle"),n=document.getElementById("sidebar"),o=document.getElementById("page-content");!e||!n||!o||e.addEventListener("change",()=>{U.sidebarOpen=e.checked,U.sidebarOpen?(n.classList.remove("-translate-x-full"),o.classList.add("ml-48")):(n.classList.add("-translate-x-full"),o.classList.remove("ml-48"))})}let k=null;function be(e){const n="ws://localhost:3000/ws";return k=new WebSocket(n),k.onopen=()=>{console.log("Connected to WebSocket:",n),V({type:"connection",text:"Hello from frontend!"})},k.onmessage=o=>{if(console.log("Message from server:",o.data),e)try{const t=JSON.parse(o.data);e(t),t.type==="welcome"?console.log("✅",t.message):t.type==="chat"&&console.log("💬",t.text)}catch{console.warn("Received non-json message:",o.data)}},k.onclose=()=>{console.log("Disconnected from server!")},k.onerror=o=>{console.log("WebSocket error!",o)},k}function V(e){k&&k.readyState===WebSocket.OPEN?k.send(JSON.stringify(e)):console.warn("WebSocket not connected!")}function ve(){const e=document.querySelector("#chat-input"),n=document.querySelector("#chat-send");e&&n&&n.addEventListener("click",()=>{e.value.trim()&&(V({type:"chat",text:e.value}),e.value="")})}let a={difficulty:.05,mouse:!0,multiplayer:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!1};function ye(){const e=document.getElementById("openSettings"),n=document.getElementById("closeSettings"),o=document.getElementById("controlPanel"),t=document.getElementById("paddleSpeed"),s=document.getElementById("paddleSpeedValue"),r=document.getElementById("ballSpeed"),l=document.getElementById("ballSpeedValue"),i=document.getElementById("scoreLimit"),u=document.getElementById("bgColor"),b=document.getElementById("itemsColor"),x=document.getElementById("resetSpeed"),C=document.getElementById("resetDefaults"),B=document.querySelectorAll('input[name="difficulty"]'),c=document.querySelectorAll('input[name="mouse"]'),g=document.querySelectorAll('input[name="multiplayer"]');function h(){B.forEach(d=>{d.checked=Number(d.value)===a.difficulty}),c.forEach(d=>{d.checked=d.value==="true"===a.mouse}),g.forEach(d=>{d.checked=d.value==="true"===a.multiplayer}),x.checked=a.resetSpeed,t.value=a.paddleSpeed.toString(),s.textContent=t.value,r.value=a.ballSpeed.toString(),l.textContent=r.value,i.value=a.scoreLimit.toString(),u.value=a.bgColor,b.value=a.itemsColor}function m(){B.forEach(d=>{d.addEventListener("change",()=>{a.difficulty=Number(d.value)})}),c.forEach(d=>{d.addEventListener("change",()=>{a.multiplayer===!1&&(a.mouse=d.value==="true")})}),g.forEach(d=>{d.addEventListener("change",()=>{a.multiplayer=d.value==="true",a.mouse=!1})}),x.addEventListener("change",()=>{a.resetSpeed=x.checked}),t.addEventListener("input",()=>{a.paddleSpeed=Number(t.value),s.textContent=t.value}),r.addEventListener("input",()=>{a.ballSpeed=Number(r.value),l.textContent=r.value}),i.addEventListener("input",()=>{const d=Number(i.value);d>0&&(a.scoreLimit=d)}),u.addEventListener("input",()=>{a.bgColor=u.value}),b.addEventListener("input",()=>{a.itemsColor=b.value}),C.addEventListener("click",()=>{a={...a,difficulty:.05,mouse:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!0},h()})}e?.addEventListener("click",()=>{h(),o?.classList.toggle("hidden")}),n?.addEventListener("click",()=>{o?.classList.add("hidden")}),m()}function xe(){if(!document.getElementById("stats-container"))return;console.log("Stats Script loaded");const n=document.getElementById("fetchData"),o=document.getElementById("usernameInput"),t=document.getElementById("errorMessage"),s=document.getElementById("loading"),r=document.getElementById("infoUsername"),l=document.getElementById("infoEmail"),i=document.getElementById("winsCount"),u=document.getElementById("lossesCount"),b=document.getElementById("winRatio");async function x(c){s.style.display="block",t.style.display="none";try{const g=await fetch(`/stats/api/user-stats?username=${c}`),h=await fetch(`/stats/api/matches/${c}`);if(!g.ok||!h.ok)throw new Error("Invalid user");const m=await g.json(),d=await h.json();C(m,d)}catch(g){t.textContent=`Error: ${g.message}`,t.style.display="block"}finally{s.style.display="none"}}function C(c,g){r.textContent=c.username,l.textContent=c.email;let h=0,m=0;g.matches.forEach(d=>{d.winner===c.username?h++:d.loser===c.username&&m++}),i.textContent=String(h),u.textContent=String(m),b.textContent=`${(h/(h+m)*100||0).toFixed(1)}%`,B(g)}function B(c){const g=document.getElementById("matchHistoryGrid");if(g.innerHTML="",!c.matches||c.matches.length===0){g.innerHTML="<p>No matches yet</p>";return}c.matches.forEach(h=>{const m=document.createElement("div");m.classList.add("match-card"),m.innerHTML=`
        <h3>Match #${h.id}</h3>
        <div class="match-details">
          <span class="winner">${h.winner} (${h.winner_points})</span>
          <span class="vs">VS</span>
          <span class="loser">${h.loser} (${h.loser_points})</span>
        </div>
      `,g.appendChild(m)})}n.addEventListener("click",()=>{const c=o.value.trim();c?x(c):(t.textContent="Please enter a username",t.style.display="block")})}async function we(e,n,o){var t,s,r,l;e>n?(r=e,l=n,t="nome",o?s="guest_multiplayer":s="bot"):(r=n,l=e,s="nome",o?t="guest_multiplayer":t="bot");try{const i=await fetch("/stats/api/match",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({winner:t,loser:s,winner_points:r,loser_points:l})});if(!i.ok){const b=await i.json();console.error("Failed to save match:",b);return}return await i.json()}catch(i){console.error("Error saving match:",i)}}let O=!1,j=!1;const f={START:"start",PLAYING:"playing",PAUSED:"paused",GAME_OVER:"gameOver"};let v=f.START,A=!1,T=!1,H=!1,N=!1;window.addEventListener("keydown",e=>{(e.key==="w"||e.key==="W")&&(A=!0),(e.key==="s"||e.key==="S")&&(T=!0),e.key==="ArrowUp"&&(H=!0),e.key==="ArrowDown"&&(N=!0)});window.addEventListener("keyup",e=>{(e.key==="w"||e.key==="W")&&(A=!1),(e.key==="s"||e.key==="S")&&(T=!1),e.key==="ArrowUp"&&(H=!1),e.key==="ArrowDown"&&(N=!1)});function Ce(e){const n=document.getElementById("game-overlay"),o=document.getElementById("game-message");!n||!o||(o.textContent=e,n.classList.remove("hidden"))}function M(e,n){const o=document.getElementById("game-overlay"),t=document.getElementById("overlay-buttons");!o||!t||(t.innerHTML="",e===1&&n.forEach(s=>{const r=document.createElement("button");r.textContent=s.text,r.className="px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-green-600 							hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none hover:text-green-600",r.onclick=s.onClick,t.appendChild(r)}),e===2&&n.forEach(s=>{const r=document.createElement("button");r.textContent=s.text,r.className="w-35 px-8 py-2 text-white font-lucky text-lg rounded-lg shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-blue-600 							hover:shadow-blue-500/50 hover:shadow-2xl focus:outline-none hover:text-blue-600",r.onclick=s.onClick,t.appendChild(r)}),o.classList.remove("hidden"))}function L(){const e=document.getElementById("game-overlay");e&&e.classList.add("hidden")}function Ee(){const{canvas:e,context:n}=Se();if(!e||!n)return;const o={x:30,y:e.height/2-100/2,width:10,height:100,score:0},t={x:e.width-40,y:e.height/2-100/2,width:10,height:100,score:0},s={x:e.width/2,y:e.height/2,radius:10,velocityX:0,velocityY:0,speed:a.ballSpeed},r={x:e.width/2-1,y:0,width:2,height:10};o.y=e.height/2-o.height/2,t.y=e.height/2-t.height/2,s.x=e.width/2,s.y=e.height/2,s.velocityX=0,s.velocityY=0;const l=document.getElementById("pause-btn"),i=document.getElementById("openSettings"),u=C=>{ke(C,e,o)};a.mouse&&!a.multiplayer&&e.addEventListener("mousemove",u),M(1,[{text:"Start",onClick:()=>{v=f.PLAYING,L(),_(s)}}]),l&&l.addEventListener("click",()=>{v===f.PLAYING&&(v=f.PAUSED,M(2,[{text:"Resume",onClick:()=>{v=f.PLAYING,L()}},{text:"Restart",onClick:()=>{F(e,o,t,s)}}]))}),i&&i.addEventListener("click",()=>{v===f.PLAYING&&(v=f.PAUSED,M(2,[{text:"Resume",onClick:()=>{v=f.PLAYING,L()}},{text:"Restart",onClick:()=>{F(e,o,t,s)}}]))}),window.addEventListener("keydown",C=>{C.code==="Space"&&(v===f.PLAYING?(v=f.PAUSED,M(2,[{text:"Resume",onClick:()=>{v=f.PLAYING,L()}},{text:"Restart",onClick:()=>{F(e,o,t,s)}}])):v===f.PAUSED?(v=f.PLAYING,L()):v===f.START&&(v=f.PLAYING,L(),_(s)))});function b(){if(v===f.START||v===f.PAUSED||v===f.GAME_OVER){Y(e,n,o,t,s,r);return}a.multiplayer&&Be(e,o,t),!a.multiplayer&&!a.mouse&&Le(e,o),Fe(e,o,t,s),Y(e,n,o,t,s,r)}function x(){(!a.mouse||a.multiplayer)&&e.removeEventListener("mousemove",u),b(),requestAnimationFrame(x)}requestAnimationFrame(x)}function ke(e,n,o){const t=n.getBoundingClientRect();let s=e.clientY-t.top-o.height/2;s<0&&(s=0),s+o.height>n.height&&(s=n.height-o.height),o.y=s}function F(e,n,o,t){n.score=0,o.score=0,n.y=e.height/2-n.height/2,o.y=e.height/2-o.height/2,t.x=e.width/2,t.y=e.height/2,t.velocityX=0,t.velocityY=0,v=f.PLAYING,L(),_(t)}function _(e){let n=e.speed;O===!1&&(n=a.ballSpeed,O=!0);const o=Math.random()*Math.PI/2-Math.PI/4,t=Math.random()<.5?1:-1;e.velocityX=t*n*Math.cos(o),e.velocityY=n*Math.sin(o)}function Be(e,n,o){A&&(n.y-=a.paddleSpeed),T&&(n.y+=a.paddleSpeed),H&&(o.y-=a.paddleSpeed),N&&(o.y+=a.paddleSpeed),n.y=Math.max(0,Math.min(n.y,e.height-n.height)),o.y=Math.max(0,Math.min(o.y,e.height-o.height))}function Le(e,n){A&&(n.y-=a.paddleSpeed),T&&(n.y+=a.paddleSpeed),n.y=Math.max(0,Math.min(n.y,e.height-n.height))}function Se(){const e=document.getElementById("pong");return e?{canvas:e,context:e.getContext("2d")}:{canvas:null,context:null}}function D(e,n,o,t,s,r,l=!1,i="none"){e.fillStyle=r,e.fillRect(n,o,t,s),l&&(e.strokeStyle=i,e.lineWidth=2,e.strokeRect(0,0,t,s))}function W(e,n,o,t,s){e.fillStyle=s,e.beginPath(),e.arc(n,o,t,0,Math.PI*2,!1),e.closePath(),e.fill()}function z(e,n,o,t,s){e.fillStyle=s,e.font="45px fantasy",e.fillText(n.toString(),o,t)}function Ie(e,n,o){W(n,o.x,0,30,a.itemsColor);for(let t=0;t<=e.height;t+=15)D(n,o.x,o.y+t,o.width,o.height,a.itemsColor)}function Y(e,n,o,t,s,r){D(n,0,0,e.width,e.height,a.bgColor,!0,a.itemsColor),Ie(e,n,r),z(n,o.score,e.width/4,e.height/5,a.itemsColor),z(n,t.score,3*e.width/4,e.height/5,a.itemsColor),D(n,o.x,o.y,o.width,o.height,a.itemsColor),D(n,t.x,t.y,t.width,t.height,a.itemsColor),W(n,s.x,s.y,s.radius,a.itemsColor)}function Me(e,n){return e.top=e.y-e.radius,e.bottom=e.y+e.radius,e.left=e.x-e.radius,e.right=e.x+e.radius,n.top=n.y,n.bottom=n.y+n.height,n.left=n.x,n.right=n.x+n.width,e.right>n.left&&e.bottom>n.top&&e.left<n.right&&e.top<n.bottom}function G(e,n){n.x=e.width/2,n.y=e.height/2,a.resetSpeed&&(n.speed=a.ballSpeed),_(n)}function Pe(e,n,o){const t=n.y+n.height/2;n.y+=(o.y-t)*a.difficulty,n.y=Math.max(0,Math.min(n.y,e.height-n.height))}function Fe(e,n,o,t){t.x+=t.velocityX,t.y+=t.velocityY,a.multiplayer||Pe(e,o,t),t.y+t.radius>e.height?(t.y=e.height-t.radius,t.velocityY=-t.velocityY):t.y-t.radius<0&&(t.y=t.radius,t.velocityY=-t.velocityY);const s=t.x<e.width/2?n:o;if(Me(t,s)){j===!1&&(t.speed=a.ballSpeed,j=!0);let r=t.y-(s.y+s.height/2);r=r/(s.height/2);const l=r*Math.PI/4,i=t.x<e.width/2?1:-1;t.velocityX=i*t.speed*Math.cos(l),t.velocityY=t.speed*Math.sin(l),t.speed+=.1,i===1?t.x=s.x+s.width+t.radius:t.x=s.x-t.radius}if(t.x-t.radius<0?(o.score++,G(e,t)):t.x+t.radius>e.width&&(n.score++,G(e,t)),n.score===a.scoreLimit||o.score===a.scoreLimit){v=f.GAME_OVER,we(n.score,o.score,a.multiplayer);let r;n.score===a.scoreLimit?r="PLAYER 1 WINS!!!":a.multiplayer?r="PLAYER 2 WINS!!!":r="PLAYER 1 LOSES!!!",M(1,[{text:"Restart",onClick:()=>{F(e,n,o,t)}}]),Ce(r)}}const De=document.querySelector("#app"),U={sidebarOpen:!1};class _e{constructor(){this._isLoggedIn=!1,this.listeners=[]}get isLoggedIn(){return this._isLoggedIn}set isLoggedIn(n){this._isLoggedIn=n,this.listeners.forEach(o=>o())}subscribe(n){this.listeners.push(n)}}const y=new _e;async function I(e){De.innerHTML=`
		${Q}
		<main id="page-content" class="transition-all duration-300 pt-16 p-4">
			${e}
		</main>
		${re}
		${ae}
		${ie}
		${le}
	`,ge(),fe(),be(n=>{const o=document.getElementById("chat-messages");if(!o)return;const t=document.createElement("div");t.textContent=n.chat||n.message||JSON.stringify(n),o.appendChild(t),o.scrollTop=o.scrollHeight}),ve(),Ee(),ye(),xe()}function q(){switch(window.location.hash.slice(1)||"home"){case"about":I(ee);break;case"chat":I(te);break;case"contact":I(ne);break;case"stats":I(oe);break;case"userSettings":I(se);break;default:I(Z)}U.sidebarOpen=!1}window.addEventListener("DOMContentLoaded",q);window.addEventListener("hashchange",q);

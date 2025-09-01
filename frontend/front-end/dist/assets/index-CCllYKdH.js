(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function o(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function t(i){if(i.ep)return;i.ep=!0;const s=o(i);fetch(i.href,s)}})();const W=`<main id="page-content" class="pt-16 flex-1">
  <div class="fixed top-16 left-0 right-0 bottom-0 bg-[#000000] bg-[radial-gradient(#8390FA77_1px,#00091d_1px)] bg-[size:20px_20px] flex justify-center items-center">
  <!-- <div class="fixed top-16 left-0 right-0 bottom-0 bg-[#0E172B] flex justify-center items-center"> -->
    <div id="canvas-wrap" class="relative w-[1000px] h-[600px]">
      <canvas id="pong" width="1000" height="600"></canvas>

      <!-- Settings button -->
      <div class="group mt-4 w-14 overflow-hidden rounded-lg border-l border-transparent  transition-all duration-500 hover:w-64 hover:border-[#F5CB5C] hover:shadow-lg has-[:focus]:w-64 has-[:focus]:shadow-lg">
        <!-- <button id="settings" class="group cursor-pointer">Settings</button> -->
        <button id="openSettings" class="peer flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-blue-800 transition-all active:scale-95">
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






 `,Z=`<nav class="bg-[#0E172B] text-[#242423] font-bold w-screen
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
</nav>`,J=`<section class="bg-amber-400 w-full h-screen m-0 p-0">
  <h1 class="text-2xl font-bold">ABOUT</h1>
</section>`,Q=`<section>
  <h1 class="text-2xl font-bold">CHAT</h1>
  <div class="p-4">
    <h2 class="text-xl font-bold">Chat</h2>
    <div id="chat-messages" class="border p-2 h-64 overflow-y-auto bg-gray-100"></div>
    <input id="chat-input" type="text" class="border p-2 w-full mt-2" placeholder="Type a message..." />
    <button id="chat-send" class="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Send</button>
  </div>
</section>`,ee=`<section>
  <h1 class="text-2xl font-bold">CONTACT US!</h1>
</section>`,te=`<section>
  <h1 class="text-2xl font-bold">STATS</h1>
</section>`,ne=`<section>
  <h1 class="text-2xl font-bold">USER SETTINGS</h1>
</section>`,oe=`<div id="login-modal" class="fixed inset-0 flex flex-col items-end justify-start mt-18 h-screen hidden">
  <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Login</h2>
    <form id="login-form" class="flex flex-col">
      <input id="login-email" type="email" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Email address">
      <input id="login-password" type="password" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Password">
      <div class="flex items-center justify-between flex-wrap">
        <label for="remember-me" class="text-sm text-gray-900 cursor-pointer">
          <input type="checkbox" id="remember-me" class="mr-2">
          Remember me
        </label>
        <a href="#" id="forgotPass"  class="text-sm text-blue-500 hover:underline mb-0.5">Forgot password?</a>
        <p id="open-signup" class="text-gray-900 mt-4"> Don't have an account? <a href="#" class="text-sm text-blue-500 -200 hover:underline mt-4">Signup</a></p>
      </div>
      <button id="login-submit" type="submit" disabled class="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed">Login</button>
      <p id="login-message" class="text-sm text-red-500 mt-2 hidden"></p>
    </form>
  </div>
</div>
`,ie=`<!-- From Uiverse.io by themrsami --> 
<div id="signup-modal" class="fixed inset-0 flex flex-col items-end justify-start mt-18 h-screen hidden">
  <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Sign Up</h2>
    <form id="signup-form" class="flex flex-col">
      <input id="signup-username" placeholder="Username" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="text">
      <!-- <input placeholder="Last Name" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="text"> -->
      <input id="signup-email" placeholder="Email" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="email">
      <input id="signup-comfirmEmail" placeholder="Confirm Email" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mt-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="email">
      <input id="signup-password" placeholder="Password" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mt-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="password">
      <input id="signup-confirmPassword" placeholder="Confirm Password" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mt-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="password">
      <label class="text-sm mb-2 mt-4 text-gray-900 cursor-pointer" for="gender">
        Gender
      </label>
      <select class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" id="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <label class="text-sm mb-2 text-gray-900 cursor-pointer" for="age">
        Age
      </label>
      <input class="bg-gray-100 text-gray-900 border-0 rounded-md p-2" id="age" type="date">
      <button class="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed" type="submit">Sign Up</button>
    </form>
  </div>
</div>
`,se=`<!-- Sidebar -->
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
`,ae=`<div id="controlPanel" class="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                               bg-white p-6 rounded-lg shadow-lg mt-8"
     style="width: 800px; height: 600px; aspect-ratio: 4 / 3;">
  <!-- Close Button -->
  <button id="closeSettings" class="absolute top-2 right-2 text-xl font-bold">&times;</button>

  <h2 class="text-2xl font-semibold mb-4 text-center">Game Settings</h2>

  <!-- Flex layout for horizontal arrangement -->
  <div class="flex h-full gap-8">
    <!-- Column 1 -->
    <div class="flex-1 space-y-4 overflow-y-auto pr-4">
      <!-- Difficulty -->
      <div>
        <label class="block font-medium mb-1">Difficulty:</label>
        <label><input type="radio" name="difficulty" value="0.05"> Easy</label><br>
        <label><input type="radio" name="difficulty" value="0.1"> Normal</label><br>
        <label><input type="radio" name="difficulty" value="0.3"> Hard</label>
      </div>

      <!-- Control method -->
      <div>
        <label class="block font-medium mb-1">Control Method (Single Player):</label>
        <label><input type="radio" name="mouse" value="true"> Mouse</label><br>
        <label><input type="radio" name="mouse" value="false"> Keyboard</label>
      </div>

      <!-- Modes -->
      <div>
        <label class="block font-medium mb-1">Mode:</label>
        <label><input type="radio" name="multiplayer" value="true"> Multiplayer</label><br>
        <label><input type="radio" name="multiplayer" value="false"> Single Player</label>
      </div>

      <!-- Reset Speed -->
      <div>
        <label>
          <input type="checkbox" id="resetSpeed"> Reset Ball Speed After Score
        </label>
      </div>
    </div>

    <!-- Column 2 -->
    <div class="flex-1 space-y-4 overflow-y-auto pr-4">
      <!-- Paddle Speed -->
      <div>
        <label class="block font-medium mb-1">Paddle Speed: <span id="paddleSpeedValue"></span></label>
        <input type="range" id="paddleSpeed" min="1" max="10">
      </div>

      <!-- Ball Speed -->
      <div>
        <label class="block font-medium mb-1">Ball Speed: <span id="ballSpeedValue"></span></label>
        <input type="range" id="ballSpeed" min="1" max="10">
      </div>

      <!-- Score Limit -->
      <div>
        <label class="block font-medium mb-1">Score Limit:</label>
        <input type="number" id="scoreLimit" min="1" class="border rounded p-1 w-full">
      </div>

      <!-- Background Color -->
      <div>
        <label class="block font-medium mb-1">Background Color:</label>
        <input type="color" id="bgColor">
      </div>

      <!-- Items Color -->
      <div>
        <label class="block font-medium mb-1">Items Color:</label>
        <input type="color" id="itemsColor">
      </div>

      <!-- Reset to Default -->
      <div class="text-center pt-4">
        <button id="resetDefaults" class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
          Reset to Default
        </button>
      </div>
    </div>
  </div>
</div>

`,re=`<!-- <button id="open-login" class="px-4 py- border border-amber-400 rounded text-white hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
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
</button>`,le=`<!-- components/navLoggedin.html (tooltips use peer-hover so they show only on the specific button) -->
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





`,V=`<div class="flex flex-row gap-2 justify-center items-center">
    <div class="w-2 h-2 rounded-full bg-black animate-bounce"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.3s]"></div>
    <div class="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-.5s]"></div>
</div>`,de="/api/login";function ce(){const e=document.getElementById("login-modal"),n=document.getElementById("signup-modal"),o=document.getElementById("open-login"),t=document.getElementById("open-signup"),i=document.getElementById("login-form"),s=document.getElementById("login-email"),r=document.getElementById("login-password"),l=document.getElementById("login-submit"),u=document.getElementById("login-message");if(!e||!o||!i||!s||!r||!l){console.warn("Login modal setup failed: missing elements.");return}o.addEventListener("click",()=>{e.classList.toggle("hidden")}),e.addEventListener("click",y=>{y.target===e&&e.classList.add("hidden")}),t&&n&&t.addEventListener("click",()=>{e.classList.add("hidden"),n.classList.remove("hidden")});function f(){s.value.trim()&&r.value.trim()?l.disabled=!1:l.disabled=!0}s.addEventListener("input",f),r.addEventListener("input",f);function v(y){u&&(u.textContent=y,u.classList.remove("hidden"),u.classList.toggle("text-red-500"))}function x(){u&&u.classList.add("hidden")}i.addEventListener("submit",async y=>{y.preventDefault(),x();const w=l.innerHTML;l.innerHTML=`${V}`,l.disabled=!0;const E=new AbortController,h=setTimeout(()=>E.abort(),15e3);try{const d=await fetch(de,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s.value,password:r.value}),signal:E.signal});if(clearTimeout(h),!d.ok){v("Invalid email or password"),r.value="",f(),l.innerHTML=w,l.disabled=!1;return}const c=await d.json();p.isLoggedIn=!0,p.username=c.username,p.avatarUrl=c.avatarUrl,e.classList.add("hidden"),s.value="",r.value="",l.innerHTML=w,l.disabled=!0}catch{E.signal.aborted?(v("Login request timed out. Please try again."),s.value="",r.value=""):v("An error occurred. Please try again."),l.innerHTML=w,l.disabled=!0}}),document.getElementById("forgotPass").addEventListener("click",()=>{p.isLoggedIn=!0,e.classList.add("hidden")})}const ue="/api/signup";function me(){const e=document.getElementById("signup-modal"),n=document.getElementById("open-login"),o=document.getElementById("signup-form"),t=document.getElementById("signup-username"),i=document.getElementById("signup-email"),s=document.getElementById("signup-comfirmEmail"),r=document.getElementById("signup-password"),l=document.getElementById("signup-confirmPassword"),u=o?.querySelector('button[type="submit"]');if(!e||!o||!t||!i||!s||!r||!l||!u){console.warn("Signup modal setup failed: missing elements.");return}function f(c){let b=c.nextElementSibling;return(!b||!b.classList.contains("error-msg"))&&(b=document.createElement("span"),b.className="error-msg text-red-500 text-sm block hidden",c.insertAdjacentElement("afterend",b)),b}const v=f(t),x=f(i),C=f(s),y=f(r),w=f(l);u.disabled=!0;function E(c){const b=c.length>=8,B=/[A-Z]/.test(c),L=/[0-9]/.test(c);return b&&B&&L}function h(c,b,B,L){b?(c.classList.remove("border-red-500","focus:ring-red-500"),c.classList.add("border-green-500","focus:ring-green-500"),L&&L.classList.add("hidden")):(c.classList.remove("border-green-500","focus:ring-green-500"),c.classList.add("border-red-500","focus:ring-red-500"),L&&B&&(L.textContent=B,L.classList.remove("hidden")))}function d(){let c=!0;t.value.trim().length===0?(h(t,!1,"Username is required.",v),c=!1):h(t,!0,"",v),i.value.trim().length===0?(h(i,!1,"Email is required.",x),c=!1):h(i,!0,"",x),s.value.trim()!==i.value.trim()||s.value.trim()===""?(h(s,!1,"Emails do not match.",C),c=!1):h(s,!0,"",C),E(r.value)?h(r,!0,"",y):(h(r,!1,"Password must be ≥ 8 chars, 1 uppercase & 1 number.",y),c=!1),l.value!==r.value||l.value===""?(h(l,!1,"Passwords do not match.",w),c=!1):h(l,!0,"",w),u.disabled=!c}t.addEventListener("input",d),i.addEventListener("input",d),s.addEventListener("input",d),r.addEventListener("input",d),l.addEventListener("input",d),n&&n.addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",c=>{c.target===e&&e.classList.add("hidden")}),o.addEventListener("submit",async c=>{c.preventDefault();const b=t.value.trim(),B=i.value.trim(),L=r.value.trim(),X=u.innerHTML;u.innerHTML=V,u.disabled=!0;try{const P=new AbortController,K=setTimeout(()=>P.abort(),15e3),O=await fetch(ue,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:b,email:B,password:L}),signal:P.signal});if(clearTimeout(K),O.ok){const M=await O.json();M.success?(p.isLoggedIn=!0,p.username=M.username,p.avatarUrl=M.avatarUrl,e.classList.add("hidden"),console.log("Signup successful!")):(alert(M.message||"Signup failed. Please try again."),r.value="",l.value="")}else alert("Signup request failed. Please try again."),r.value="",l.value=""}catch(P){console.error("Signup error:",P),alert("Network error or request timeout."),r.value="",l.value=""}finally{u.innerHTML=X,u.disabled=!1}})}async function ge(){const e=document.getElementById("user-section");if(!e){console.warn("⚠️ user-section not found in DOM");return}function n(){if(p.isLoggedIn){e.innerHTML=le;const o=document.getElementById("user-greeting");o&&(o.textContent=p.username?` ${p.username}`:" User");const t=document.getElementById("user-avatar"),i=document.getElementById("default-avatar"),s=document.getElementById("user-avatar-modal"),r=document.getElementById("default-avatar-modal");p.avatarUrl?(t&&(t.src=p.avatarUrl,t.classList.remove("hidden")),i&&i.classList.add("hidden"),s&&(s.src=p.avatarUrl,s.classList.remove("hidden")),r&&r.classList.add("hidden")):(t&&t.classList.add("hidden"),i&&i.classList.remove("hidden"),s&&s.classList.add("hidden"),r&&r.classList.remove("hidden"));const l=document.getElementById("logout-btn");l&&l.addEventListener("click",()=>{p.isLoggedIn=!1,p.username=void 0,p.avatarUrl=void 0})}else e.innerHTML=re,ce(),me()}n(),p.subscribe&&p.subscribe(n)}function pe(){const e=document.getElementById("menu-toggle"),n=document.getElementById("sidebar"),o=document.getElementById("page-content");!e||!n||!o||e.addEventListener("change",()=>{R.sidebarOpen=e.checked,R.sidebarOpen?(n.classList.remove("-translate-x-full"),o.classList.add("ml-48")):(n.classList.add("-translate-x-full"),o.classList.remove("ml-48"))})}let a={difficulty:.05,mouse:!0,multiplayer:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!1};function fe(){const e=document.getElementById("openSettings"),n=document.getElementById("closeSettings"),o=document.getElementById("controlPanel"),t=document.getElementById("paddleSpeed"),i=document.getElementById("paddleSpeedValue"),s=document.getElementById("ballSpeed"),r=document.getElementById("ballSpeedValue"),l=document.getElementById("scoreLimit"),u=document.getElementById("bgColor"),f=document.getElementById("itemsColor"),v=document.getElementById("resetSpeed"),x=document.getElementById("resetDefaults"),C=document.querySelectorAll('input[name="difficulty"]'),y=document.querySelectorAll('input[name="mouse"]'),w=document.querySelectorAll('input[name="multiplayer"]');function E(){C.forEach(d=>{d.checked=Number(d.value)===a.difficulty}),y.forEach(d=>{d.checked=d.value==="true"===a.mouse}),w.forEach(d=>{d.checked=d.value==="true"===a.multiplayer}),v.checked=a.resetSpeed,t.value=a.paddleSpeed.toString(),i.textContent=t.value,s.value=a.ballSpeed.toString(),r.textContent=s.value,l.value=a.scoreLimit.toString(),u.value=a.bgColor,f.value=a.itemsColor}function h(){C.forEach(d=>{d.addEventListener("change",()=>{a.difficulty=Number(d.value)})}),y.forEach(d=>{d.addEventListener("change",()=>{a.multiplayer===!1&&(a.mouse=d.value==="true")})}),w.forEach(d=>{d.addEventListener("change",()=>{a.multiplayer=d.value==="true",a.mouse=!1})}),v.addEventListener("change",()=>{a.resetSpeed=v.checked}),t.addEventListener("input",()=>{a.paddleSpeed=Number(t.value),i.textContent=t.value}),s.addEventListener("input",()=>{a.ballSpeed=Number(s.value),r.textContent=s.value}),l.addEventListener("input",()=>{const d=Number(l.value);d>0&&(a.scoreLimit=d)}),u.addEventListener("input",()=>{a.bgColor=u.value}),f.addEventListener("input",()=>{a.itemsColor=f.value}),x.addEventListener("click",()=>{a={...a,difficulty:.05,mouse:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!0},E()})}e?.addEventListener("click",()=>{E(),o?.classList.remove("hidden")}),n?.addEventListener("click",()=>{o?.classList.add("hidden")}),o?.addEventListener("click",d=>{d.target===o&&o.classList.add("hidden")}),h()}let Y=!1,D=!1;const m={START:"start",PLAYING:"playing",PAUSED:"paused",GAME_OVER:"gameOver"};let g=m.START,U=!1,H=!1,F=!1,_=!1;window.addEventListener("keydown",e=>{(e.key==="w"||e.key==="W")&&(U=!0),(e.key==="s"||e.key==="S")&&(H=!0),e.key==="ArrowUp"&&(F=!0),e.key==="ArrowDown"&&(_=!0)});window.addEventListener("keyup",e=>{(e.key==="w"||e.key==="W")&&(U=!1),(e.key==="s"||e.key==="S")&&(H=!1),e.key==="ArrowUp"&&(F=!1),e.key==="ArrowDown"&&(_=!1)});function k(e,n){const o=document.getElementById("game-overlay"),t=document.getElementById("game-message"),i=document.getElementById("overlay-buttons");!o||!t||!i||(t.textContent=e,i.innerHTML="",n.forEach(s=>{const r=document.createElement("button");r.textContent=s.text,r.className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-200",r.onclick=s.onClick,i.appendChild(r)}),o.classList.remove("hidden"))}function S(){const e=document.getElementById("game-overlay");e&&e.classList.add("hidden")}function he(){const{canvas:e,context:n}=xe();if(!e||!n)return;const o={x:30,y:e.height/2-100/2,width:10,height:100,score:0},t={x:e.width-40,y:e.height/2-100/2,width:10,height:100,score:0},i={x:e.width/2,y:e.height/2,radius:10,velocityX:0,velocityY:0,speed:a.ballSpeed},s={x:e.width/2-1,y:0,width:2,height:10};o.y=e.height/2-o.height/2,t.y=e.height/2-t.height/2,i.x=e.width/2,i.y=e.height/2,i.velocityX=0,i.velocityY=0;const r=document.getElementById("pause-btn"),l=document.getElementById("openSettings"),u=x=>{ve(x,e,o)};a.mouse&&!a.multiplayer&&e.addEventListener("mousemove",u),k("Click Start to play",[{text:"Start",onClick:()=>{g=m.PLAYING,S(),N(i)}}]),r&&r.addEventListener("click",()=>{g===m.PLAYING&&(g=m.PAUSED,k("",[{text:"Resume",onClick:()=>{g=m.PLAYING,S()}},{text:"Restart",onClick:()=>{A(e,o,t,i)}}]))}),l&&l.addEventListener("click",()=>{g===m.PLAYING&&(g=m.PAUSED,k("",[{text:"Resume",onClick:()=>{g=m.PLAYING,S()}},{text:"Restart",onClick:()=>{A(e,o,t,i)}}]))}),window.addEventListener("keydown",x=>{x.code==="Space"&&(g===m.PLAYING?(g=m.PAUSED,k("",[{text:"Resume",onClick:()=>{g=m.PLAYING,S()}},{text:"Restart",onClick:()=>{A(e,o,t,i)}}])):g===m.PAUSED?(g=m.PLAYING,S()):g===m.START&&(g=m.PLAYING,S(),N(i)))});function f(){if(g===m.START||g===m.PAUSED||g===m.GAME_OVER){G(e,n,o,t,i,s);return}a.multiplayer&&be(e,o,t),!a.multiplayer&&!a.mouse&&ye(e,o),Se(e,o,t,i),G(e,n,o,t,i,s)}function v(){(!a.mouse||a.multiplayer)&&e.removeEventListener("mousemove",u),f(),requestAnimationFrame(v)}requestAnimationFrame(v)}function ve(e,n,o){const t=n.getBoundingClientRect();let i=e.clientY-t.top-o.height/2;i<0&&(i=0),i+o.height>n.height&&(i=n.height-o.height),o.y=i}function A(e,n,o,t){n.score=0,o.score=0,n.y=e.height/2-n.height/2,o.y=e.height/2-o.height/2,t.x=e.width/2,t.y=e.height/2,t.velocityX=0,t.velocityY=0,g=m.PLAYING,S(),N(t)}function N(e){let n=e.speed;Y===!1&&(n=a.ballSpeed,Y=!0);const o=Math.random()*Math.PI/2-Math.PI/4,t=Math.random()<.5?1:-1;e.velocityX=t*n*Math.cos(o),e.velocityY=n*Math.sin(o)}function be(e,n,o){U&&(n.y-=a.paddleSpeed),H&&(n.y+=a.paddleSpeed),F&&(o.y-=a.paddleSpeed),_&&(o.y+=a.paddleSpeed),n.y=Math.max(0,Math.min(n.y,e.height-n.height)),o.y=Math.max(0,Math.min(o.y,e.height-o.height))}function ye(e,n){U&&(n.y-=a.paddleSpeed),H&&(n.y+=a.paddleSpeed),n.y=Math.max(0,Math.min(n.y,e.height-n.height))}function xe(){const e=document.getElementById("pong");return e?{canvas:e,context:e.getContext("2d")}:{canvas:null,context:null}}function T(e,n,o,t,i,s){e.fillStyle=s,e.fillRect(n,o,t,i)}function q(e,n,o,t,i){e.fillStyle=i,e.beginPath(),e.arc(n,o,t,0,Math.PI*2,!1),e.closePath(),e.fill()}function j(e,n,o,t,i){e.fillStyle=i,e.font="45px fantasy",e.fillText(n.toString(),o,t)}function we(e,n,o){q(n,o.x,0,30,a.itemsColor);for(let t=0;t<=e.height;t+=15)T(n,o.x,o.y+t,o.width,o.height,a.itemsColor)}function G(e,n,o,t,i,s){T(n,0,0,e.width,e.height,a.bgColor),we(e,n,s),j(n,o.score,e.width/4,e.height/5,a.itemsColor),j(n,t.score,3*e.width/4,e.height/5,a.itemsColor),T(n,o.x,o.y,o.width,o.height,a.itemsColor),T(n,t.x,t.y,t.width,t.height,a.itemsColor),q(n,i.x,i.y,i.radius,a.itemsColor)}function Le(e,n){return e.top=e.y-e.radius,e.bottom=e.y+e.radius,e.left=e.x-e.radius,e.right=e.x+e.radius,n.top=n.y,n.bottom=n.y+n.height,n.left=n.x,n.right=n.x+n.width,e.right>n.left&&e.bottom>n.top&&e.left<n.right&&e.top<n.bottom}function z(e,n){n.x=e.width/2,n.y=e.height/2,a.resetSpeed&&(n.speed=a.ballSpeed),N(n)}function Ee(e,n,o){const t=n.y+n.height/2;n.y+=(o.y-t)*a.difficulty,n.y=Math.max(0,Math.min(n.y,e.height-n.height))}function Se(e,n,o,t){t.x+=t.velocityX,t.y+=t.velocityY,a.multiplayer||Ee(e,o,t),t.y+t.radius>e.height?(t.y=e.height-t.radius,t.velocityY=-t.velocityY):t.y-t.radius<0&&(t.y=t.radius,t.velocityY=-t.velocityY);const i=t.x<e.width/2?n:o;if(Le(t,i)){D===!1&&(t.speed=a.ballSpeed,D=!0);let s=t.y-(i.y+i.height/2);s=s/(i.height/2);const r=s*Math.PI/4,l=t.x<e.width/2?1:-1;t.velocityX=l*t.speed*Math.cos(r),t.velocityY=t.speed*Math.sin(r),t.speed+=.1,l===1?t.x=i.x+i.width+t.radius:t.x=i.x-t.radius}if(t.x-t.radius<0?(o.score++,z(e,t)):t.x+t.radius>e.width&&(n.score++,z(e,t)),n.score===a.scoreLimit||o.score===a.scoreLimit){g=m.GAME_OVER;let s="";n.score===a.scoreLimit?s="PLAYER 1 WINS!!!":a.multiplayer?s="PLAYER 2 WINS!!!":s="PLAYER 1 LOSES!!!",k(s,[{text:"Restart",onClick:()=>{A(e,n,o,t)}}])}}const Ce=document.querySelector("#app"),R={sidebarOpen:!1};class Be{_isLoggedIn=!1;listeners=[];username;avatarUrl;get isLoggedIn(){return this._isLoggedIn}set isLoggedIn(n){this._isLoggedIn=n,this.listeners.forEach(o=>o())}subscribe(n){this.listeners.push(n)}}const p=new Be;async function I(e){Ce.innerHTML=`
		${Z}
		<main id="page-content" class="transition-all duration-300 pt-16 p-4">
			${e}
		</main>
		${oe}
		${ie}
		${se}
		${ae}
	`,ge(),pe(),he(),fe()}function $(){switch(window.location.hash.slice(1)||"home"){case"about":I(J);break;case"chat":I(Q);break;case"contact":I(ee);break;case"stats":I(te);break;case"userSettings":I(ne);break;default:I(W)}R.sidebarOpen=!1}window.addEventListener("DOMContentLoaded",$);window.addEventListener("hashchange",$);

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}})();const K=`<main id="page-content" class="pt-16 flex-1">
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
</nav>`,Q=`<section class="bg-amber-400 w-full h-screen m-0 p-0">
  <h1 class="text-2xl font-bold">ABOUT</h1>
</section>`,ee=`<section>
  <div class="p-4">
    <h2 class="text-xl font-bold">Chat</h2>
    <div id="chat-messages" class="border p-2 h-64 overflow-y-auto bg-gray-100"></div>
    <input id="chat-input" type="text" class="border p-2 w-full mt-2" placeholder="Type a message..." />
    <button id="chat-send" class="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Send</button>
  </div>
</section>`,te=`<section>
  <h1 class="text-2xl font-bold">CONTACT US!</h1>
</section>`,ne=`<section>
  <h1 class="text-2xl font-bold">STATS</h1>
</section>`,oe=`<section>
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
`,se=`<!-- From Uiverse.io by themrsami --> 
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
`,ae=`<div id="controlPanel"
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
`,le=`<!-- <button id="open-login" class="px-4 py- border border-amber-400 rounded text-white hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
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
</button>`,de=`<!-- components/navLoggedin.html (tooltips use peer-hover so they show only on the specific button) -->
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
</div>`,ce="undefined/auth/login";function ue(){const e=document.getElementById("login-modal"),t=document.getElementById("signup-modal"),o=document.getElementById("open-login"),n=document.getElementById("open-signup"),r=document.getElementById("login-form"),s=document.getElementById("login-email"),a=document.getElementById("login-password"),l=document.getElementById("login-submit"),u=document.getElementById("login-message");if(!e||!o||!r||!s||!a||!l){console.warn("Login modal setup failed: missing elements.");return}o.addEventListener("click",()=>{e.classList.toggle("hidden")}),e.addEventListener("click",w=>{w.target===e&&e.classList.add("hidden")}),n&&t&&n.addEventListener("click",()=>{e.classList.add("hidden"),t.classList.remove("hidden")});function g(){s.value.trim()&&a.value.trim()?l.disabled=!1:l.disabled=!0}s.addEventListener("input",g),a.addEventListener("input",g);function b(w){u&&(u.textContent=w,u.classList.remove("hidden"),u.classList.toggle("text-red-500"))}function x(){u&&u.classList.add("hidden")}r.addEventListener("submit",async w=>{w.preventDefault(),x();const C=l.innerHTML;console.log(void 0),l.innerHTML=`${$}`,l.disabled=!0;const S=new AbortController,f=setTimeout(()=>S.abort(),15e3);try{const d=await fetch(ce,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s.value,password:a.value}),signal:S.signal});if(clearTimeout(f),!d.ok){b("Invalid email or password"),a.value="",g(),l.innerHTML=C,l.disabled=!1;return}const c=await d.json();localStorage.setItem("token",c.token),p.isLoggedIn=!0,p.username=c.username,p.avatarUrl=c.avatarUrl,e.classList.add("hidden"),s.value="",a.value="",l.innerHTML=C,l.disabled=!0}catch{S.signal.aborted?(b("Login request timed out. Please try again."),s.value="",a.value=""):b("An error occurred. Please try again."),l.innerHTML=C,l.disabled=!0}}),document.getElementById("forgotPass").addEventListener("click",()=>{p.isLoggedIn=!0,e.classList.add("hidden")})}const pe="undefined/auth/register";function he(){const e=document.getElementById("signup-modal"),t=document.getElementById("open-login"),o=document.getElementById("signup-form"),n=document.getElementById("signup-username"),r=document.getElementById("signup-email"),s=document.getElementById("signup-comfirmEmail"),a=document.getElementById("signup-password"),l=document.getElementById("signup-confirmPassword"),u=o?.querySelector('button[type="submit"]');if(!e||!o||!n||!r||!s||!a||!l||!u){console.warn("Signup modal setup failed: missing elements.");return}function g(c){let y=c.nextElementSibling;return(!y||!y.classList.contains("error-msg"))&&(y=document.createElement("span"),y.className="error-msg text-red-500 text-sm block hidden",c.insertAdjacentElement("afterend",y)),y}const b=g(n),x=g(r),L=g(s),w=g(a),C=g(l);u.disabled=!0;function S(c){const y=c.length>=8,B=/[A-Z]/.test(c),k=/[0-9]/.test(c);return y&&B&&k}function f(c,y,B,k){y?(c.classList.remove("border-red-500","focus:ring-red-500"),c.classList.add("border-green-500","focus:ring-green-500"),k&&k.classList.add("hidden")):(c.classList.remove("border-green-500","focus:ring-green-500"),c.classList.add("border-red-500","focus:ring-red-500"),k&&B&&(k.textContent=B,k.classList.remove("hidden")))}function d(){let c=!0;n.value.trim().length===0?(f(n,!1,"Username is required.",b),c=!1):f(n,!0,"",b),r.value.trim().length===0?(f(r,!1,"Email is required.",x),c=!1):f(r,!0,"",x),s.value.trim()!==r.value.trim()||s.value.trim()===""?(f(s,!1,"Emails do not match.",L),c=!1):f(s,!0,"",L),S(a.value)?f(a,!0,"",w):(f(a,!1,"Password must be ≥ 8 chars, 1 uppercase & 1 number.",w),c=!1),l.value!==a.value||l.value===""?(f(l,!1,"Passwords do not match.",C),c=!1):f(l,!0,"",C),u.disabled=!c}n.addEventListener("input",d),r.addEventListener("input",d),s.addEventListener("input",d),a.addEventListener("input",d),l.addEventListener("input",d),t&&t.addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",c=>{c.target===e&&e.classList.add("hidden")}),o.addEventListener("submit",async c=>{c.preventDefault();const y=n.value.trim(),B=r.value.trim(),k=a.value.trim(),W=u.innerHTML;u.innerHTML=$,u.disabled=!0;try{const M=new AbortController,X=setTimeout(()=>M.abort(),15e3),D=await fetch(pe,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:y,email:B,password:k}),signal:M.signal});if(clearTimeout(X),D.ok){const J=await D.json();console.log("Signup response:",J),p.isLoggedIn=!0,p.username=y,p.avatarUrl="/default-avatar.png",e.classList.add("hidden"),console.log("Signup successful!")}else alert("Signup failed. Please try again."),a.value="",l.value=""}catch(M){console.error("Signup error:",M),alert("Network error or request timeout."),a.value="",l.value=""}finally{u.innerHTML=W,u.disabled=!1}})}async function me(e){const t=document.getElementById("user-section");if(!t){console.warn("⚠️ user-section not found in DOM");return}function o(){if(p.isLoggedIn){t.innerHTML=de;const n=document.getElementById("user-greeting");n&&(n.textContent=p.username?` ${p.username}`:" User");const r=document.getElementById("user-avatar"),s=document.getElementById("default-avatar"),a=document.getElementById("user-avatar-modal"),l=document.getElementById("default-avatar-modal");p.avatarUrl?(r&&(r.src=p.avatarUrl,r.classList.remove("hidden")),s&&s.classList.add("hidden"),a&&(a.src=p.avatarUrl,a.classList.remove("hidden")),l&&l.classList.add("hidden")):(r&&r.classList.add("hidden"),s&&s.classList.remove("hidden"),a&&a.classList.add("hidden"),l&&l.classList.remove("hidden"));const u=document.getElementById("logout-btn");u&&u.addEventListener("click",()=>{localStorage.removeItem("token"),p.isLoggedIn=!1,p.username=void 0,p.avatarUrl=void 0})}else t.innerHTML=le,ue(),he()}o(),p.subscribe&&p.subscribe(o)}function ge(){const e=document.getElementById("menu-toggle"),t=document.getElementById("sidebar"),o=document.getElementById("page-content");!e||!t||!o||e.addEventListener("change",()=>{R.sidebarOpen=e.checked,R.sidebarOpen?(t.classList.remove("-translate-x-full"),o.classList.add("ml-48")):(t.classList.add("-translate-x-full"),o.classList.remove("ml-48"))})}let v=null;function fe(e){const t=`ws://${window.location.hostname}:3000/ws`;return(!v||v.readyState===WebSocket.CLOSED||v.readyState===WebSocket.CLOSING)&&(v=new WebSocket(t),v.onopen=()=>{console.log("Connected to WebSocket:",t)},v.onclose=()=>{console.log("Disconnected from server!"),v=null},v.onerror=o=>{console.log("WebSocket error!",o),v=null}),v.onmessage=o=>{if(e)try{e(JSON.parse(o.data))}catch{console.warn("Received non-JSON message:",o.data)}},v}function ve(e){v&&v.readyState===WebSocket.OPEN?v.send(JSON.stringify(e)):console.warn("WebSocket not connected!")}function be(){const e=localStorage.getItem("username");return e||(window.anonymousId||(window.anonymousId="Anonymous"+Math.floor(1e3+Math.random()*9e3)),window.anonymousId)}function ye(){const e=document.querySelector("#chat-input"),t=document.querySelector("#chat-send"),o=document.getElementById("chat-messages");if(o&&(o.innerHTML=""),fe(n=>{if(o)if(console.log("Received message:",n),n.type==="chat"){const r=document.createElement("div");r.className="mb-2 p-2 rounded bg-gray-100";const s=n.username||"Anonymous",a=n.text||"";r.textContent=`${s}: ${a}`,o.appendChild(r),o.scrollTop=o.scrollHeight}else if(n.type==="welcome"){const r=document.createElement("div");r.className="mb-2 p-2 rounded bg-blue-100 text-blue-800",r.textContent=n.message,o.appendChild(r),o.scrollTop=o.scrollHeight}else console.warn("Unknown message type:",n)}),e&&t){const n=()=>{e.value.trim()&&(ve({type:"chat",text:e.value.trim(),username:be()}),e.value="")};t.addEventListener("click",n),e.addEventListener("keypress",r=>{r.key==="Enter"&&n()})}}let i={difficulty:.05,mouse:!0,multiplayer:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!1};function we(){const e=document.getElementById("openSettings"),t=document.getElementById("closeSettings"),o=document.getElementById("controlPanel"),n=document.getElementById("paddleSpeed"),r=document.getElementById("paddleSpeedValue"),s=document.getElementById("ballSpeed"),a=document.getElementById("ballSpeedValue"),l=document.getElementById("scoreLimit"),u=document.getElementById("bgColor"),g=document.getElementById("itemsColor"),b=document.getElementById("resetSpeed"),x=document.getElementById("resetDefaults"),L=document.querySelectorAll('input[name="difficulty"]'),w=document.querySelectorAll('input[name="mouse"]'),C=document.querySelectorAll('input[name="multiplayer"]');function S(){L.forEach(d=>{d.checked=Number(d.value)===i.difficulty}),w.forEach(d=>{d.checked=d.value==="true"===i.mouse}),C.forEach(d=>{d.checked=d.value==="true"===i.multiplayer}),b.checked=i.resetSpeed,n.value=i.paddleSpeed.toString(),r.textContent=n.value,s.value=i.ballSpeed.toString(),a.textContent=s.value,l.value=i.scoreLimit.toString(),u.value=i.bgColor,g.value=i.itemsColor}function f(){L.forEach(d=>{d.addEventListener("change",()=>{i.difficulty=Number(d.value)})}),w.forEach(d=>{d.addEventListener("change",()=>{i.multiplayer===!1&&(i.mouse=d.value==="true")})}),C.forEach(d=>{d.addEventListener("change",()=>{i.multiplayer=d.value==="true",i.mouse=!1})}),b.addEventListener("change",()=>{i.resetSpeed=b.checked}),n.addEventListener("input",()=>{i.paddleSpeed=Number(n.value),r.textContent=n.value}),s.addEventListener("input",()=>{i.ballSpeed=Number(s.value),a.textContent=s.value}),l.addEventListener("input",()=>{const d=Number(l.value);d>0&&(i.scoreLimit=d)}),u.addEventListener("input",()=>{i.bgColor=u.value}),g.addEventListener("input",()=>{i.itemsColor=g.value}),x.addEventListener("click",()=>{i={...i,difficulty:.05,mouse:!1,resetSpeed:!0,paddleSpeed:5,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C",default:!0},S()})}e?.addEventListener("click",()=>{S(),o?.classList.toggle("hidden")}),t?.addEventListener("click",()=>{o?.classList.add("hidden")}),f()}let _=!1,Y=!1;const h={START:"start",PLAYING:"playing",PAUSED:"paused",GAME_OVER:"gameOver"};let m=h.START,T=!1,O=!1,U=!1,H=!1;window.addEventListener("keydown",e=>{(e.key==="w"||e.key==="W")&&(T=!0),(e.key==="s"||e.key==="S")&&(O=!0),e.key==="ArrowUp"&&(U=!0),e.key==="ArrowDown"&&(H=!0)});window.addEventListener("keyup",e=>{(e.key==="w"||e.key==="W")&&(T=!1),(e.key==="s"||e.key==="S")&&(O=!1),e.key==="ArrowUp"&&(U=!1),e.key==="ArrowDown"&&(H=!1)});function xe(e){const t=document.getElementById("game-overlay"),o=document.getElementById("game-message");!t||!o||(o.textContent=e,t.classList.remove("hidden"))}function P(e,t){const o=document.getElementById("game-overlay"),n=document.getElementById("overlay-buttons");!o||!n||(n.innerHTML="",e===1&&t.forEach(r=>{const s=document.createElement("button");s.textContent=r.text,s.className="px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-green-600 							hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none hover:text-green-600",s.onclick=r.onClick,n.appendChild(s)}),e===2&&t.forEach(r=>{const s=document.createElement("button");s.textContent=r.text,s.className="w-35 px-8 py-2 text-white font-lucky text-lg rounded-lg shadow-lg transition-transform 							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-blue-600 							hover:shadow-blue-500/50 hover:shadow-2xl focus:outline-none hover:text-blue-600",s.onclick=r.onClick,n.appendChild(s)}),o.classList.remove("hidden"))}function E(){const e=document.getElementById("game-overlay");e&&e.classList.add("hidden")}function Ce(){const{canvas:e,context:t}=Le();if(!e||!t)return;const o={x:30,y:e.height/2-100/2,width:10,height:100,score:0},n={x:e.width-40,y:e.height/2-100/2,width:10,height:100,score:0},r={x:e.width/2,y:e.height/2,radius:10,velocityX:0,velocityY:0,speed:i.ballSpeed},s={x:e.width/2-1,y:0,width:2,height:10};o.y=e.height/2-o.height/2,n.y=e.height/2-n.height/2,r.x=e.width/2,r.y=e.height/2,r.velocityX=0,r.velocityY=0;const a=document.getElementById("pause-btn"),l=document.getElementById("openSettings"),u=x=>{ke(x,e,o)};i.mouse&&!i.multiplayer&&e.addEventListener("mousemove",u),P(1,[{text:"Start",onClick:()=>{m=h.PLAYING,E(),N(r)}}]),a&&a.addEventListener("click",()=>{m===h.PLAYING&&(m=h.PAUSED,P(2,[{text:"Resume",onClick:()=>{m=h.PLAYING,E()}},{text:"Restart",onClick:()=>{A(e,o,n,r)}}]))}),l&&l.addEventListener("click",()=>{m===h.PLAYING&&(m=h.PAUSED,P(2,[{text:"Resume",onClick:()=>{m=h.PLAYING,E()}},{text:"Restart",onClick:()=>{A(e,o,n,r)}}]))}),window.addEventListener("keydown",x=>{x.code==="Space"&&(m===h.PLAYING?(m=h.PAUSED,P(2,[{text:"Resume",onClick:()=>{m=h.PLAYING,E()}},{text:"Restart",onClick:()=>{A(e,o,n,r)}}])):m===h.PAUSED?(m=h.PLAYING,E()):m===h.START&&(m=h.PLAYING,E(),N(r)))});function g(){if(m===h.START||m===h.PAUSED||m===h.GAME_OVER){G(e,t,o,n,r,s);return}i.multiplayer&&Se(e,o,n),!i.multiplayer&&!i.mouse&&Ee(e,o),Me(e,o,n,r),G(e,t,o,n,r,s)}function b(){(!i.mouse||i.multiplayer)&&e.removeEventListener("mousemove",u),g(),requestAnimationFrame(b)}requestAnimationFrame(b)}function ke(e,t,o){const n=t.getBoundingClientRect();let r=e.clientY-n.top-o.height/2;r<0&&(r=0),r+o.height>t.height&&(r=t.height-o.height),o.y=r}function A(e,t,o,n){t.score=0,o.score=0,t.y=e.height/2-t.height/2,o.y=e.height/2-o.height/2,n.x=e.width/2,n.y=e.height/2,n.velocityX=0,n.velocityY=0,m=h.PLAYING,E(),N(n)}function N(e){let t=e.speed;_===!1&&(t=i.ballSpeed,_=!0);const o=Math.random()*Math.PI/2-Math.PI/4,n=Math.random()<.5?1:-1;e.velocityX=n*t*Math.cos(o),e.velocityY=t*Math.sin(o)}function Se(e,t,o){T&&(t.y-=i.paddleSpeed),O&&(t.y+=i.paddleSpeed),U&&(o.y-=i.paddleSpeed),H&&(o.y+=i.paddleSpeed),t.y=Math.max(0,Math.min(t.y,e.height-t.height)),o.y=Math.max(0,Math.min(o.y,e.height-o.height))}function Ee(e,t){T&&(t.y-=i.paddleSpeed),O&&(t.y+=i.paddleSpeed),t.y=Math.max(0,Math.min(t.y,e.height-t.height))}function Le(){const e=document.getElementById("pong");return e?{canvas:e,context:e.getContext("2d")}:{canvas:null,context:null}}function F(e,t,o,n,r,s,a=!1,l="none"){e.fillStyle=s,e.fillRect(t,o,n,r),a&&(e.strokeStyle=l,e.lineWidth=2,e.strokeRect(0,0,n,r))}function q(e,t,o,n,r){e.fillStyle=r,e.beginPath(),e.arc(t,o,n,0,Math.PI*2,!1),e.closePath(),e.fill()}function j(e,t,o,n,r){e.fillStyle=r,e.font="45px fantasy",e.fillText(t.toString(),o,n)}function Be(e,t,o){q(t,o.x,0,30,i.itemsColor);for(let n=0;n<=e.height;n+=15)F(t,o.x,o.y+n,o.width,o.height,i.itemsColor)}function G(e,t,o,n,r,s){F(t,0,0,e.width,e.height,i.bgColor,!0,i.itemsColor),Be(e,t,s),j(t,o.score,e.width/4,e.height/5,i.itemsColor),j(t,n.score,3*e.width/4,e.height/5,i.itemsColor),F(t,o.x,o.y,o.width,o.height,i.itemsColor),F(t,n.x,n.y,n.width,n.height,i.itemsColor),q(t,r.x,r.y,r.radius,i.itemsColor)}function Ie(e,t){return e.top=e.y-e.radius,e.bottom=e.y+e.radius,e.left=e.x-e.radius,e.right=e.x+e.radius,t.top=t.y,t.bottom=t.y+t.height,t.left=t.x,t.right=t.x+t.width,e.right>t.left&&e.bottom>t.top&&e.left<t.right&&e.top<t.bottom}function z(e,t){t.x=e.width/2,t.y=e.height/2,i.resetSpeed&&(t.speed=i.ballSpeed),N(t)}function Pe(e,t,o){const n=t.y+t.height/2;t.y+=(o.y-n)*i.difficulty,t.y=Math.max(0,Math.min(t.y,e.height-t.height))}function Me(e,t,o,n){n.x+=n.velocityX,n.y+=n.velocityY,i.multiplayer||Pe(e,o,n),n.y+n.radius>e.height?(n.y=e.height-n.radius,n.velocityY=-n.velocityY):n.y-n.radius<0&&(n.y=n.radius,n.velocityY=-n.velocityY);const r=n.x<e.width/2?t:o;if(Ie(n,r)){Y===!1&&(n.speed=i.ballSpeed,Y=!0);let s=n.y-(r.y+r.height/2);s=s/(r.height/2);const a=s*Math.PI/4,l=n.x<e.width/2?1:-1;n.velocityX=l*n.speed*Math.cos(a),n.velocityY=n.speed*Math.sin(a),n.speed+=.1,l===1?n.x=r.x+r.width+n.radius:n.x=r.x-n.radius}if(n.x-n.radius<0?(o.score++,z(e,n)):n.x+n.radius>e.width&&(t.score++,z(e,n)),t.score===i.scoreLimit||o.score===i.scoreLimit){m=h.GAME_OVER;let s;t.score===i.scoreLimit?s="PLAYER 1 WINS!!!":i.multiplayer?s="PLAYER 2 WINS!!!":s="PLAYER 1 LOSES!!!",P(1,[{text:"Restart",onClick:()=>{A(e,t,o,n)}}]),xe(s)}}const Ae=document.querySelector("#app"),R={sidebarOpen:!1};class Fe{constructor(){this._isLoggedIn=!1,this.listeners=[]}get isLoggedIn(){return this._isLoggedIn}set isLoggedIn(t){this._isLoggedIn=t,this.listeners.forEach(o=>o())}subscribe(t){this.listeners.push(t)}}const p=new Fe;async function Ne(){const e=localStorage.getItem("token");if(e)try{const t=await fetch("undefined/auth/me",{headers:{Authorization:`Bearer ${e}`}});if(t.ok){const o=await t.json();p.isLoggedIn=!0,p.username=o.username,p.avatarUrl="/default-avatar.png",console.log("✅ Session restored:",p.username)}else localStorage.removeItem("token")}catch{localStorage.removeItem("token")}}async function I(e){Ae.innerHTML=`
		${Z}
		<main id="page-content" class="transition-all duration-300 pt-16 p-4">
			${e}
		</main>
		${re}
		${se}
		${ie}
		${ae}
	`,me(),ge(),ye(),Ce(),we()}function V(){switch(window.location.hash.slice(1)||"home"){case"about":I(Q);break;case"chat":I(ee);break;case"contact":I(te);break;case"stats":I(ne);break;case"userSettings":I(oe);break;default:I(K)}R.sidebarOpen=!1}window.addEventListener("DOMContentLoaded",async()=>{await Ne(),V()});window.addEventListener("hashchange",V);

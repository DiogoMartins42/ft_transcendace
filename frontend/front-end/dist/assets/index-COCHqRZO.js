(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function o(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=o(s);fetch(s.href,i)}})();const j=`<main id="page-content" class="pt-16 flex-1">
  <div class="fixed top-16 left-0 right-0 bottom-0 bg-[#242423] flex justify-center items-center">
    <div id="canvas-wrap" class="relative w-[800px] h-[600px]">
      <canvas id="pong" width="800" height="600"></canvas>

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
        class="absolute left-1/2 -translate-x-1/2 top-1 z-20 h-9 w-9 rounded-full bg-[#F5CB5C] text-black text-sm font-semibold shadow hover:bg-[#F5CB5C]"
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






 `,D=`<nav class="bg-[#5EB1BF] text-[#242423] font-bold w-screen
			flex items-center justify-between fixed top-0 left-0 right-0 h-18 z-50">
	<div class="flex gap-4 ml-4">
		<button id="menu-toggle" class="group cursor-pointer">
			<img 
				src="../assets/menu-icon-default.png"
				alt="Menu icon"
				id="menu-icon"
				class="select-none h-10 w-10 object-contain trnasition duration-200 group-hover:brightness-50"
			/>
		</button>
	</div>
	<a href="#home"  class="flex items-center gap-2 ml-2 absolute left-1/2 transform -translate-x-1/2">
		<button class="flex items-center gap-2 p-2 cursor-pointer">
			<img src="../assets/PONG-ICON-3.png" alt="Pong-icon"
		 			class="select-none h-16 w-16 object-contain">
		</button>
	</a>
	<div id="user-section" class="flex gap-4 mr-4">
		<!-- Divided into 2 files -->
  	</div>
</nav>`,G=`<section class="bg-amber-400 w-full h-screen m-0 p-0">
  <h1 class="text-2xl font-bold">ABOUT</h1>
</section>`,W=`<section>
  <h1 class="text-2xl font-bold">CHAT</h1>
  <div class="p-4">
    <h2 class="text-xl font-bold">Chat</h2>
    <div id="chat-messages" class="border p-2 h-64 overflow-y-auto bg-gray-100"></div>
    <input id="chat-input" type="text" class="border p-2 w-full mt-2" placeholder="Type a message..." />
    <button id="chat-send" class="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Send</button>
  </div>
</section>`,z=`<section>
  <h1 class="text-2xl font-bold">CONTACT US!</h1>
</section>`,$=`<section>
  <h1 class="text-2xl font-bold">STATS</h1>
</section>`,q=`<section>
  <h1 class="text-2xl font-bold">USER SETTINGS</h1>
</section>`,X=`<div id="login-modal" class="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 hidden">
    <form id="login-form" class="space-y-3 bg-[#242423] text-white rounded-lg shadow-lg w-full max-w-sm p-6">
      <h2 class="text-xl font-bold mb-4 text-white">Log In</h2>
      <input id="login-username" type="text" placeholder="Username" class="w-full p-2 border rounded border-amber-400" />
      <input id="login-password" type="password" placeholder="Password" class="w-full p-2 border rounded border-amber-400" />
      <div class="flex justify-end gap-2">
        <button type="button" id="cancel-login" class="cursor-pointer px-4 py-2 border rounded border-amber-400 hover:bg-amber-400">Cancel</button>
        <button type="submit" id="submit-login" class="cursor-pointer px-4 py-2 bg-amber-400 text-black rounded hover:bg-amber-200">Submit</button>
    </form>
  </div>
</div>
`,J=`<div id="signup-modal" class="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 hidden">
    <form id="signup-form" class="space-y-3 text-white bg-[#242423] rounded-lg shadow-lg w-full max-w-sm p-6">
      <h2 class="text-xl font-bold mb-4 text-white">Sign Up</h2>
      <input id="signup-usernama" type="text" placeholder="Username" class="w-full p-2 border rounded border-amber-400" />
      <input id="signup-email" type="email" placeholder="Email" class="w-full p-2 border rounded border-amber-400" />
      <input id="signup-password" type="password" placeholder="Password" class="w-full p-2 border rounded border-amber-400" />
      <div class="flex justify-center-safe gap-2">
        <button type="button" id="cancel-signup" class="px-4 py-2 border rounded border-amber-400 hover:bg-amber-400">Cancel</button>
        <button type="submit" class="px-4 py-2 bg-amber-400 text-black rounded hover:bg-amber-500">Register</button>
      </div>
    </form>
</div>`,V=`<!-- Sidebar -->
<aside
  id="sidebar"
  class="fixed flex-col justify-between top-18 left-0 w-48 h-screen bg-[#4092A0] gray-100 shadow-lg transform -translate-x-full transition-transform duration-300 z-40"
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
`,_=`<div id="controlPanel" class="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
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

`;let c=null;function K(e){const t="wss://localhost:3000/ws";return c=new WebSocket(t),c.onopen=()=>{console.log("Connected to WebSocket:",t),c?.send("Hello from frontend!")},c.onmessage=o=>{if(console.log("Message from server:",o.data),e)try{e(JSON.parse(o.data))}catch{console.warn("Received non-json message",o.data)}},c.onclose=()=>{console.log("Disconected from server!")},c.onerror=o=>{console.log("WebSocket error!",o)},c}function Z(e){c&&c.readyState===WebSocket.OPEN?c.send(JSON.stringify(e)):console.warn("Websocket closed!")}function Q(){const e=document.querySelector("#chat-input"),t=document.querySelector("#chat-send");e&&t&&t.addEventListener("click",()=>{e.value.trim()&&(Z({type:"chat",text:e.value}),e.value="")})}const ee=`<button id="open-login" class="px-4 py- border border-amber-400 rounded hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
    Log in
</button>
<button id="open-signup" class="mr-3 px-4 py-2 bg-amber-400 rounded hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
    Sign up
</button>`,te=`<div id="user-toggle" class="flex items-center gap-2 cursor-pointer select-none">
    <span class="font-bold text-[#f5cb5c]">{{username}}</span>
    <img src="{{avatarUrl}}" alt="Avatar" class=" mr-4 h-10 w-10 rounded-full object-cover">
    </div>

    <!-- Dropdown menu (initially hidden) -->
    <div id="user-menu" class="absolute right-0 mt-15 mr-2 w-48 bg-[#4092A0] rounded shadow-md border border-gray-200 hidden z-50">
    	<ul class="py-2 text-sm text-[#f5cb5c]">
        	<li><a href="#userSettings" class="block px-4 py-2 hover:bg-[#242423]">User Settings</a></li>
        	<li><a href="#chat" class="block px-4 py-2 hover:bg-[#242423]">Chat</a></li>
        	<li><a href="#stats" class="block px-4 py-2 hover:bg-[#242423]">Statistics</a></li>
          
        	<hr class="my-2 border-t border-[#242423] mx-2">
          
        	<li><button id="logout-btn" class="text-[#F02D3A] font-bold cursor-pointer w-full text-left px-4 py-2 hover:bg-[#242423]">Log out</button></li>
        </ul>
</div>`;async function E(e){const t=document.getElementById("user-section"),o=e?.username||"User",n=e?.avatarUrl||"../assets/avatar-default-icon.png";if(b.isLoggedIn){t.innerHTML=te.replace("{{username}}",o).replace("{{avatarUrl}}",n);const s=document.getElementById("user-toggle"),i=document.getElementById("user-menu");s.addEventListener("click",()=>{i.classList.toggle("hidden")}),document.addEventListener("click",u=>{t.contains(u.target)||i.classList.add("hidden")}),document.getElementById("logout-btn").addEventListener("click",async()=>{b.isLoggedIn=!1,await E()})}else t.innerHTML=ee,P()}function P(){const e=document.getElementById("login-modal"),t=document.getElementById("signup-modal"),o=document.getElementById("open-login"),n=document.getElementById("cancel-login"),s=document.getElementById("open-signup"),i=document.getElementById("cancel-signup"),a=document.getElementById("login-form"),u=document.getElementById("login-username"),I=document.getElementById("login-password"),g=document.getElementById("signup-form"),L=document.getElementById("signup-username"),v=document.getElementById("signup-password"),F=document.getElementById("signup-email"),A="http://localhost:3000";a&&!a.dataset.listenerAttached&&(a.addEventListener("submit",async h=>{h.preventDefault();const x=u.value.trim(),w=I.value.trim();if(!x||!w){alert("Please fill in both email and password.");return}try{const f=await fetch(`${A}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:x,password:w})}),m=await f.json();if(!f.ok){alert(m.error||"Invalid login credentials.");return}localStorage.setItem("token",m.token),b.isLoggedIn=!0,e?.classList.add("hidden"),a.reset(),await E({username:m.username,avatarUrl:m.avatarUrl||""})}catch(f){console.error(f),alert("Failed to connect to the server.")}}),a.dataset.listenerAttached="true"),g&&!g.dataset.listenerAttached&&(g.addEventListener("submit",async h=>{h.preventDefault();const x=L.value.trim(),w=F.value.trim(),f=v.value.trim();if(!x||!w||!f){alert("Please fill in all fields.");return}try{const m=await fetch(`${A}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:x,email:w,password:f})}),H=await m.json();if(!m.ok){alert(H.error||"Signup failed.");return}alert("Signup successful! You can now log in."),t?.classList.add("hidden"),g.reset()}catch(m){console.error(m),alert("Failed to connect to the server.")}}),g.dataset.listenerAttached="true"),o?.addEventListener("click",()=>e?.classList.remove("hidden")),n?.addEventListener("click",()=>e?.classList.add("hidden")),s?.addEventListener("click",()=>t?.classList.remove("hidden")),i?.addEventListener("click",()=>t?.classList.add("hidden")),e?.addEventListener("click",h=>{h.target===e&&e.classList.add("hidden")}),t?.addEventListener("click",h=>{h.target===t&&t.classList.add("hidden")})}function M(){const e=document.getElementById("menu-toggle"),t=document.getElementById("menu-icon"),o=document.getElementById("sidebar"),n=document.getElementById("page-content"),s="../assets/menu-icon-default.png",i="../assets/menu-icon-clicked.png";!e||!o||!n||!t||e.addEventListener("click",()=>{b.sidebarOpen=!b.sidebarOpen,b.sidebarOpen?(o.classList.remove("-translate-x-full"),t.src=i,n.classList.add("ml-48")):(o.classList.add("-translate-x-full"),t.src=s,n.classList.remove("ml-48"))})}let d={difficulty:.05,ballSpeed:3,scoreLimit:5,bgColor:"#1C39BB",itemsColor:"#F5CB5C"},O=!1,N=!1;const l={START:"start",PLAYING:"playing",PAUSED:"paused",GAME_OVER:"gameOver"};let r=l.START;window.addEventListener("keydown",e=>{e.key==="w"||e.key,e.key==="s"||e.key,e.key,e.key});window.addEventListener("keyup",e=>{e.key==="w"||e.key,e.key==="s"||e.key,e.key,e.key});function S(e,t){const o=document.getElementById("game-overlay"),n=document.getElementById("game-message"),s=document.getElementById("overlay-buttons");!o||!n||!s||(n.textContent=e,s.innerHTML="",t.forEach(i=>{const a=document.createElement("button");a.textContent=i.text,a.className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-200",a.onclick=i.onClick,s.appendChild(a)}),o.classList.remove("hidden"))}function p(){const e=document.getElementById("game-overlay");e&&e.classList.add("hidden")}function ne(){const{canvas:e,context:t}=se();if(!e||!t)return;const o={x:30,y:e.height/2-100/2,width:10,height:100,score:0},n={x:e.width-40,y:e.height/2-100/2,width:10,height:100,score:0},s={x:e.width/2,y:e.height/2,radius:10,velocityX:0,velocityY:0,speed:d.ballSpeed},i={x:e.width/2-1,y:0,width:2,height:10};o.y=e.height/2-o.height/2,n.y=e.height/2-n.height/2,s.x=e.width/2,s.y=e.height/2,s.velocityX=0,s.velocityY=0;const a=document.getElementById("pause-btn"),u=document.getElementById("openSettings"),I=v=>{oe(v,e,o)};e.addEventListener("mousemove",I),S("Click Start to play",[{text:"Start",onClick:()=>{r=l.PLAYING,p(),B(s)}}]),a&&a.addEventListener("click",()=>{r===l.PLAYING&&(r=l.PAUSED,S("",[{text:"Resume",onClick:()=>{r=l.PLAYING,p()}},{text:"Restart",onClick:()=>{C(e,o,n,s)}}]))}),u&&u.addEventListener("click",()=>{r===l.PLAYING&&(r=l.PAUSED,S("",[{text:"Resume",onClick:()=>{r=l.PLAYING,p()}},{text:"Restart",onClick:()=>{C(e,o,n,s)}}]))}),window.addEventListener("keydown",v=>{v.code==="Space"&&(r===l.PLAYING?(r=l.PAUSED,S("",[{text:"Resume",onClick:()=>{r=l.PLAYING,p()}},{text:"Restart",onClick:()=>{C(e,o,n,s)}}])):r===l.PAUSED?(r=l.PLAYING,p()):r===l.START&&(r=l.PLAYING,p(),B(s)))});function g(){if(r===l.START||r===l.PAUSED||r===l.GAME_OVER){T(e,t,o,n,s,i);return}de(e,o,n,s),T(e,t,o,n,s,i)}function L(){g(),requestAnimationFrame(L)}requestAnimationFrame(L)}function oe(e,t,o){const n=t.getBoundingClientRect();let s=e.clientY-n.top-o.height/2;s<0&&(s=0),s+o.height>t.height&&(s=t.height-o.height),o.y=s}function C(e,t,o,n){t.score=0,o.score=0,t.y=e.height/2-t.height/2,o.y=e.height/2-o.height/2,n.x=e.width/2,n.y=e.height/2,n.velocityX=0,n.velocityY=0,r=l.PLAYING,p(),B(n)}function B(e){let t=e.speed;O===!1&&(t=d.ballSpeed,O=!0);const o=Math.random()*Math.PI/2-Math.PI/4,n=Math.random()<.5?1:-1;e.velocityX=n*t*Math.cos(o),e.velocityY=t*Math.sin(o)}function se(){const e=document.getElementById("pong");return e?{canvas:e,context:e.getContext("2d")}:{canvas:null,context:null}}function k(e,t,o,n,s,i){e.fillStyle=i,e.fillRect(t,o,n,s)}function ie(e,t,o,n,s){e.fillStyle=s,e.beginPath(),e.arc(t,o,n,0,Math.PI*2,!1),e.closePath(),e.fill()}function R(e,t,o,n,s){e.fillStyle=s,e.font="45px fantasy",e.fillText(t.toString(),o,n)}function ae(e,t,o){for(let n=0;n<=e.height;n+=15)k(t,o.x,o.y+n,o.width,o.height,d.itemsColor)}function T(e,t,o,n,s,i){k(t,0,0,e.width,e.height,d.bgColor),ae(e,t,i),R(t,o.score,e.width/4,e.height/5,d.itemsColor),R(t,n.score,3*e.width/4,e.height/5,d.itemsColor),k(t,o.x,o.y,o.width,o.height,d.itemsColor),k(t,n.x,n.y,n.width,n.height,d.itemsColor),ie(t,s.x,s.y,s.radius,d.itemsColor)}function le(e,t){return e.top=e.y-e.radius,e.bottom=e.y+e.radius,e.left=e.x-e.radius,e.right=e.x+e.radius,t.top=t.y,t.bottom=t.y+t.height,t.left=t.x,t.right=t.x+t.width,e.right>t.left&&e.bottom>t.top&&e.left<t.right&&e.top<t.bottom}function U(e,t){t.x=e.width/2,t.y=e.height/2,t.speed=d.ballSpeed,B(t)}function re(e,t,o){const n=t.y+t.height/2;t.y+=(o.y-n)*d.difficulty,t.y=Math.max(0,Math.min(t.y,e.height-t.height))}function de(e,t,o,n){n.x+=n.velocityX,n.y+=n.velocityY,re(e,o,n),n.y+n.radius>e.height?(n.y=e.height-n.radius,n.velocityY=-n.velocityY):n.y-n.radius<0&&(n.y=n.radius,n.velocityY=-n.velocityY);const s=n.x<e.width/2?t:o;if(le(n,s)){N===!1&&(n.speed=d.ballSpeed,N=!0);let i=n.y-(s.y+s.height/2);i=i/(s.height/2);const a=i*Math.PI/4,u=n.x<e.width/2?1:-1;n.velocityX=u*n.speed*Math.cos(a),n.velocityY=n.speed*Math.sin(a),n.speed+=.1,u===1?n.x=s.x+s.width+n.radius:n.x=s.x-n.radius}if(n.x-n.radius<0?(o.score++,U(e,n)):n.x+n.radius>e.width&&(t.score++,U(e,n)),t.score===d.scoreLimit||o.score===d.scoreLimit){r=l.GAME_OVER;let i="";t.score===d.scoreLimit?i="PLAYER 1 WINS!!!":i="PLAYER 1 LOSES!!!",S(i,[{text:"Restart",onClick:()=>{C(e,t,o,n)}}])}}const ce=document.querySelector("#app"),b={isLoggedIn:!1,sidebarOpen:!1};async function y(e){ce.innerHTML=`
		${D}
		<main id="page-content" class="transition-all duration-300 pt-16 p-4">
			${e}
		</main>
		${X}
		${J}
		${V}
		${_}
	`,P(),M(),E(),P(),M(),E(),ne()}function Y(){switch(window.location.hash.slice(1)||"home"){case"about":y(G);break;case"chat":y(W),Q();break;case"contact":y(z);break;case"stats":y($);break;case"userSettings":y(q);break;default:y(j)}b.sidebarOpen=!1}window.addEventListener("DOMContentLoaded",()=>{Y(),K(e=>{if(console.log("Frontend received WS:",e),window.location.hash.slice(1)==="chat"){const t=document.querySelector("#chat-messages");if(t){const o=document.createElement("div");o.textContent=JSON.stringify(e),t.appendChild(o)}}})});window.addEventListener("hashchange",Y);

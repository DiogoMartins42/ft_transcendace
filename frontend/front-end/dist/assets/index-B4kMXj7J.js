(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function o(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=o(s);fetch(s.href,i)}})();const x=`<body>
  <canvas id="pong" width="800" height="600"></canvas>
</body>


`,w=`<nav class="bg-[#5EB1BF] text-[#242423] font-bold top-0 w-screen h-18
			relative flex items-center justify-between">
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
</nav>`,L=`<section>
  <h1 class="text-2xl font-bold">ABOUT</h1>
</section>`,E=`<section>
  <h1 class="text-2xl font-bold">CHAT</h1>
</section>`,I=`<section>
  <h1 class="text-2xl font-bold">CONTACT US!</h1>
</section>`,B=`<section>
  <h1 class="text-2xl font-bold">STATS</h1>
</section>`,S=`<section>
  <h1 class="text-2xl font-bold">USER SETTINGS</h1>
</section>`,k=`<div id="login-modal" class="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 hidden">
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
`,P=`<div id="signup-modal" class="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 hidden">
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
</div>`,C=`<!-- Sidebar -->
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
  <!-- <div class="p-4">
	<img 	
		src="../assets/PONG-ICON-3.png" 
		alt="Pong-icon"
		class="h-16 w-16 object-contain mx-auto">
  </div> -->
</aside>
`,H=`<button id="open-login" class="px-4 py-2 border border-amber-400 rounded hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
    Log in
</button>
<button id="open-signup" class="px-4 py-2 bg-amber-400 rounded hover:bg-amber-200 hover:text-gray-800 transition cursor-pointer">
    Sign up
</button>`,O=`<div id="user-toggle" class="flex items-center gap-2 cursor-pointer select-none">
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
</div>`;async function m(){const t=document.getElementById("user-section"),e="Anakin Skywalker",o="../assets/avatar-default-icon.png";if(d.isLoggedIn){t.innerHTML=O.replace("{{username}}",e).replace("{{avatarUrl}}",o);const n=document.getElementById("user-toggle"),s=document.getElementById("user-menu");n.addEventListener("click",()=>{s.classList.toggle("hidden")}),document.addEventListener("click",r=>{t.contains(r.target)||s.classList.add("hidden")}),document.getElementById("logout-btn").addEventListener("click",async()=>{d.isLoggedIn=!1,await m()})}else t.innerHTML=H,b()}function b(){const t=document.getElementById("login-modal"),e=document.getElementById("signup-modal"),o=document.getElementById("open-login"),n=document.getElementById("cancel-login"),s=document.getElementById("open-signup"),i=document.getElementById("cancel-signup"),r=document.getElementById("login-form"),c=document.getElementById("login-username"),u=document.getElementById("login-password");o?.addEventListener("click",()=>{t?.classList.remove("hidden")}),n?.addEventListener("click",()=>{t?.classList.add("hidden")}),r&&!r.dataset.listenerAttached&&(r.addEventListener("submit",async a=>{a.preventDefault();const h=c?.value.trim(),v=u?.value.trim();if(!h||!v){alert("Please fill in both username and password.");return}d.isLoggedIn=!0,t?.classList.add("hidden"),r.reset(),await m()}),r.dataset.listenerAttached="true"),t?.addEventListener("click",a=>{a.target===t&&t.classList.add("hidden")}),s?.addEventListener("click",()=>{e?.classList.remove("hidden")}),i?.addEventListener("click",()=>{e?.classList.add("hidden")}),e?.addEventListener("click",a=>{a.target===e&&e.classList.add("hidden")})}function T(){const t=document.getElementById("menu-toggle"),e=document.getElementById("menu-icon"),o=document.getElementById("sidebar"),n=document.getElementById("page-content"),s="../assets/menu-icon-default.png",i="../assets/menu-icon-clicked.png";!t||!o||!n||!e||t.addEventListener("click",()=>{d.sidebarOpen=!d.sidebarOpen,d.sidebarOpen?(o.classList.remove("-translate-x-full"),e.src=i,n.classList.add("ml-48")):(o.classList.add("-translate-x-full"),e.src=s,n.classList.remove("ml-48"))})}function M(){const{canvas:t,context:e}=A();if(!t||!e)return;const o={x:0,y:t.height/2-100/2,width:10,height:100,color:"WHITE",score:0},n={x:t.width-10,y:t.height/2-100/2,width:10,height:100,color:"WHITE",score:0},s={x:t.width/2,y:t.height/2,radius:10,speed:5,velocityX:5,velocityY:5,color:"WHITE"},i={x:t.width/2-1,y:0,width:2,height:10,color:"white"};t.addEventListener("mousemove",r);function r(a){let h=t.getBoundingClientRect();o.y=a.clientY-h.top-o.height/2}function c(){F(t,o,n,s),N(t,e,o,n,s,i)}setInterval(c,1e3/50)}function A(){const t=document.getElementById("pong");return t?{canvas:t,context:t.getContext("2d")}:{canvas:null,context:null}}function g(t,e,o,n,s,i){t.fillStyle=i,t.fillRect(e,o,n,s)}function U(t,e,o,n,s){t.fillStyle=s,t.beginPath(),t.arc(e,o,n,0,Math.PI*2,!1),t.closePath(),t.fill()}function f(t,e,o,n,s){t.fillStyle=s,t.font="45px fantasy",t.fillText(e.toString(),o,n)}function j(t,e,o){for(let n=0;n<=t.height;n+=15)g(e,o.x,o.y+n,o.width,o.height,o.color)}function N(t,e,o,n,s,i){g(e,0,0,t.width,t.height,"black"),j(t,e,i),f(e,o.score,t.width/4,t.height/5,"white"),f(e,n.score,3*t.width/4,t.height/5,"white"),g(e,o.x,o.y,o.width,o.height,o.color),g(e,n.x,n.y,n.width,n.height,n.color),U(e,s.x,s.y,s.radius,s.color)}function R(t,e){return t.top=t.y-t.radius,t.bottom=t.y+t.radius,t.left=t.x-t.radius,t.right=t.x+t.radius,e.top=e.y,e.bottom=e.y+e.height,e.left=e.x,e.right=e.x+e.width,t.right>e.left&&t.bottom>e.top&&t.left<e.right&&t.top<e.bottom}function p(t,e){e.x=t.width/2,e.y=t.height/2,e.velocityX=-e.velocityX}function F(t,e,o,n){n.x+=n.velocityX,n.y+=n.velocityY;let s=.1;o.y=n.y-(o.y+o.height/2)*s,(n.y+n.radius>t.height||n.y-n.radius<0)&&(n.velocityY=-n.velocityY);let i=n.x<t.width/2?e:o;if(R(n,i)){let r=n.y-(i.y+i.height);r=r/(i.height/2);let c=r*Math.PI/4,u=n.x<t.width/2?1:-1;n.velocityX=u*n.speed*Math.cos(c),n.velocityY=n.speed*Math.sin(c),n.speed+=.5}n.x-n.radius<0?(o.score++,p(t,n)):n.x+n.radius>t.width&&(e.score++,p(t,n))}const Y=document.querySelector("#app"),d={isLoggedIn:!1,sidebarOpen:!1};async function l(t){Y.innerHTML=`
    ${w}
    <main id="page-content" class="transition-all duration-300 pt-16 p-4">
      ${t}
    </main>
    ${k}
    ${P}
    ${C}
  `,b(),T(),m(),M()}function y(){switch(window.location.hash.slice(1)||"home"){case"about":l(L);break;case"chat":l(E);break;case"contact":l(I);break;case"stats":l(B);break;case"userSettings":l(S);break;default:l(x)}d.sidebarOpen=!1}window.addEventListener("DOMContentLoaded",y);window.addEventListener("hashchange",y);

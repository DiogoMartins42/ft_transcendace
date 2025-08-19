export let gameSettings: {difficulty: number, resetSpeed: boolean, 
	multiplayer: boolean, mouse: boolean, paddleSpeed: number, ballSpeed: number, 
	scoreLimit: number, bgColor: string, itemsColor: string, default: boolean} =
{
	//Defalut settings

	//Single player settings (should be disabled when multiplayer is true)
	difficulty: 0.05, //input: 3 radio for easy(0.05), normal(0.1), hard(0.3) 
	mouse: true, //input: radio with two options, mouse for true and keyboard for false

	//modes
	multiplayer: false, //input: radio with two options, multiplayer for true and sigle player for false

	//general settings
	resetSpeed: true, //input: checkbox
	paddleSpeed: 5, // input: range from 1 to 10
	ballSpeed: 3,  // input: range from 1 to 10 
	scoreLimit: 5, //input: number, must be > 0
	bgColor: '#1C39BB', //input: color
	itemsColor: '#F5CB5C', //input: color
	default: false, //input: button that if clicked will reset all settings except modes to their default state
}

export function setupControlPanel() {
    const openBtnSettings = document.getElementById('openSettings');
    const closeBtnSettings = document.getElementById('closeSettings');
    const controlPanel = document.getElementById('controlPanel');

    const paddleSpeedInput = document.getElementById('paddleSpeed') as HTMLInputElement;
    const paddleSpeedValue = document.getElementById('paddleSpeedValue') as HTMLElement;

    const ballSpeedInput = document.getElementById('ballSpeed') as HTMLInputElement;
    const ballSpeedValue = document.getElementById('ballSpeedValue') as HTMLElement;

    const scoreLimitInput = document.getElementById('scoreLimit') as HTMLInputElement;
    const bgColorInput = document.getElementById('bgColor') as HTMLInputElement;
    const itemsColorInput = document.getElementById('itemsColor') as HTMLInputElement;

    const resetSpeedInput = document.getElementById('resetSpeed') as HTMLInputElement;
    const resetDefaultsBtn = document.getElementById('resetDefaults') as HTMLButtonElement;

    // Radios
    const difficultyRadios = document.querySelectorAll<HTMLInputElement>('input[name="difficulty"]');
    const mouseRadios = document.querySelectorAll<HTMLInputElement>('input[name="mouse"]');
    const multiplayerRadios = document.querySelectorAll<HTMLInputElement>('input[name="multiplayer"]');

    // --- FUNCTIONS ---

    function loadSettingsIntoForm() {
        // Difficulty
        difficultyRadios.forEach(r => {
            r.checked = Number(r.value) === gameSettings.difficulty;
        });

        // Mouse / Keyboard
        mouseRadios.forEach(r => {
            r.checked = (r.value === "true") === gameSettings.mouse;
        });

        // Multiplayer
        multiplayerRadios.forEach(r => {
            r.checked = (r.value === "true") === gameSettings.multiplayer;
        });

        // Checkbox
        resetSpeedInput.checked = gameSettings.resetSpeed;

        // Range
        paddleSpeedInput.value = gameSettings.paddleSpeed.toString();
        paddleSpeedValue.textContent = paddleSpeedInput.value;

        ballSpeedInput.value = gameSettings.ballSpeed.toString();
        ballSpeedValue.textContent = ballSpeedInput.value;

        // Number
        scoreLimitInput.value = gameSettings.scoreLimit.toString();

        // Colors
        bgColorInput.value = gameSettings.bgColor;
        itemsColorInput.value = gameSettings.itemsColor;
    }

    function attachChangeListeners() {
        difficultyRadios.forEach(r => {
            r.addEventListener('change', () => {
                gameSettings.difficulty = Number(r.value);
            });
        });

        mouseRadios.forEach(r => {
            r.addEventListener('change', () => {
               if (gameSettings.multiplayer === false) gameSettings.mouse = (r.value === "true");
            });
        });

        multiplayerRadios.forEach(r => {
            r.addEventListener('change', () => {
                gameSettings.multiplayer = (r.value === "true");
				gameSettings.mouse = false;
            });
        });

        resetSpeedInput.addEventListener('change', () => {
            gameSettings.resetSpeed = resetSpeedInput.checked;
        });

        paddleSpeedInput.addEventListener('input', () => {
            gameSettings.paddleSpeed = Number(paddleSpeedInput.value);
            paddleSpeedValue.textContent = paddleSpeedInput.value;
        });

        ballSpeedInput.addEventListener('input', () => {
            gameSettings.ballSpeed = Number(ballSpeedInput.value);
            ballSpeedValue.textContent = ballSpeedInput.value;
        });

        scoreLimitInput.addEventListener('input', () => {
            const val = Number(scoreLimitInput.value);
            if (val > 0) {
                gameSettings.scoreLimit = val;
            }
        });

        bgColorInput.addEventListener('input', () => {
            gameSettings.bgColor = bgColorInput.value;
        });

        itemsColorInput.addEventListener('input', () => {
            gameSettings.itemsColor = itemsColorInput.value;
        });

        resetDefaultsBtn.addEventListener('click', () => {
            gameSettings = {
                ...gameSettings,
                difficulty: 0.05,
                mouse: false,
                resetSpeed: true,
                paddleSpeed: 5,
                ballSpeed: 3,
                scoreLimit: 5,
                bgColor: '#1C39BB',
                itemsColor: '#F5CB5C',
                default: true
            };
            loadSettingsIntoForm();
        });
    }

    // --- OPEN / CLOSE ---

    openBtnSettings?.addEventListener('click', () => {
        loadSettingsIntoForm();
        controlPanel?.classList.remove('hidden');
    });

    closeBtnSettings?.addEventListener('click', () => {
        controlPanel?.classList.add('hidden');
    });

    controlPanel?.addEventListener('click', (e) => {
        if (e.target === controlPanel) {
            controlPanel.classList.add('hidden');
        }
    });

    attachChangeListeners();
}
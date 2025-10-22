import { gameSettings } from './gameSettings';

export function setupControlPanel() {

    // Object.assign(gameSettings, {
    //     difficulty: gameSettings.difficulty,
    //     mouse: gameSettings.mouse,
    //     resetSpeed: gameSettings.resetSpeed,
    //     paddleSpeed: gameSettings.paddleSpeed,
    //     ballSpeed: gameSettings.ballSpeed,
    //     scoreLimit: gameSettings.scoreLimit,
    //     default: true
    // });

    //const openBtnSettings = document.getElementById('openSettings');
    const closeBtnSettings = document.getElementById('closeSettings');
    const controlPanel = document.getElementById('controlPanel');

    const paddleSpeedInput = document.getElementById('paddleSpeed') as HTMLInputElement;
    const paddleSpeedValue = document.getElementById('paddleSpeedValue') as HTMLElement;

    const ballSpeedInput = document.getElementById('ballSpeed') as HTMLInputElement;
    const ballSpeedValue = document.getElementById('ballSpeedValue') as HTMLElement;

    const scoreLimitInput = document.getElementById('scoreLimit') as HTMLInputElement;
    // const bgColorInput = document.getElementById('bgColor') as HTMLInputElement;
    // const itemsColorInput = document.getElementById('itemsColor') as HTMLInputElement;

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

        // Remove color inputs as they're handled in gameSettings.ts
        // bgColorInput.value = gameSettings.bgColor;
        // itemsColorInput.value = gameSettings.itemsColor;
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

        // bgColorInput.addEventListener('input', () => {
        //     gameSettings.bgColor = bgColorInput.value;
        // });

        // itemsColorInput.addEventListener('input', () => {
        //     gameSettings.itemsColor = itemsColorInput.value;
        // });

        resetDefaultsBtn.addEventListener('click', () => {
            // Modify properties instead of reassignment
            Object.assign(gameSettings, {
                difficulty: 0.05,
                resetSpeed: true,
                multiplayer: false,
                mouse: true,
                paddleSpeed: 5,
                ballSpeed: 3,
                scoreLimit: 5,
                default: true,
            });
            loadSettingsIntoForm();
        });
    }

    // --- OPEN / CLOSE ---

    // openBtnSettings?.addEventListener('click', () => {
    //     loadSettingsIntoForm();
    //     controlPanel?.classList.toggle('hidden');
    // });
    
    closeBtnSettings?.addEventListener('click', () => {
        controlPanel?.classList.add('hidden');
    });

    // controlPanel?.classList.toggle('hidden');
    // Populate form once now (so default values show) and whenever the modal is opened.
    loadSettingsIntoForm();

    // Observe class changes so we reload inputs when other code toggles the modal visibility
    if (controlPanel) {
        const observer = new MutationObserver(() => {
            if (!controlPanel.classList.contains('hidden')) {
                loadSettingsIntoForm();
            }
        });
        observer.observe(controlPanel, { attributes: true, attributeFilter: ['class'] });
    }

    attachChangeListeners();
}
import { setupPong } from "./setupPong";

export interface VisualSettings {
    bgColor: string;
    itemsColor: string;
}

export interface LocalGameSettings {
    difficulty: number;
    resetSpeed: boolean;
    multiplayer: boolean;
    mouse: boolean;
    paddleSpeed: number;
    ballSpeed: number;
    scoreLimit: number;
    default: boolean;
}

export interface GameSettings extends VisualSettings, LocalGameSettings {
    canvasWidth: number;
    canvasHeight: number;
}

export const gameSettings: GameSettings = {
    // Visual settings (shared between local and multiplayer)
    bgColor: '#1C39BB',
    itemsColor: '#F5CB5C',

    // Local game settings
    difficulty: 0.05,
    resetSpeed: true,
    multiplayer: false,
    mouse: true,
    paddleSpeed: 5,
    ballSpeed: 3,
    scoreLimit: 5,
    default: false,

    // Canvas dimensions
    canvasWidth: 1000,
    canvasHeight: 600,
};

export const visualSettings: VisualSettings = {
    get bgColor() { return gameSettings.bgColor; },
    get itemsColor() { return gameSettings.itemsColor; }
};

export function setupGameSettings() {
    const closeBtnSettings = document.getElementById('closeGeneralSettings');
    const settingsModal = document.getElementById('gameSettingsModal');

    const bgColorInput = document.getElementById('bgColor') as HTMLInputElement;
    const itemsColorInput = document.getElementById('itemsColor') as HTMLInputElement;

    const resetDefaultsBtn = document.getElementById('resetDefaultColor') as HTMLButtonElement;

    function loadSettingsIntoForm() {
        // Colors
        bgColorInput.value = gameSettings.bgColor;
        itemsColorInput.value = gameSettings.itemsColor;
    }

    function attachChangeListeners() {
        bgColorInput.addEventListener('input', () => {
            gameSettings.bgColor = bgColorInput.value;
        });

        itemsColorInput.addEventListener('input', () => {
            gameSettings.itemsColor = itemsColorInput.value;
        });

        resetDefaultsBtn.addEventListener('click', () => {
            gameSettings.bgColor = '#1C39BB';
            gameSettings.itemsColor = '#F5CB5C';
            gameSettings.default = true;
            loadSettingsIntoForm();
        });
    }

    closeBtnSettings?.addEventListener('click', () => {
        settingsModal?.classList.add('hidden');
        setupPong();
    });

    settingsModal?.classList.toggle('hidden');
    attachChangeListeners();
}
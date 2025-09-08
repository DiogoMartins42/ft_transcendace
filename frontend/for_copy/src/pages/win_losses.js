const { getUserInfo } = require('./init.js');

// Async function to get and export user data
async function getUserData(username = "test") {
    try {
        const userData = await getUserInfo(username);
        return userData;
    } catch (error) {
        console.error('Error fetching data from database:', error);
        // Fallback data in case of error
        return {
            username: "test",
            email: "test@gmail.com",
            wins: 42,
            losses: 28
        };
    }
}

// If you're using this in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getUserData };
}

// If you're using it in the browser (via bundler or API fetch)
if (typeof window !== 'undefined') {
    let userDataCache = null;

    async function loadUserData(username = "test") {
        try {
            const response = await fetch(`/api/user-stats?username=${username}`);
            const data = await response.json();
            userDataCache = data;
            return data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    }

    window.userStats = {
        loadUserData,
        getCachedData: () => userDataCache
    };
}

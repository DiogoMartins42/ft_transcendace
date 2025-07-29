const { addUser, initDB } = require('./init.js');

// First, ensure DB and table exist
initDB();

// Then insert your user (with a slight delay to allow table creation)
setTimeout(() => {
  addUser("rcruz-an2222", "thisIsMySuperSecurePassword", "rcruz-an@gmail.com");
}, 100); // 100ms is usually enough
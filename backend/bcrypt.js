const bcrypt = require("bcryptjs");

const password = "password123"; // User's password

// Hash the password before storing it in the database
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }

  // Now save the hashedPassword to the database instead of the plain password
  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(query, ["user123", hashedPassword], (err, results) => {
    if (err) {
      console.error("Error inserting into database:", err);
    } else {
      console.log("User added successfully!");
    }
  });
});

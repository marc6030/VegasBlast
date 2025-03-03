const mysql = require("mysql2");
const { Client } = require("ssh2");
const net = require("net");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

// SSH Configuration
const sshConfig = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT,
  username: process.env.SSH_USERNAME,
  password: process.env.SSH_PASSWORD,
};

// MySQL Configuration
const localPort = process.env.MYSQL_LOCAL_PORT; // Local port for the tunnel
const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  port: localPort,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

// Function to create the SSH tunnel and connect to MySQL database
function createSSHTunnel() {
  return new Promise((resolve, reject) => {
    const sshClient = new Client();

    sshClient.on("ready", () => {
      console.log("SSH connection established.");

      sshClient.forwardOut(
        "127.0.0.1",
        localPort,
        "127.0.0.1",
        3306,
        (err, stream) => {
          if (err) {
            sshClient.end();
            return reject(err);
          } else {
            const server = net.createServer((socket) => {
              stream.pipe(socket);
              socket.pipe(stream);
            });

            server.listen(localPort, "127.0.0.1", () => {
              console.log(`Tunnel established at localhost:${localPort}`);
              resolve({ server, sshClient });
            });
          }
        }
      );
    });

    sshClient.on("error", (err) => {
      console.error("SSH connection error:", err);
      reject(err);
    });

    sshClient.connect(sshConfig);
  });
}

// Function to connect to MySQL database and execute queries
async function connectToDatabase() {
  try {
    const { server, sshClient } = await createSSHTunnel();

    const db = mysql.createConnection(mysqlConfig);

    db.connect((err) => {
      if (err) {
        console.error("Database connection error:", err);
        return;
      }
      console.log("Connected to MySQL database.");

      // Example query to update saldo
      const query = "UPDATE users SET saldo = 3000 WHERE id = 1;";
      db.query(query, (error, results) => {
        if (error) {
          console.error("Error updating saldo:", error);
        } else {
          console.log("Saldo updated successfully:", results);
        }

        // Close the connections after the query is executed
        db.end((err) => {
          if (err) {
            console.error("Error closing DB connection:", err);
          } else {
            console.log("Database connection closed.");
          }
        });
        sshClient.end();
        server.close();
      });
    });
  } catch (error) {
    console.error("Failed to create SSH tunnel:", error);
  }
}

module.exports = { connectToDatabase };

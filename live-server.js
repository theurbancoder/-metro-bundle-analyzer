// live-server.js
const WebSocket = require("ws");
const http = require("http");

const PORT = 9876;

const wss = new WebSocket.Server({ port: PORT });
console.log(`📡 Live WebSocket server running at ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
  console.log("🔌 Client connected");
});

function broadcast(message) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

// Also allow Babel to send data via HTTP POST
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/update") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      broadcast(body);
      res.writeHead(200);
      res.end("OK");
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(9877, () => {
  console.log(`📮 HTTP server listening on http://localhost:9877/update`);
});

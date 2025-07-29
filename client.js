const output = document.getElementById("output");
const nameField = document.getElementById("name");
const sizeField = document.getElementById("size");
const socket = new WebSocket("ws://localhost:9876");

socket.onopen = () => {
  console.log("✅ WebSocket connection opened");
  output.textContent =
    "Connected to WebSocket server.\nWaiting for messages...";
};

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    console.log(event.data);
    output.textContent = "Reading bundle";
    nameField.textContent = data.name;
    sizeField.textContent = data.size;
  } catch (err) {
    output.textContent = event.data;
  }
};

socket.onerror = (error) => {
  console.error("❌ WebSocket error:", error);
  output.textContent = "WebSocket error. See console.";
};

socket.onclose = () => {
  console.warn("🔌 WebSocket connection closed");
  output.textContent = "Connection closed.";
};

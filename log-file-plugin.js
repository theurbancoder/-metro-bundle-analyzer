// log-file-plugin.js
const fs = require("fs");
const path = require("path");
const http = require("http");

const projectRoot = process.cwd(); // this is your project root
const seen = new Set();
const nodeModules = {};

function sendToLiveServer(name, size) {
  const req = http.request({
    hostname: "localhost",
    port: 9877,
    path: "/update",
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "Content-Length": Buffer.byteLength(size),
    },
  });

  req.on("error", (err) => {
    // ignore if server is not running
  });

  const data = {
    name,
    size,
    timestamp: Date.now(),
  };

  const json = JSON.stringify(data);

  req.write(json);
  req.end();
}

const hideNodeModules = false;

const printModule = (name, size) => {
  sendToLiveServer(name, size);
  console.log(`[BABEL] Transformed code size: ${name} (${size} KB)`);
};

module.exports = function logFilePlugin() {
  return {
    name: "log-file-plugin",
    visitor: {
      Program(_path, state) {
        const { filename, code } = state.file.opts;
        const absolutePath = state.file.opts.filename;
        const relativePath = path.relative(projectRoot, absolutePath);

        if (!seen.has(filename)) {
          seen.add(filename);
          try {
            const stats = fs.statSync(absolutePath);
            const kb = stats.size / 1024;

            const parts = relativePath.split("/");
            let formattedSize = "";
            let name = "";
            if (parts?.[0] === "node_modules") {
              if (hideNodeModules) {
                return;
              }
              const moduleName = parts?.[1];
              const previousSize = nodeModules[moduleName] || 0;
              nodeModules[moduleName] = previousSize + kb;
              formattedSize = nodeModules[moduleName].toFixed(2);
              name = `${parts?.[0]}/${parts?.[1]}`;
              printModule(name, formattedSize);
            } else {
              formattedSize = kb.toFixed(2);
              name = relativePath;
              printModule(name, formattedSize);
            }
          } catch (e) {
            console.warn(`[BABEL] Failed to stat: ${relativePath}`, e);
          }
        }
      },
    },
  };
};

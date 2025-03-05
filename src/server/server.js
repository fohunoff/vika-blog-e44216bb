
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the TypeScript compiler
const tscPath = path.resolve(__dirname, '../../node_modules/.bin/tsc');

// Path to the server tsconfig file
const tsconfigPath = path.resolve(__dirname, '../../tsconfig.server.json');

// Ensure server directory exists
const serverDistDir = path.resolve(__dirname, '../../dist');
if (!fs.existsSync(serverDistDir)) {
  fs.mkdirSync(serverDistDir, { recursive: true });
}

// Compile TypeScript files using the server tsconfig
console.log('Compiling server TypeScript files...');
const compile = exec(`"${tscPath}" -p "${tsconfigPath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Compilation error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Compilation stderr: ${stderr}`);
  }
  
  console.log('TypeScript compilation completed successfully.');
  
  // Run the compiled server
  console.log('Starting server...');
  
  // Path to the compiled main.js file
  const mainJsPath = path.resolve(__dirname, '../../dist/server/main.js');
  
  // Check if the main.js file exists
  if (!fs.existsSync(mainJsPath)) {
    console.error(`Server entry point not found: ${mainJsPath}`);
    return;
  }
  
  // Run the server
  const server = exec(`node "${mainJsPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Server error: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`Server stderr: ${stderr}`);
    }
  });
  
  // Forward stdout and stderr
  server.stdout.on('data', (data) => {
    console.log(data.toString().trim());
  });
  
  server.stderr.on('data', (data) => {
    console.error(data.toString().trim());
  });
});

// Forward stdout and stderr from the compilation process
compile.stdout.on('data', (data) => {
  console.log(data.toString().trim());
});

compile.stderr.on('data', (data) => {
  console.error(data.toString().trim());
});

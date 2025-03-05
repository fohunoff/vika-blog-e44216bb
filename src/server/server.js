
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create a .env file if it doesn't exist
const envPath = path.join(__dirname, '../../.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file with default PostgreSQL configuration...');
  const defaultEnv = `
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=food_blog
`;
  fs.writeFileSync(envPath, defaultEnv);
}

// Compile TypeScript files
console.log('Compiling TypeScript files...');
exec('npx tsc -p tsconfig.server.json', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error compiling TypeScript: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`TypeScript compilation stderr: ${stderr}`);
  }
  
  // Start the NestJS application
  console.log('Starting NestJS application...');
  require('../../dist/server/main');
});

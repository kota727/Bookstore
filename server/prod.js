// This script will build the frontend and start the backend server for production
// Usage: npm run prod (after adding this script to package.json)
const { execSync } = require('child_process');

try {
  console.log('Building frontend...');
  execSync('npm run build', { stdio: 'inherit', cwd: '../' });
  console.log('Starting backend server...');
  execSync('node index.js', { stdio: 'inherit' });
} catch (err) {
  console.error('Error during production start:', err);
  process.exit(1);
}

const https = require('https');
const fs = require('fs');

const url = 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Toyota.svg';
const dest = 'a:/toyota-salary-slip-system/public/toyota-logo.svg';

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: ${res.statusCode}`);
    return;
  }
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync(dest, data);
    console.log('Logo downloaded successfully');
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});

// print-qr.js
const qrcode = require('qrcode-terminal');

// 手動でngrokで発行されたURLをここに貼ってください
const ngrokUrl = 'https://1928-210-129-13-208.ngrok-free.app';  // ← 実際のURLに書き換える

qrcode.generate(ngrokUrl, { small: true });
console.log(`Access this URL on your phone: ${ngrokUrl}`);
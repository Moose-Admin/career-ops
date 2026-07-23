const fs = require('fs');
const b = fs.readFileSync('all_urls_meta.json');
const s = b.toString('utf8').replace(/[^\x20-\x7E\r\n\t]/g, '');
const regex = /https?:\/\/[^\s\"',\]\)]+/g;
const urls = [...new Set(s.match(regex))];
console.log(urls.join('\n'));

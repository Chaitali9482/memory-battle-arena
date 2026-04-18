const fs = require('fs');
const path = './apps/memory-game/src/data/learning.json';
const data = require(path);

function transform(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(item => {
      if (item.question) {
        item.question = item.question
          .replace(/^What is /i, '')
          .replace(/\?$/i, '');
      }
    });
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) transform(obj[key]);
  }
}

transform(data);
fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed learning questions');

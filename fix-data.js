l̥const fs = require('fs');
const path = './apps/memory-game/src/data/learning.json';
const data = require(path);

function transform(obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const item = obj[i];
      if (item.question !== undefined) {
        obj[i] = {
          q: item.question,
          a: item.answer,
          pairId: item.id
        };
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) transform(obj[key]);
  }
}

transform(data);
fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed learning data format');

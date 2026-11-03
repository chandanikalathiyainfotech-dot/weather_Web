const fs = require('fs');
const p = 'C:/chandani/weather/frontend/src/components/Siderbar.jsx';
let c = fs.readFileSync(p, 'utf8');
const old = \        const data = [...citylocal, trimmed];
        localStorage.setItem('city', JSON.stringify(data));\;
const neu = \        const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        const data = [...citylocal, formatted];
        localStorage.setItem('city', JSON.stringify(data));\;
if (c.includes(old)) {
  c = c.replace(old, neu);
  fs.writeFileSync(p, c);
  console.log('ok');
} else {
  console.log('no');
}

const fs = require('fs');
const p = 'C:/chandani/weather/frontend/src/components/Siderbar.jsx';
let c = fs.readFileSync(p, 'utf8');
const oldStr = "        const data = [...citylocal, trimmed];\n        localStorage.setItem('city', JSON.stringify(data));";
const newStr = "        const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();\n        const data = [...citylocal, formatted];\n        localStorage.setItem('city', JSON.stringify(data));";
if (c.indexOf(oldStr) !== -1) {
  c = c.split(oldStr).join(newStr);
  fs.writeFileSync(p, c);
  console.log('ok');
} else {
  console.log('no');
}

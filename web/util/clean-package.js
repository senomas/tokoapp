import fs from 'fs';

const data = JSON.parse(fs.readFileSync('package.json').toString());
data.scripts = {
  build: data.scripts.build
};

fs.writeFileSync('.package.json', JSON.stringify(data, undefined, 2));

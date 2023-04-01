import { readFileSync, writeFileSync } from 'node:fs';
import { Tree } from './tree';

const raw = readFileSync('./dictionary.txt', { encoding: 'utf-8' });
const arr = raw.split(',');
const filtered = new Set<string>();
for (const w of arr) filtered.add(w.toLowerCase());

console.log(filtered);
console.log(filtered.size);
const tree = new Tree(filtered);

writeFileSync('./tree.json', JSON.stringify(tree.getAsObject()));

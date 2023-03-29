import { readFileSync } from 'node:fs';
import { Matrix } from './matrix';
import { Tree } from './tree';

// const arr = JSON.parse(readFileSync('./ourCustomExtented4.json', { encoding: 'utf-8' }));

// const filtered = new Set<string>();

// for (const word of arr) {
//     if (!word || word.includes('-') || word.includes('.')) continue;
//     filtered.add(word.trim());
// }
const raw = readFileSync('./dictionary.txt', { encoding: 'utf-8' });
const arr = raw.split(',');
const filtered = new Set<string>();
for (const w of arr) filtered.add(w.toLowerCase());

console.log(filtered);
console.log(filtered.size);
const tree = new Tree(filtered);

// console.log(tree.hasWord('ош'));
// console.log(tree.hasWord('оша'));

export const run = async () => {
    const matrix = new Matrix('оеефммрнтфрипмавысврмслго', 5, [3, 0], [3, 4], [0, 2], [2, 1]);
    // [4,2], [1,1], [4,0], [3,0]
    console.log(matrix.m);
    console.log(matrix.dive(tree));
    // console.log(matrix.result);
    console.log(matrix.result.length);
    const out = matrix.result;

    out.sort((a, b) => {
        if (a.length > b.length) return 1;
        if (a.length < b.length) return -1;
        return 0;
    });

    const unique = new Set(out);

    // for (const word of unique) console.log(word);

    console.log(unique.size);

    matrix.draw();
    console.log(matrix.responce.length);
};

void run();

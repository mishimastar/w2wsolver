import { readFileSync } from 'node:fs';
import { Matrix } from './matrix';
import { Tree } from './tree';

const raw = readFileSync('./dictionary.txt', { encoding: 'utf-8' });
const arr = raw.split(',');
const filtered = new Set<string>();
for (const w of arr) filtered.add(w.toLowerCase());

console.log(filtered);
console.log(filtered.size);
const tree = new Tree(filtered);

export const run = async () => {
    const matrix = new Matrix('лсоиаопмртэртомоснезпруип', 5, [0, 1], [4, 3], [1, 3], [0, 2]);
    console.log(matrix.m);
    console.log(matrix.dive(tree));
    console.log(matrix.result.length);
    const out = matrix.result;

    out.sort((a, b) => {
        if (a.length > b.length) return 1;
        if (a.length < b.length) return -1;
        return 0;
    });

    const unique = new Set(out);

    console.log(unique.size);

    matrix.draw();
    console.log(matrix.responce.length);
};

void run();

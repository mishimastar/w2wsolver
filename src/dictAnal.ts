import { readFileSync } from 'node:fs';

const arr = JSON.parse(readFileSync('./ourCustomExtented2.json', { encoding: 'utf-8' }));

const filtered = new Set<string>();

for (const word of arr) {
    if (!word || word.includes('-') || word.includes('.')) continue;
    filtered.add(word.trim());
}

console.log('unique words:', filtered.size);

const map = new Map<string, number>();

for (const word of filtered)
    for (const symbol of word) {
        if (map.has(symbol)) {
            const buf = map.get(symbol)!;
            map.set(symbol, buf + 1);
        } else map.set(symbol, 1);
    }

console.log(map);

const res = Array.from(map);

res.sort((a, b) => {
    if (a[1] > b[1]) return 1;
    if (a[1] < b[1]) return -1;
    return 0;
});

console.log(res);

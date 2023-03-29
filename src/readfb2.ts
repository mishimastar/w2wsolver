import { readFileSync, writeFileSync } from 'fs';

const text1 = readFileSync('./fb2/1.utf-8', { encoding: 'utf-8' });
const text2 = readFileSync('./fb2/2.utf-8', { encoding: 'utf-8' });
const text3 = readFileSync('./fb2/3.utf-8', { encoding: 'utf-8' });
const text4 = readFileSync('./fb2/4.utf-8', { encoding: 'utf-8' });
const text5 = readFileSync('./fb2/5.utf-8', { encoding: 'utf-8' });
const text6 = readFileSync('./fb2/ozheg.xml', { encoding: 'utf-8' }).toLowerCase();
const text7 = readFileSync('./russian_nouns.txt', { encoding: 'utf-8' }).toLowerCase();

const all1 = text1.match(/<strong>[а-я]+<\/strong>/g)!;
const all2 = text2.match(/<strong>[а-я]+<\/strong>/g)!;
const all3 = text3.match(/<strong>[а-я]+<\/strong>/g)!;
const all4 = text4.match(/<strong>[а-я]+<\/strong>/g)!;
const all5 = text5.match(/<strong>[а-я]+<\/strong>/g)!;

const all6 = text6.match(/<p>[а-я]+,.+<\/p>/g)!
// console.log(all6)

// const all6 = text6.split('\n');
const all7 = text7.split('\n');

const filtered = new Set<string>();

for (const word of all1) filtered.add(word.replace('<strong>', '').replace('</strong>', '').toLowerCase());
for (const word of all2) filtered.add(word.replace('<strong>', '').replace('</strong>', '').toLowerCase());
for (const word of all3) filtered.add(word.replace('<strong>', '').replace('</strong>', '').toLowerCase());
for (const word of all4) filtered.add(word.replace('<strong>', '').replace('</strong>', '').toLowerCase());
for (const word of all5) filtered.add(word.replace('<strong>', '').replace('</strong>', '').toLowerCase());
for (const word of all6) filtered.add(word.slice(3, word.indexOf(',')));
for (const word of all7) filtered.add(word.trim());

// console.log(filtered);

writeFileSync('./ourCustomExtented4.json', JSON.stringify([...filtered]));

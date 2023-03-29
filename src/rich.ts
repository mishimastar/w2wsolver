import { readFileSync } from 'node:fs';
import { Matrix } from './matrix';
import { LetterNode, Tree } from './tree';

const arr = JSON.parse(readFileSync('./ourCustomExtented2.json', { encoding: 'utf-8' }));

const filtered = new Set<string>();

for (const word of arr) {
    if (!word || word.includes('-') || word.includes('.')) continue;
    filtered.add(word.trim());
}

export const alphLetters = [
    new LetterNode('а', false),
    new LetterNode('б', false),
    new LetterNode('в', false),
    new LetterNode('г', false),
    new LetterNode('д', false),
    new LetterNode('е', false),
    new LetterNode('ж', false),
    new LetterNode('з', false),
    new LetterNode('и', false),
    new LetterNode('й', false),
    new LetterNode('к', false),
    new LetterNode('л', false),
    new LetterNode('м', false),
    new LetterNode('н', false),
    new LetterNode('о', false),
    new LetterNode('п', false),
    new LetterNode('р', false),
    new LetterNode('с', false),
    new LetterNode('т', false),
    new LetterNode('у', false),
    new LetterNode('ф', false),
    new LetterNode('х', false),
    new LetterNode('ц', false),
    new LetterNode('ч', false),
    new LetterNode('ш', false),
    new LetterNode('щ', false),
    new LetterNode('ъ', false),
    new LetterNode('ы', false),
    new LetterNode('ь', false),
    new LetterNode('э', false),
    new LetterNode('ю', false),
    new LetterNode('я', false)
];

const alph = [
    'а',
    'б',
    'в',
    'г',
    'д',
    'е',
    'ж',
    'з',
    'и',
    'й',
    'к',
    'л',
    'м',
    'н',
    'о',
    'п',
    'р',
    'с',
    'т',
    'у',
    'ф',
    'х',
    'ц',
    'ч',
    'ш',
    'щ',
    'ъ',
    'ы',
    'ь',
    'э',
    'ю',
    'я'
];

const tree = new Tree(filtered);

let maxRes = 0;
let bestTable = '';
let step = 0;

const totalTables = alph.length ** 16;
const startTime = performance.now();

for (const l1 of alph)
    for (const l2 of alph)
        for (const l3 of alph)
            for (const l4 of alph)
                for (const l5 of alph)
                    for (const l6 of alph)
                        for (const l7 of alph)
                            for (const l8 of alph)
                                for (const l9 of alph)
                                    for (const l10 of alph)
                                        for (const l11 of alph)
                                            for (const l12 of alph)
                                                for (const l13 of alph)
                                                    for (const l14 of alph)
                                                        for (const l15 of alph)
                                                            for (const l16 of alph) {
                                                                // for (const l17 of alph)
                                                                //     for (const l18 of alph)
                                                                //         for (const l19 of alph)
                                                                //             for (const l20 of alph)
                                                                //                 for (const l21 of alph)
                                                                //                     for (const l22 of alph)
                                                                //                         for (const l23 of alph)
                                                                //                             for (const l24 of alph)
                                                                //                                 for (const l25 of alph) {
                                                                // const table = `${l1}${l2}${l3}${l4}${l5}${l6}${l7}${l8}${l9}${l10}${l11}${l12}${l13}${l14}${l15}${l16}${l17}${l18}${l19}${l20}${l21}${l22}${l23}${l24}${l25}`;
                                                                const table = `${l1}${l2}${l3}${l4}${l5}${l6}${l7}${l8}${l9}${l10}${l11}${l12}${l13}${l14}${l15}${l16}`;
                                                                // const table = `${l1}${l2}${l3}${l4}${l5}${l6}${l7}${l8}${l9}`;
                                                                // const table = `${l1}${l2}${l3}${l4}`;
                                                                const matrix = new Matrix(table, 4);
                                                                matrix.divePerf(tree);
                                                                if (matrix.resultLen > maxRes) {
                                                                    maxRes = matrix.resultLen;
                                                                    bestTable = table;
                                                                }
                                                                if (step % 1000000 === 0)
                                                                    console.log(
                                                                        table,
                                                                        matrix.resultLen,
                                                                        'best:',
                                                                        maxRes,
                                                                        'bestStr:',
                                                                        bestTable,
                                                                        'step:',
                                                                        step,
                                                                        'passed:',
                                                                        ((step / totalTables) * 100).toFixed(30),
                                                                        '%',
                                                                        'perf:',
                                                                        ((performance.now() - startTime) / step).toFixed(
                                                                            10
                                                                        ),
                                                                        'ms/step, ',
                                                                        'est:',
                                                                        (
                                                                            ((totalTables - step) *
                                                                                ((performance.now() - startTime) / step)) /
                                                                            3600000
                                                                        ).toFixed(3),
                                                                        'hrs'
                                                                    );
                                                                step++;
                                                            }

console.log(
    'best:',
    maxRes,
    'bestStr:',
    bestTable,
    'step:',
    step,
    'passed:',
    ((step / totalTables) * 100).toFixed(30),
    '%',
    'spent:',
    ((performance.now() - startTime) / 3600000).toFixed(10),
    'hrs'
);

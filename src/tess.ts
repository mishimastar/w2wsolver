import { readFileSync } from 'fs';
import { createWorker, PSM } from 'tesseract.js';
import { spawnSync } from 'child_process';

// const files = ['./parts/1.jpg', './parts/2.jpg', './parts/3.jpg', './parts/4.jpg', './parts/5.jpg'];

export const getTable = async (fileName: string) => {
    spawnSync('python', ['prepare.py', fileName]);

    const worker = await createWorker({
        logger: (m) => console.log(m)
    });

    await worker.loadLanguage('rus');
    await worker.initialize('rus');
    worker.setParameters({
        tessedit_char_whitelist: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ' + 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ'.toLowerCase(),
        tessedit_pageseg_mode: PSM.SINGLE_CHAR
    });
    let out = '';
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const {
                data: { text }
            } = await worker.recognize(readFileSync(`./parts/${i}_${j}.jpg`), {}, {});
            out += text.trim();
        }
    }
    // for (const file of files) {
    // }
    await worker.terminate();
    console.log(out);
    return out.replaceAll(' ', '').replaceAll('\n', '').toLowerCase();
};

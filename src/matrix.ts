import type { LetterNode, Tree } from './tree';

export class Letter {
    free: boolean;
    mul = 1;
    c2 = false;
    c3 = false;

    constructor(public letter: string) {
        this.free = true;
    }

    markAsUsed() {
        this.free = false;
    }

    clearUsed() {
        this.free = true;
    }

    setMul(mult: number) {
        this.mul = mult;
    }

    setC2() {
        this.c2 = true;
    }

    setC3() {
        this.c3 = true;
    }
}

// const Colors = new Map<number, string>([
//     [0, '\x1b[31m%s\x1b[0m'],
//     [1, '\x1b[32m%s\x1b[0m'],
//     [2, '\x1b[33m%s\x1b[0m'],
//     [3, '\x1b[34m%s\x1b[0m'],
//     [4, '\x1b[35m%s\x1b[0m']
// ]);

export class Matrix {
    m: Letter[][] = [];

    resultLen = 0;
    result: string[] = [];
    resCoords: { i: number; j: number }[][] = [];

    responce: { score: number; word: string; schema: string }[] = [];

    // dimension = 4;

    constructor(
        inp: string | Letter[][],
        public dimension: number,
        x2?: [number, number],
        x3?: [number, number],
        c2?: [number, number],
        c3?: [number, number]
    ) {
        // console.log(inp);
        if (Array.isArray(inp)) {
            this.m = inp;
        } else {
            let buf: Letter[] = [];
            for (const symbol of inp) {
                buf.push(new Letter(symbol));
                if (buf.length === this.dimension) {
                    this.m.push(buf);
                    buf = [];
                }
            }
        }

        if (x2) this.m[x2[0]]![x2[1]]!.mul = 2;
        if (x3) this.m[x3[0]]![x3[1]]!.mul = 3;
        if (c2) this.m[c2[0]]![c2[1]]!.setC2();
        if (c3) this.m[c3[0]]![c3[1]]!.setC3();
    }

    clearAll() {
        for (const row of this.m) for (const l of row) l.clearUsed();
    }

    canMove0 = (i: number, j: number) => (this.m[i] && this.m[i]![j + 1] && this.m[i]![j + 1]!.free ? true : false);
    canMove45 = (i: number, j: number) =>
        this.m[i - 1] && this.m[i - 1]![j + 1] && this.m[i - 1]![j + 1]!.free ? true : false;
    canMove90 = (i: number, j: number) => (this.m[i - 1] && this.m[i - 1]![j] && this.m[i - 1]![j]!.free ? true : false);
    canMove135 = (i: number, j: number) =>
        this.m[i - 1] && this.m[i - 1]![j - 1] && this.m[i - 1]![j - 1]!.free ? true : false;
    canMove180 = (i: number, j: number) => (this.m[i] && this.m[i]![j - 1] && this.m[i]![j - 1]!.free ? true : false);
    canMove225 = (i: number, j: number) =>
        this.m[i + 1] && this.m[i + 1]![j - 1] && this.m[i + 1]![j - 1]!.free ? true : false;
    canMove270 = (i: number, j: number) => (this.m[i + 1] && this.m[i + 1]![j] && this.m[i + 1]![j]!.free ? true : false);
    canMove315 = (i: number, j: number) =>
        this.m[i + 1] && this.m[i + 1]![j + 1] && this.m[i + 1]![j + 1]!.free ? true : false;

    move(i: number, j: number, previous: string, pointer: LetterNode | undefined): void {
        // console.log(i, j, previous, this.m[i]![j]!.letter, pointer);
        if (!pointer) return;
        this.m[i]![j]!.markAsUsed();
        if (pointer.isLast()) this.result.push(`${previous}${i}${j}`);
        if (this.canMove0(i, j)) this.move(i, j + 1, `${previous}${i}${j}`, pointer.getDaughter(this.m[i]![j + 1]!.letter));
        if (this.canMove45(i, j))
            this.move(i - 1, j + 1, `${previous}${i}${j}`, pointer.getDaughter(this.m[i - 1]![j + 1]!.letter));
        if (this.canMove90(i, j))
            this.move(i - 1, j, `${previous}${i}${j}`, pointer.getDaughter(this.m[i - 1]![j]!.letter));
        if (this.canMove135(i, j))
            this.move(i - 1, j - 1, `${previous}${i}${j}`, pointer.getDaughter(this.m[i - 1]![j - 1]!.letter));
        if (this.canMove180(i, j))
            this.move(i, j - 1, `${previous}${i}${j}`, pointer.getDaughter(this.m[i]![j - 1]!.letter));
        if (this.canMove225(i, j))
            this.move(i + 1, j - 1, `${previous}${i}${j}`, pointer.getDaughter(this.m[i + 1]![j - 1]!.letter));
        if (this.canMove270(i, j))
            this.move(i + 1, j, `${previous}${i}${j}`, pointer.getDaughter(this.m[i + 1]![j]!.letter));
        if (this.canMove315(i, j))
            this.move(i + 1, j + 1, `${previous}${i}${j}`, pointer.getDaughter(this.m[i + 1]![j + 1]!.letter));

        this.m[i]![j]!.clearUsed();

        return;
    }

    moveNoRes(i: number, j: number, pointer: LetterNode | undefined): void {
        if (!pointer) return;
        this.m[i]![j]!.markAsUsed();
        if (pointer.isLast()) this.resultLen += 1;
        if (this.canMove0(i, j)) this.moveNoRes(i, j + 1, pointer.getDaughter(this.m[i]![j + 1]!.letter));
        if (this.canMove45(i, j)) this.moveNoRes(i - 1, j + 1, pointer.getDaughter(this.m[i - 1]![j + 1]!.letter));
        if (this.canMove90(i, j)) this.moveNoRes(i - 1, j, pointer.getDaughter(this.m[i - 1]![j]!.letter));
        if (this.canMove135(i, j)) this.moveNoRes(i - 1, j - 1, pointer.getDaughter(this.m[i - 1]![j - 1]!.letter));
        if (this.canMove180(i, j)) this.moveNoRes(i, j - 1, pointer.getDaughter(this.m[i]![j - 1]!.letter));
        if (this.canMove225(i, j)) this.moveNoRes(i + 1, j - 1, pointer.getDaughter(this.m[i + 1]![j - 1]!.letter));
        if (this.canMove270(i, j)) this.moveNoRes(i + 1, j, pointer.getDaughter(this.m[i + 1]![j]!.letter));
        if (this.canMove315(i, j)) this.moveNoRes(i + 1, j + 1, pointer.getDaughter(this.m[i + 1]![j + 1]!.letter));

        this.m[i]![j]!.clearUsed();

        return;
    }

    dive(tree: Tree) {
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                const first = this.m[i]![j]!;

                // console.log('first letter is', first);
                const branch = tree.getDaughter(first.letter);
                this.move(i, j, '', branch);
                this.clearAll();
            }
        }
    }

    divePerf(tree: Tree) {
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                const first = this.m[i]![j]!;

                // console.log('first letter is', first);
                const branch = tree.getDaughter(first.letter);
                this.moveNoRes(i, j, branch);
                this.clearAll();
            }
        }
        return this.resultLen;
    }

    prepareRes() {
        for (const word of this.result) {
            const w: { i: number; j: number }[] = [];
            for (let i = 0; i < word.length; i += 2) {
                w.push({ i: Number(word[i]), j: Number(word[i + 1]) });
            }
            this.resCoords.push(w);
        }
    }

    #buildWordString(word: { i: number; j: number }[]) {
        let out = '';
        for (const { i, j } of word) out += this.m[i]![j]!.letter;
        return out;
    }

    #calcWordScore(word: { i: number; j: number }[]) {
        let score = 0;
        let c2 = false;
        let c3 = false;
        for (let i = 0; i < word.length; i++) {
            const coords = word[i]!;
            const s = this.m[coords.i]![coords.j]!;
            if (s.c2) c2 = true;
            if (s.c3) c3 = true;
            score += (i + 1) * s.mul;
        }
        if (c2) score *= 2;
        if (c3) score *= 3;
        return score;
    }

    drawSingleResult(word: { i: number; j: number }[], score: number) {
        const firstSymbol = word[0]!;
        const map = new Map<number, Set<number>>();
        let out = '';
        for (const { i, j } of word) {
            if (map.has(i)) map.get(i)!.add(j);
            else map.set(i, new Set([j]));
        }
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                out += ' ';
                if (firstSymbol.i === i && firstSymbol.j === j) {
                    out += '\x1b[41m' + this.m[i]![j]!.letter.toUpperCase() + '\x1b[0m';
                } else if (map.has(i) && map.get(i)!.has(j)) {
                    out += '\x1b[32m' + this.m[i]![j]!.letter.toUpperCase() + '\x1b[0m';
                } else {
                    out += '\x1b[2m' + this.m[i]![j]!.letter + '\x1b[0m';
                }
            }
            if (i === 2) out += `     ${this.#buildWordString(word).toUpperCase()}    ${score}\n`;
            else out += '\n';
        }

        return out;
    }

    calculateResponce() {
        this.prepareRes();
        const map = new Map<string, { score: number; schema: string }>();
        for (const word of this.resCoords) {
            const res = this.#buildWordString(word);
            const score = this.#calcWordScore(word);
            if (map.has(res) && map.get(res)!.score >= score) continue;
            const schema = this.drawSingleResult(word, score);
            map.set(res, { score, schema });
        }

        for (const [word, { schema, score }] of map) this.responce.push({ word, schema, score });
        this.responce.sort((a, b) => {
            if (a.score > b.score) return 1;
            if (a.score < b.score) return -1;
            return 0;
        });
    }

    draw() {
        console.log('start draw');
        this.calculateResponce();
        for (const resp of this.responce) console.log(resp.schema);
        console.log('end draw');
    }
}

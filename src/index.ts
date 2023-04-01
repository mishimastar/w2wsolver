// import { rawDictionary } from './dict.js';

// function readTextFile(file: string) {
//     fetch(file)
//         .then((response) => response.text())
//         .then((text) => console.log(text));
// }

// readTextFile('file:///home/mishimastar/Documents/w2wsolver/dictionary.txt');

export class LetterNode {
    letter: string;
    #end: boolean;

    #daughters = new Map<string, LetterNode>();

    constructor(letter: string, last: boolean) {
        this.letter = letter;
        this.#end = last;
    }
    info() {
        console.log(this.letter, this.#end);
    }

    #markAsLast() {
        this.#end = true;
    }

    addDaughter(letter: string, last: boolean): LetterNode {
        if (this.#daughters.has(letter)) {
            if (last) this.#daughters.get(letter)!.#markAsLast();
        } else {
            this.#daughters.set(letter, new LetterNode(letter, last));
        }
        return this.#daughters.get(letter)!;
    }

    isLast() {
        return this.#end;
    }

    getDaughter(letter: string): LetterNode | undefined {
        return this.#daughters.get(letter);
    }

    getAsObject() {
        const d: { l: string; end: boolean; d: any[] }[] = [];
        for (const dau of this.#daughters.values()) d.push(dau.getAsObject());
        return { l: this.letter, end: this.#end, d };
    }
}

export class Tree {
    #Tree = new Map<string, LetterNode>();

    constructor(dictionary: Set<string>) {
        const firstSymbols = new Set<string>();
        for (const word of dictionary) firstSymbols.add(word[0]!);

        for (const s of firstSymbols) this.#Tree.set(s, new LetterNode(s, false));

        for (const word of dictionary) {
            // if (!word.startsWith('а')) continue;
            const lastIndex = word.length - 1;
            let pointer = this.#Tree.get(word[0]!)!;
            for (let i = 1; i < word.length; i++) {
                pointer = pointer.addDaughter(word[i]!, i === lastIndex);
            }
        }
    }

    hasWord(word: string): boolean {
        if (word.length === 0) return false;
        let pointer = this.#Tree.get(word[0]!);
        if (!pointer) return false;
        const lastIndex = word.length - 1;
        for (let i = 1; i < word.length; i++) {
            pointer = pointer.getDaughter(word[i]!);
            if (!pointer) return false;
            if (i === lastIndex) return pointer!.isLast();
        }
        return false;
    }

    getDaughter(letter: string): LetterNode | undefined {
        return this.#Tree.get(letter);
    }

    getAsObject() {
        const daughters: { l: string; end: boolean; d: any[] }[] = [];
        // for (const d of this.#Tree.values()) {
        // }
        const d = this.#Tree.get('а')!;
        daughters.push(d.getAsObject());
        return daughters;
    }
}

const drawRect = (x0: number, y0: number, w: number, h: number, color: string, c: CanvasRenderingContext2D) => {
    c.beginPath();
    c.rect(x0, y0, w, h);
    c.fillStyle = color;
    c.fill();
};

const drawLetter = (letter: string, lx: number, ly: number, c: CanvasRenderingContext2D) => {
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = 'black';
    c.fillText(letter, lx, ly);
};

class Node {
    preview = document.getElementById('word')!;

    width: number;
    height: number;

    selected = false;

    constructor(
        public x0: number,
        public y0: number,
        public x1: number,
        public y1: number,
        public letter: string,
        public lx: number,
        public ly: number,
        public canvas: CanvasRenderingContext2D
    ) {
        this.width = x1 - x0;
        this.height = y1 - y0;
    }

    draw() {
        drawRect(this.x0, this.y0, this.width, this.height, 'blue', this.canvas);
        drawLetter(this.letter, this.lx, this.ly, this.canvas);
    }

    select() {
        this.selected = true;
        drawRect(this.x0, this.y0, this.width, this.height, 'red', this.canvas);
        drawLetter(this.letter, this.lx, this.ly, this.canvas);
        this.preview.textContent += this.letter;
    }

    unselect() {
        this.selected = false;
        drawRect(this.x0, this.y0, this.width, this.height, 'blue', this.canvas);
        drawLetter(this.letter, this.lx, this.ly, this.canvas);
        this.preview.textContent = this.preview.textContent?.slice(0, this.preview.textContent.length - 1) ?? '';
    }
}

class Touches {
    ongoingTouches: { identifier: number; pageX: number; pageY: number }[] = [];
    width!: number;
    height!: number;
    stepH!: number;
    stepW!: number;
    steps!: number;
    padH!: number;
    padW!: number;

    score = 0;

    rectangles: Node[][] = [];
    selectedRectangles: { c: Node; i: number; j: number }[] = [];

    solved = new Set<string>();
    #tableStr!: string;
    padding = 0;

    constructor(public canvas2D: CanvasRenderingContext2D, public dict: Tree) {}

    setWH(w: number, h: number) {
        this.width = w;
        this.height = h;
    }

    copyTouch = (touch: Touch) => ({ identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY });
    compareCells = (c1: Node, c2: Node) => c1.x0 === c2.x0 && c1.x1 === c2.x1 && c1.y0 === c2.y0 && c1.y1 === c2.y1;

    // colorForTouch = (touch: Touch) => {
    //     let r = touch.identifier % 16;
    //     let g = Math.floor(touch.identifier / 3) % 16;
    //     let b = Math.floor(touch.identifier / 7) % 16;
    //     // make it a hex digit
    //     console.log('rgb', r, g, b);
    //     return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    // };

    ongoingTouchIndexById = (idToFind: number) => {
        for (let i = 0; i < this.ongoingTouches.length; i++) {
            const id = this.ongoingTouches[i]!.identifier;

            if (id === idToFind) return i;
        }
        return -1;
    };

    handleStart = (evt: TouchEvent) => {
        evt.preventDefault();
        // this.log('touchstart.');
        const touches = evt.changedTouches;
        // console.log('start touches len', touches.length);

        for (let i = 0; i < touches.length; i++) {
            // this.log(`touchstart: ${i}.`);
            this.ongoingTouches.push(this.copyTouch(touches[i]!));
            // const color = this.colorForTouch(touches[i]!);
            // this.log(`color of touch with id ${touches[i]!.identifier} = ${color}`);
            // this.canvas2D.beginPath();
            // this.canvas2D.arc(touches[i]!.pageX, touches[i]!.pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
            // this.canvas2D.fillStyle = color;
            // this.canvas2D.fill();
            this.selectRect(touches[i]!);
        }
    };
    handleMove = (evt: TouchEvent) => {
        evt.preventDefault();
        const touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            // const color = this.colorForTouch(touches[i]!);
            const idx = this.ongoingTouchIndexById(touches[i]!.identifier);

            if (idx >= 0) {
                // this.log(`continuing touch ${idx}`);
                // this.canvas2D.beginPath();
                // this.log(`this.canvas2D.moveTo( ${this.ongoingTouches[idx]!.pageX}, ${this.ongoingTouches[idx]!.pageY} );`);
                // this.canvas2D.moveTo(this.ongoingTouches[idx]!.pageX, this.ongoingTouches[idx]!.pageY);
                // this.log(`this.canvas2D.lineTo( ${touches[i]!.pageX}, ${touches[i]!.pageY} );`);
                // this.canvas2D.lineTo(touches[i]!.pageX, touches[i]!.pageY);
                // this.canvas2D.lineWidth = 4;
                // this.canvas2D.strokeStyle = color;
                // this.canvas2D.stroke();
                this.selectRect(touches[i]!);

                this.ongoingTouches.splice(idx, 1, this.copyTouch(touches[i]!)); // swap in the new touch record
            } else {
                // this.log("can't figure out which touch to continue");
            }
        }
    };
    handleEnd = (evt: TouchEvent) => {
        evt.preventDefault();
        // this.log('touchend');
        const touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            // const color = this.colorForTouch(touches[i]!);
            let idx = this.ongoingTouchIndexById(touches[i]!.identifier);

            if (idx >= 0) {
                // this.canvas2D.lineWidth = 4;
                // this.canvas2D.fillStyle = color;
                // this.canvas2D.beginPath();
                // this.canvas2D.moveTo(this.ongoingTouches[idx]!.pageX, this.ongoingTouches[idx]!.pageY);
                // this.canvas2D.lineTo(touches[i]!.pageX, touches[i]!.pageY);
                // this.canvas2D.fillRect(touches[i]!.pageX - 4, touches[i]!.pageY - 4, 8, 8); // and a square at the end
                this.ongoingTouches.splice(idx, 1); // remove it; we're done
                this.countScore();
                this.resetRects();
            } else {
                // this.log("can't figure out which touch to end");
            }
        }
    };
    handleCancel = (evt: TouchEvent) => {
        evt.preventDefault();
        // this.log('touchcancel.');
        const touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            let idx = this.ongoingTouchIndexById(touches[i]!.identifier);
            this.ongoingTouches.splice(idx, 1); // remove it; we're done
            this.countScore();
            this.resetRects();
        }
    };

    countScore() {
        let word = '';
        for (const cell of this.selectedRectangles) word += cell.c.letter;
        console.log('tree', word, this.dict.hasWord(word.toLowerCase()));
        if (this.dict.hasWord(word.toLowerCase()) && !this.solved.has(word)) {
            for (let i = 1; i <= this.selectedRectangles.length; i++) this.score += i;
            this.solved.add(word);
            const header = document.getElementById('score');
            if (!header) throw new Error('not found header with scoring!');
            header.textContent = `Score: ${this.score}`;
        }
    }

    drawLine(x0: number, y0: number, x1: number, y1: number) {
        this.canvas2D.beginPath();
        this.canvas2D.moveTo(x0, y0);
        this.canvas2D.lineTo(x1, y1);
        this.canvas2D.lineWidth = 4;
        this.canvas2D.stroke();
    }

    touchMeetsCell = (t: Touch, r: Node) => t.pageX > r.x0 && t.pageX < r.x1 && t.pageY > r.y0 && t.pageY < r.y1;

    isNeighbour2Last(i: number, j: number) {
        const last = this.selectedRectangles[this.selectedRectangles.length - 1];
        // console.log(last, i, j);
        if (!last) return true;
        if (last.i + 1 === i && last.j === j) return true;
        if (last.i - 1 === i && last.j === j) return true;
        if (last.i === i && last.j + 1 === j) return true;
        if (last.i === i && last.j - 1 === j) return true;
        if (last.i - 1 === i && last.j - 1 === j) return true;
        if (last.i + 1 === i && last.j - 1 === j) return true;
        if (last.i + 1 === i && last.j + 1 === j) return true;
        if (last.i - 1 === i && last.j + 1 === j) return true;
        return false;
    }

    selectRect(t: Touch) {
        let j = 0;
        for (const row of this.rectangles) {
            let i = 0;
            for (const r of row) {
                if (this.touchMeetsCell(t, r)) {
                    if (!this.isNeighbour2Last(i, j)) return;
                    if (this.isPrevious(r)) this.selectedRectangles.pop()!.c.unselect();
                    if (r.selected) return;

                    r.select();

                    this.selectedRectangles.push({ c: r, i, j });
                }
                i++;
            }
            j++;
        }
    }

    isPrevious(c: Node) {
        if (this.selectedRectangles.length < 2) return false;
        if (this.compareCells(this.selectedRectangles[this.selectedRectangles.length - 2]!.c, c)) return true;
        return false;
    }

    resetRects() {
        console.log('selected', this.selectedRectangles);
        for (const n of this.selectedRectangles) n.c.unselect();
        this.selectedRectangles = [];
    }

    #table() {
        this.rectangles = [];
        let y1 = this.stepH;
        let y0 = 0;
        let letCnt = 0;
        for (let i = 0; i < this.steps; i++) {
            const buf: Node[] = [];
            let x0 = 0;
            let x1 = this.stepW;
            for (let j = 0; j < this.steps; j++) {
                buf.push(
                    new Node(
                        x0 + this.padW,
                        y0 + this.padH,
                        x1 - this.padW,
                        y1 - this.padH,
                        this.#tableStr[letCnt]!.toUpperCase(),
                        Math.trunc((x1 - x0) / 2) + x0,
                        Math.trunc((y1 - y0) / 2) + y0,
                        this.canvas2D
                    )
                );
                x0 += this.stepW;
                x1 += this.stepW;
                letCnt++;
            }
            this.rectangles.push(buf);
            y1 += this.stepH;
            y0 += this.stepH;
        }
        console.log('all', this.rectangles);
        for (const row of this.rectangles) for (const c of row) c.draw();

        // for (let i = 1; i < this.steps; i++) {
        //     this.drawLine(i * this.stepW, 0, i * this.stepW, this.height);
        //     this.drawLine(0, i * this.stepH, this.width, i * this.stepH);
        // }
    }

    setPadding(padding: number) {
        this.padding = padding;
    }

    drawTable(table: string, steps: number) {
        this.canvas2D.clearRect(0, 0, this.width, this.height);
        const stepW = Math.trunc(this.width / steps);
        const stepH = Math.trunc(this.height / steps);
        this.steps = steps;
        this.stepH = stepH;
        this.stepW = stepW;
        this.padH = stepH * (this.padding / 200);
        this.padW = stepW * (this.padding / 200);
        this.#tableStr = table;
        this.#table();
    }
}

class Game {
    #canvasHTML: HTMLCanvasElement;
    #canvas: CanvasRenderingContext2D;
    #touch: Touches;
    #dict: Tree;

    constructor(canvas: HTMLCanvasElement, dict: Tree) {
        this.#canvasHTML = canvas;
        this.#canvas = this.#canvasHTML.getContext('2d')!;
        this.#dict = dict;
        this.#touch = new Touches(this.#canvas, this.#dict);
        this.#canvasHTML.addEventListener('touchstart', this.#touch.handleStart);
        this.#canvasHTML.addEventListener('touchend', this.#touch.handleEnd);
        this.#canvasHTML.addEventListener('touchcancel', this.#touch.handleCancel);
        this.#canvasHTML.addEventListener('touchmove', this.#touch.handleMove);
    }

    configure(sqrFieldSize: number, font: string, padding = 20) {
        this.#canvasHTML.height = sqrFieldSize;
        this.#canvasHTML.width = sqrFieldSize;
        this.#canvasHTML.style.background = '#ff8';
        this.#canvas.font = font;
        this.#touch.setWH(sqrFieldSize, sqrFieldSize);
        this.#touch.setPadding(padding);
    }

    start(table: string, size: number) {
        this.#touch.drawTable(table, size);
    }
}

const LoadTable = async () => {
    const resp = await fetch('/gettable');
    const out = await resp.json();
    return out as { table: string; dict: string[] };
};

async function startup() {
    const el = document.getElementById('canvas') as HTMLCanvasElement;
    if (!el) throw new Error('no canvas found!');
    const init = await LoadTable();

    const tree = new Tree(new Set(init.dict));

    const game = new Game(el, tree);

    let sqr = Math.min(window.innerHeight, window.innerWidth);
    if (sqr > 1000) sqr = 1000;
    game.configure(sqr, '48px Arial');

    game.start(init.table, 5);
}

document.addEventListener('DOMContentLoaded', startup);

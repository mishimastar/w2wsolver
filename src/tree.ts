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

    // letter() {
    //     return this.letter;
    // }

    // drawCurrent() {
    //     console.log(this.#daughters);
    //     // for (const [, d] of this.#daughters) d.drawTree();
    // }

    // drawTree() {
    //     console.log(this.#daughters);
    //     for (const [, d] of this.#daughters) d.drawCurrent();
    // }

    // draw(prev?: string) {
    //     if (this.#end) console.log(prev!);
    //     for (const [letter, daughter] of this.#daughters) daughter.draw(`${prev}${letter}`);
    // }

    getDaughter(letter: string): LetterNode | undefined {
        return this.#daughters.get(letter);
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

    // draw() {
    //     for (const [, startNode] of this.#Tree) startNode.draw('');
    // }

    // drawTree() {
    //     console.log(this.#Tree.get('б')?.drawCurrent());
    //     // for (const [, d] of this.#Tree) d.drawTree();
    // }

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
}

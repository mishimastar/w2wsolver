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

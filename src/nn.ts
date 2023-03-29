import { writeFileSync } from 'fs';

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

export class Let {
    weight: number;

    constructor(public letter: string) {
        this.weight = 50;
        // this.weight = Math.random() * 100;
    }

    increase(mult: number) {
        this.weight += Math.random() * mult;
    }

    reduce(mult: number) {
        this.weight -= Math.random() * mult;
    }
}

export class Generator {
    weights: Let[][];
    lastOut: number[];
    lastChanged: number;
    epoch: number;

    badResCounter: number;
    goodResCounter: number;

    constructor(strLen: number, public totalEpoch: number, public rewardSpeed: number) {
        this.weights = [];
        this.lastOut = [];
        this.lastChanged = 0;
        this.epoch = 0;
        this.badResCounter = 0;
        this.goodResCounter = 0;
        for (let i = 0; i < strLen; i++) {
            this.lastOut.push(0);
            const buf: Let[] = [];
            for (const letter of alph) buf.push(new Let(letter));

            buf.sort((a, b) => {
                if (a.weight > b.weight) return -1;
                if (a.weight < b.weight) return 1;
                return 0;
            });
            this.weights.push(buf);
        }
        // console.log(this.weights);
    }

    buildString() {
        let out = '';
        const dia = (alph.length * (this.totalEpoch - this.epoch)) / this.totalEpoch;
        const index = Math.trunc(Math.random() * dia);
        // console.log('='.repeat(20), this.lastOut.join(','));

        for (let i = 0; i < this.weights.length; i++) {
            if (i === this.lastChanged) {
                out += this.weights[i]![index]!.letter;
                this.lastOut[i] = index;
                // console.log('lastChanged', this.lastOut.join(','), this.lastChanged, index);
            } else out += this.weights[i]![this.lastOut[i]!]!.letter;
        }
        this.lastChanged = this.lastChanged + 1 < this.weights.length ? this.lastChanged + 1 : 0;
        return out;
    }

    result(good: boolean) {
        if (good) {
            // console.log('Меня наградили!');
            this.goodResCounter++;
            // for (let i = 0; i < this.weights.length; i++) {
            //     const index = this.lastOut[i]!;
            //     this.weights[i]![index]!.increase(this.rewardSpeed);
            // }

            const index = this.lastOut[this.lastChanged]!;
            this.weights[this.lastChanged]![index]!.increase(this.rewardSpeed);
        } else {
            // console.log('Мне дали по шее((');
            this.badResCounter++;
            // for (let i = 0; i < this.weights.length; i++) {
            //     const index = this.lastOut[i]!;
            //     this.weights[i]![index]!.reduce(this.rewardSpeed);
            // }
            const index = this.lastOut[this.lastChanged]!;
            this.weights[this.lastChanged]![index]!.increase(this.rewardSpeed);
        }
        for (const l of this.weights)
            l.sort((a, b) => {
                if (a.weight > b.weight) return -1;
                if (a.weight < b.weight) return 1;
                return 0;
            });
        this.epoch++;
        // console.log(this.weights);
    }

    stats() {
        console.log('bad:', this.badResCounter, 'good:', this.goodResCounter);
    }

    saveModel() {
        let out = '[';
        for (const node of this.weights) {
            let buf = '{';
            for (const l of node) buf += `"${l.letter}":${l.weight},`;
            buf += '},';
            out += buf;
        }
        out += ']';
        writeFileSync(`./weights_${this.weights.length}.json`, out);
    }
}

// const gen = new Generator(2);

// console.log(gen.buildString());
// console.log(gen.lastOut);
// console.log(gen.result(true));

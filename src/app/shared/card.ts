export class Card {
    constructor(public value, public faceUp: boolean = false) { }
    compare = (card: Card): number => {
        if (this.value === card.value) { return 0; }
        if (this.value < card.value) { return -1; }
        if (this.value > card.value) { return 1; }
    }
    flip = () => { this.faceUp = !this.faceUp; };
}

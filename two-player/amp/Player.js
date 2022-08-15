class Player {
    constructor(x, y, backgroundColor, midHeight, sensitivity) {
        this.x = x;
        this.y = y;
        this.numReached = 0;
        this.curState = new Object();
        this.prevState = new Object();
        this.yAbove;
        this.yBelow;
        this.backgroundColor = backgroundColor;
        this.midHeight = midHeight;
        this.sensitivity = sensitivity;
    }
}
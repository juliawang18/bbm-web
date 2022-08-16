class Player {
    constructor(x, y, yAbove, yBelow, midHeight, sensitivity) {
        this.x = x;
        this.y = y;
        this.score = 0;
        this.curState = new Object();
        this.prevState = new Object();
        this.allowGreen = true;
        this.yAbove = yAbove;
        this.yBelow = yBelow;
        this.midHeight = midHeight;
        this.sensitivity = sensitivity;
    }
}
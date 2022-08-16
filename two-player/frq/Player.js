class Player {
    constructor(id, x, y, midHeight, sensitivity) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.curState = new Object();
        this.prevState = new Object();
        this.periodStart = 0;
        this.numTimesPassedAxis = -1;
        this.score = 0;
        this.midHeight = midHeight;
        this.sensitivity = sensitivity;
    }
}
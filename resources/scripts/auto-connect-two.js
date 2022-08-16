'use strict';

let reader1;
let inputDone1;
let inputStream1;
let angle1;

let reader2;
let inputDone2;
let inputStream2;
let angle2;

let port1;
let port2;

document.addEventListener('DOMContentLoaded', () => {
    // Initiate auto-connection
    clickConnect();

});

/**
 * @name connect
 * Opens a Web Serial connection and sets up the input stream.
 */
async function serialConnect() {
    // Get all serial ports the user has previously granted the website access to.
    const ports = await navigator.serial.getPorts();

    // Checking for serial connections.
    if (ports.length < 2) {
        console.log("Not enough serial devices connected!")
        return;
    }

    // Assuming the first one is the one you want to open...
    port1 = ports[0];
    port2 = ports[1];

    // Open serial port without user gesture.
    await port1.open({ baudRate: 9600 });
    // await port2.open({ baudRate: 9600 });

    // CODELAB: Add code to read the stream here.
    let decoder1 = new TextDecoderStream();
    inputDone1 = port1.readable.pipeTo(decoder1.writable);
    inputStream1 = decoder1.readable
        .pipeThrough(new TransformStream(new LineBreakTransformer()));

    reader1 = inputStream1.getReader();
    readLoopP1(reader1, angle1);

    let decoder2 = new TextDecoderStream();
    inputDone2 = port2.readable.pipeTo(decoder2.writable);
    inputStream2 = decoder2.readable
        .pipeThrough(new TransformStream(new LineBreakTransformer()));

    reader2 = inputStream2.getReader();
    readLoopP2(reader2, angle2);

}


/**
 * @name clickConnect
 * Click handler for the connect/disconnect button.
 */
async function clickConnect() {
    // CODELAB: Add disconnect code here.

    // CODELAB: Add connect code here.
    await serialConnect();

    // toggleUIConnected(true);
}


/**
 * @name readLoop
 * Reads data from the input stream and displays it on screen.
 */
async function readLoopP1(reader) {
    // CODELAB: Add read loop here.
    while (true) {
        const { value, done } = await reader.read();
        if (value) {
            angle1 = parseFloat(value);
        }
        if (done) {
            console.log('[readLoop] DONE', done);
            reader.releaseLock();
            break;
        }
    }
}

/**
 * @name readLoop
 * Reads data from the input stream and displays it on screen.
 */
 async function readLoopP2(reader) {
    // CODELAB: Add read loop here.
    while (true) {
        const { value, done } = await reader.read();
        if (value) {
            angle2 = parseFloat(value);
        }
        if (done) {
            console.log('[readLoop] DONE', done);
            reader.releaseLock();
            break;
        }
    }
}

/**
 * @name LineBreakTransformer
 * TransformStream to parse the stream into lines.
 */
 class LineBreakTransformer {
    constructor() {
      // A container for holding stream data until a new line.
      this.container = '';
    }
  
    transform(chunk, controller) {
      this.container += chunk;
      const lines = this.container.split('\n');
      this.container = lines.pop();
      lines.forEach(line => {
        controller.enqueue(line)
      });
    }
  
    flush(controller) {
      controller.enqueue(this.container);
    }
  }

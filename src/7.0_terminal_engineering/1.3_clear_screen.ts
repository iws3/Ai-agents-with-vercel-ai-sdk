// // making a pull request:

// // 2.5 Clearing the Screen
// // There are multiple ways to clear content from the terminal, and choosing the right one matters. Clearing
// // the entire screen on every frame is the simplest approach but causes visible flicker. In Chapter 6 we will
// // learn smarter techniques, but for now here are all the clearing commands


// const ESC="\x1b";
// console.log("happy here 😂")

// export const clear={
//     // Erase the entire screen, Does Not move the cursor
//     screen: () =>`${ESC}[2J`,
//     toEnd:()=>`${ESC}[0J`,
//     toStart:()=>`${ESC}[1J`,
//     // Erase the entire current line
//     line:()=>`${ESC}[2K`,
//     // ERASE FROM THE CURSOR TO THE END OF THE LINE     
//     lineToEnd:()=>`${ESC}[0K`,
//     // erase from the start of the line to cursor
//     lineToStart:()=>`${ESC}[1K`,
//     // switch tot he "alternate screen buffer"  a clean blanc canvas.
//     // This is what vim, htop, etc do when they open
//     // your previous terminal content is preserved and restored on exit.
//     enterAltScreen:()=>`${ESC}[?1049h`,
//     exitAltScreen:()=>`${ESC}[?10491`,


// }

// // / CRITICAL: Always exit the alternate screen on program close.
// // // If you forget, the user's terminal will be left on a blank screen.


// process.on("exit", ()=>{
//     process.stdout.write(clear.exitAltScreen());
//     process.stdout.write("\x1b[?25h"); // Also restore cursor
// })


const ESC = "\x1b";

export const clear = {
    screen: () => `${ESC}[2J`,
    toEnd: () => `${ESC}[0J`,
    toStart: () => `${ESC}[1J`,
    line: () => `${ESC}[2K`,
    lineToEnd: () => `${ESC}[0K`,
    lineToStart: () => `${ESC}[1K`,
    enterAltScreen: () => `${ESC}[?1049h`,
    exitAltScreen: () => `${ESC}[?1049l`,
};

const moveCursor = (row: number, col: number): string => `${ESC}[${row};${col}H`;
const hideCursor = (): string => `${ESC}[?25l`;
const showCursor = (): string => `${ESC}[?25h`;

function start(): void {
    // 1. Enter Alternate Screen
    process.stdout.write(clear.enterAltScreen());
    process.stdout.write(hideCursor());
    process.stdout.write(clear.screen());
    process.stdout.write(moveCursor(1, 1));

    // 2. Draw UI
    process.stdout.write("========================================\n");
    process.stdout.write("   FULL SCREEN TERMINAL (TS VERSION)    \n");
    process.stdout.write("========================================\n");
    process.stdout.write("\n The app is now running in full screen.\n");
    process.stdout.write(" Press Ctrl+C to exit and return to normal.\n");

    // 3. Keep the process alive with a regular interval
    // We REMOVED .unref() so Node stays active
    setInterval(() => {
        process.stdout.write(moveCursor(6, 1));
        process.stdout.write(` Updated at: ${new Date().toLocaleTimeString()} `);
    }, 1000);

    // 4. Also listen for keystrokes (optional, but keeps process alive)
    if (process.stdin.setRawMode) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (data) => {
            // Exit on Ctrl+C (binary 3)
            if (data[0] === 3) process.exit();
        });
    }
}

function cleanup(): void {
    process.stdout.write(showCursor());
    process.stdout.write(clear.exitAltScreen());
}

// Cleanup on exit
process.on("exit", cleanup);
process.on("SIGINT", () => process.exit());
process.on("SIGTERM", () => process.exit());

start();
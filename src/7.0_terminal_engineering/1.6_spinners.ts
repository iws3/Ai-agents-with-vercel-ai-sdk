

// const ESC="\x1b";

// A spinner is the indeterminate counterpart to a progress bar — it shows activity without knowing how
// much work remains. Spinners are implemented using setInterval() to cycle through a sequence of
// characters, each time overwriting the previous frame on the same line.


// Several popular spinner characters sets..

// each array element is one an animation frame

const spinnerStyles = {
  dots: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  arrows: ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"],
  bounce: ["⠁", "⠂", "⠄", "⡀", "⢀", "⠠", "⠐", "⠈"],
  classic: ["-", "\\", "|", "/"],
  blocks: ["▖", "▘", "▝", "▗"],
  moon: ["�", "�", "�", "�", "�", "�", "�", "�"],
};

class Spinner {
  private frameIndex = 0;
  private timer: NodeJS.Timeout | null = null;
  private frames: string[];
  private text: string;
  private color: string;

  constructor(
    options: {
      text?: string;
      style?: keyof typeof spinnerStyles;
      color?: string;
      interval?: number; // Milliseconds between frames
    } = {},
  ) {
    this.frames = spinnerStyles[options.style ?? "dots"];
    this.text = options.text ?? "Loading...";
    this.color = options.color ?? `${ESC}[36m`;
    const interval = options.interval ?? 80;

    // Hide the cursor and reserve a line.

    process.stdout.write(`${ESC}[?251\n`);

    this.timer = setInterval(() => this.render(), interval);
  }

  private render(): void {
    const frame = this.frames[this.frameIndex % this.frames.length];
    this.frameIndex++;
    process.stdout.write(`\r${this.color}${frame}${RESET} ${this.text} `);
  }

  // Stop the spinner and print a final status message.
  succeed(message: string): void {
    this.stop("✓", `${ESC}[32m`, message);
  }
  fail(message: string): void {
    this.stop("✗", `${ESC}[31m`, message);
  }
  warn(message: string): void {
    this.stop("�", `${ESC}[33m`, message);
  }
  private stop(symbol: string, color: string, message: string): void {
    if (this.timer) clearInterval(this.timer);
    process.stdout.write(`\r${color}${symbol}${RESET} ${message}\n`);
    process.stdout.write(`${ESC}[?25h`);
  }
}

// Box-drawing character sets
// "single" uses thin lines, "ddouble" uses double-stroke lines

export const boxChars = {
  single: {
    topLeft: "\u250C",
    bottomLeft: "\u2514",
    topRight: "\u2510",
    bottomRight: "\u2518",
    horizontal: "\u2500",
    vertical: "\u2502",
    // T-junctions for splitting boxes into sections
    tTop: "\u252C",
    tBottom: "\u2534",
    tLeft: "\u251C",
    tRight: "\u2524",
    cross: "\u253C",
  },

  double: {
    topLeft: "\u2554",
    bottomLeft: "\u255A",
    topRight: "\u2557",
    bottomRight: "\u255D",
    horizontal: "\u2550",
    vertical: "\u2551",
    tTop: "\u2566",
    tBottom: "\u2569",
    tLeft: "\u2560",
    tRight: "\u2563",
    cross: "\u256C",
  },

  rounded: {
    topLeft: "\u256D",
    bottomLeft: "\u2570",
    topRight: "\u256E",
    bottomRight: "\u256F",
    horizontal: "\u2500",
    vertical: "\u2502",
    tTop: "\u252C",
    tBottom: "\u2534",
    tLeft: "\u251C",
    tRight: "\u2524",
    cross: "\u253C",
  },
};

type BoxStyle = keyof typeof boxChars;

// Draw a box aroundcontent lines.
// Returns an array of strings, one per line
export function drawBox(
  lines: string[],
  options: {
    width?: number;
    title?: string;
    style?: BoxStyle;
    padding?: number;
  } = {},
): string[] {
  const { style = "single", padding = 1, title } = options;
  const chars = boxChars[style];
  const pad = " ".repeat(padding);
  // Determine inner width: either explicit or max line length.

  const innerWidth =
    options.width ?? Math.max(...lines.map((l) => l.length)) + padding * 2;
  // Build the top border, if a title is provided, embed it.

  const horizontal = chars.horizontal.repeat(innerWidth + padding * 2);

  let topBorder:string;
  if(!title){
    const t=` ${title }`;
    const left=Math.floor((innerWidth + padding *2));
    let right=innerWidth - t.length - left;
    topBorder=chars.topLeft + chars.horizontal.repeat(left) + t + chars.horizontal.repeat(right) + chars.topRight; 
  }
  else {
    topBorder=chars.topLeft + horizontal + chars.topRight
  }

  const result:string[]=[topBorder];
//   Each content line: left border, padding, text (padded to width), right border,

for (const line of lines) {
    const paddedLine=line.padEnd(innerWidth, "");
    result.push(chars.vertical + pad + paddedLine + pad + chars.vertical);

}

// Bottom border

result.push(chars.bottomLeft + horizontal + chars.bottomRight);

return result


}

// Usage example
const box=drawBox(["Hello, World!", "Terminal UI is fun"], {
    title:"Greetings",
    style:"rounded",
    padding:2
});

box.forEach(line=>console.log(line))
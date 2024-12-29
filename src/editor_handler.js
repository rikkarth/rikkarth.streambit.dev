import "../assets/styles/editor.css";

export class EditorHandler {
  #container;
  #textEl;
  #lineNumbersEl;
  #editorLineCounter = 1;

  /**
   * Prepares the editor for rendering text content with line numbers on the left side of the text area
   * @param {HTMLElement} app - the root element to which the editor will be appended
   */
  constructor() {
    this.#container = document.createElement("div");
    this.#textEl = document.createElement("div");
    this.#lineNumbersEl = document.createElement("div");

    this.#container.setAttribute("class", "editor");
    this.#textEl.setAttribute("class", "text-area");
    this.#lineNumbersEl.setAttribute("class", "line-numbers");

    this.#container.appendChild(this.#lineNumbersEl);
    this.#container.appendChild(this.#textEl);
  }

  get editor() {
    return this.#container;
  }

  get lineCount() {
    return this.#editorLineCounter;
  }

  update(text) {
    this.#textEl.innerHTML = text;

    const textElStyles = window.getComputedStyle(this.#textEl);

    // get canvas and context for measuring text width
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const font = `${textElStyles.fontSize} ${textElStyles.fontFamily}`;
    ctx.font = font;

    const maxWidth = this.#calcMaxWidth(textElStyles);

    const lines = text.split("\n");
    lines
      .filter((line) => line !== "")
      .filter((line) => !/<\/?ul>/.test(line))
      .forEach((line) => this.#measureAndRenderLineNums(line, ctx, maxWidth));
  }

  #measureAndRenderLineNums(line, ctx, maxWidth) {
    console.log(`${this.lineCount} : ${ctx.measureText(line).width} : ${line}`);

    // add one line number for each line
    const lineNumDiv = document.createElement("div");
    lineNumDiv.innerHTML = this.lineCount;
    this.#incrementEditorLineCounter();
    this.#lineNumbersEl.appendChild(lineNumDiv);

    const words = line.split(/(<[^>]+>| )/); // split by html tags and spaces

    let accumulator = 0;
    words.forEach((word) => {
      this.#parseBrTags(word);

      const wordWidth = ctx.measureText(word).width;

      // if the word is too long to fit on the current line
      if (accumulator + wordWidth > maxWidth) {
        accumulator = wordWidth; // start new line with the current word
        const shiftDiv = document.createElement("div");
        shiftDiv.innerHTML = "&nbsp;";
        this.#lineNumbersEl.appendChild(shiftDiv);
      } else {
        accumulator += wordWidth;
      }
    });
  }

  /**
   * Calculate the maximum width of the text area
   * @param {CSSStyleDeclaration} textElStyles
   * @returns {number} the maximum width of the text area
   */
  #calcMaxWidth(textElStyles) {
    const textAreaWidth = parseFloat(textElStyles.width);
    const paddingLeft = parseFloat(textElStyles.paddingLeft);
    const paddingRight = parseFloat(textElStyles.paddingRight);
    const borderLeftWidth = parseFloat(textElStyles.borderLeftWidth);
    const borderRightWidth = parseFloat(textElStyles.borderRightWidth);

    return (
      textAreaWidth -
      paddingLeft -
      paddingRight -
      borderLeftWidth -
      borderRightWidth
    );
  }

  #parseBrTags(word) {
    if (word.includes("<br>")) {
      console.log("br tag found");
      const el = document.createElement("div");
      el.innerHTML = this.#editorLineCounter;
      this.#incrementEditorLineCounter();
      this.#lineNumbersEl.appendChild(el);
    }
  }

  #incrementEditorLineCounter() {
    this.#editorLineCounter++;
  }
}

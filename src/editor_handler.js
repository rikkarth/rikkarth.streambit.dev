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

    this.processAndRenderLines(ctx);

    window.addEventListener("resize", () => {
      this.#editorLineCounter = 1;
      this.#lineNumbersEl.innerHTML = "";

      this.processAndRenderLines(ctx);
    });
  }

  processAndRenderLines(ctx) {
    Array.from(this.#textEl.childNodes)
      .filter((node) => node.nodeType === Node.ELEMENT_NODE)
      .map((node) => this.#processNode(node, ctx));
  }

  #processNode(node, ctx) {
    // if the node is a list, process each list item
    if (node.tagName === "UL") {
      this.#processListElements(node, ctx);
    } else {
      this.#measureAndRenderLineNums(node, ctx);
    }
  }

  #processListElements(ulNode, ctx) {
    Array.from(ulNode.childNodes)
      .filter((node) => node.nodeType === Node.ELEMENT_NODE)
      .forEach((li) => {
        const maxWidth = this.#calcMaxWidth(window.getComputedStyle(li));
        this.#measureAndRenderLineNums(li, ctx, maxWidth);
      });
  }

  /**
   *
   * @param {ChildNode} node
   * @param {CanvasRenderingContext2D} ctx
   */
  #measureAndRenderLineNums(node, ctx) {
    const maxWidth = this.#calcMaxWidth(window.getComputedStyle(node));

    const line = node.innerHTML;

    if (node.nodeName.match(/H[1-6]/)) {
      this.#shift();
    }

    this.#renderLineNumber();

    if (node.nodeName.match(/H[1-6]/)) {
      this.#shift();
    }

    const words = line.split(/(<[^>]+>| )/); // split by html tags and spaces

    let accumulator = 0;
    words.forEach((word) => {
      this.#parseBrTags(word);

      // don't measure if it is html tag
      if (/<[^>]+>/.test(word)) return;

      const wordWidth = ctx.measureText(word).width;

      // if the word is too long to fit on the current line
      if (accumulator + wordWidth > maxWidth) {
        accumulator = wordWidth; // start new line with the current word
        this.#shift();
      } else {
        accumulator += wordWidth;
      }
    });
  }

  #shift() {
    const shiftDiv = document.createElement("div");
    shiftDiv.innerHTML = "&nbsp;";
    this.#lineNumbersEl.appendChild(shiftDiv);
  }

  #renderLineNumber() {
    const lineNumDiv = document.createElement("div");
    lineNumDiv.innerHTML = this.lineCount;
    this.#incrementEditorLineCounter();
    this.#lineNumbersEl.appendChild(lineNumDiv);
  }

  /**
   * Calculate the maximum width of the text area
   * @param {CSSStyleDeclaration} textElStyles
   * @returns {number} the maximum width of the text area
   */
  #calcMaxWidth(textElStyles) {
    return parseFloat(textElStyles.width);
  }

  #parseBrTags(word) {
    if (word.includes("<br>")) {
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

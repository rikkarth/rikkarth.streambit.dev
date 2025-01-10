import $ from "jquery";
import "./editor.css";

export class EditorHandler {
    #container;
    #textEl;
    #lineNumbersEl;
    #editorLineCounter = 1;

    constructor() {
        this.#container = $("<div></div>").addClass("editor");
        this.#textEl = $("<div></div>").addClass("text-area");
        this.#lineNumbersEl = $("<div></div>").addClass("line-numbers");

        this.#container.append(this.#lineNumbersEl);
        this.#container.append(this.#textEl);
    }

    get editor() {
        return this.#container;
    }

    get lineCount() {
        return this.#editorLineCounter;
    }

    update(text) {
        this.#textEl.html(text);

        const textElStyles = window.getComputedStyle(this.#textEl.get(0));
        // get canvas and context for measuring text width
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const font = `${textElStyles.fontSize} ${textElStyles.fontFamily}`;
        ctx.font = font;

        this.processAndRenderLines(ctx);

        window.addEventListener("resize", () => {
            this.#editorLineCounter = 1;
            this.#lineNumbersEl.empty();

            this.processAndRenderLines(ctx);
        });
    }

    processAndRenderLines(ctx) {
        Array.from(this.#textEl.children())
            .filter((node) => node.nodeType === Node.ELEMENT_NODE)
            .map((node) => this.#processNode(node, ctx));
    }

    /**
     *
     * @param {HTMLElement} node
     * @param {*} ctx
     */
    #processNode(node, ctx) {
        // if the node is a list, process each list item
        if (node.tagName === "UL") {
            this.#processListElements(node, ctx);
        } else {
            this.#measureAndRenderLineNums(node, ctx);
        }
    }

    /**
     *
     * @param {HTMLElement} ulNode
     * @param {*} ctx
     */
    #processListElements(ulNode, ctx) {
        Array.from(ulNode.children)
            .filter((node) => node.nodeType === Node.ELEMENT_NODE)
            .forEach((li) => this.#measureAndRenderLineNums(li, ctx));
    }

    /**
     * Measure the width of the text and render line numbers
     * @param {Element} node
     * @param {CanvasRenderingContext2D} ctx
     */
    #measureAndRenderLineNums(node, ctx) {
        let maxWidth = this.#calcMaxWidth(window.getComputedStyle(node));

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
        const shiftDiv = $("<div></div>").html("&nbsp;");
        this.#lineNumbersEl.append(shiftDiv);
    }

    #renderLineNumber() {
        const lineNumDiv = $("<div></div>");
        lineNumDiv.html(this.lineCount);
        this.#incrementEditorLineCounter();
        this.#lineNumbersEl.append(lineNumDiv);
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
            const el = $("<div></div>").html(this.#editorLineCounter);
            this.#incrementEditorLineCounter();
            this.#lineNumbersEl.append(el);
        }
    }

    #incrementEditorLineCounter() {
        this.#editorLineCounter++;
    }
}

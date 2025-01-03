import figlet from "figlet";

import { commands, prompt } from "./commands.js";
import { directories } from "./directories.js";
import "../assets/styles/terminal.css";

/**
 *
 * @param {JQuery<HTMLElement>} container
 */
export function initializeTerminal(container) {
    const term = container.terminal(commands(), options());
    renderMOTD(term);
    enableClickOnCommand(term);
}

/**
 * Enables click functionality on commands within the terminal.
 * When a command element with the class 'command' is clicked,
 * it retrieves the text content of the clicked command element
 * and executes the command in the terminal.
 *
 * @param {Object} term - The terminal instance on which click functionality is enabled.
 */
function enableClickOnCommand(term) {
    term.on("click", ".command", function () {
        const command = $(this).text();
        term.exec(command);
    });
}

function options() {
    return {
        greetings: false,
        checkArity: false,
        exit: false,
        completion: true,
        prompt,
    };
}

function renderMOTD(term) {
    const font = "Slant"; // Standard is also an option
    figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts/" });
    figlet.loadFont([font], ready);

    function ready() {
        term.echo(() => {
            const ascii = render("Rikkarth");
            const header = `<darkolivegreen><glow>${ascii}</glow></darkolivegreen>`;
            const msg = `<div>\nWelcome to my Terminal Portfolio\n</div>`;

            return `${header}${msg}`;
        });
    }

    function render(text) {
        const cols = term.cols();
        return figlet.textSync(text, {
            font: font,
            width: cols,
            whitespaceBreak: true,
        });
    }
}

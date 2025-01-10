import Terminal from "jquery.terminal";
import XMLFormatter from "jquery.terminal/js/xml_formatting.js";
import "jquery.terminal/css/jquery.terminal.css";

const $ = Terminal(window);
XMLFormatter(window, $);

import { renderMOTD, commands, prompt } from "./commands.js";
import "./terminal.css";

/**
 *
 * @param {JQuery<HTMLElement>} container
 */
export function initializeTerminal(container) {
    const term = container.terminal(commands(), options());
    renderMOTD(term);
    enableClickOnCommand(term);
    return term;
}

/**
 * Enables click functionality on commands within the terminal.
 * When a command element with the class 'command' is clicked,
 * it retrieves the text content of the clicked command element
 * and executes the command in the terminal.
 *
 * @param {JQueryTerminal<HTMLElement>} term - The terminal instance on which click functionality is enabled.
 */
export function enableClickOnCommand(term) {
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
        prompt: prompt,
    };
}

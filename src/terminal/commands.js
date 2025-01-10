import figlet from "figlet";
import Terminal from "jquery.terminal";
import XMLFormatter from "jquery.terminal/js/xml_formatting.js";

const $ = Terminal(window);
XMLFormatter(window, $);

import Slant_flf from "../../assets/fonts/Slant.flf?raw";
import { directories } from "./directories.js";

const root = "~";
let cwd = root;

export function commands() {
    const result = {
        help() {
            this.echo(`Commands: ${help}`);
            window.scrollTo(0, document.body.scrollHeight);
        },
        echo(...args) {
            if (args.length > 0) {
                this.echo(args.join(" "));
            }
        },
        cd(dir = null) {
            if (dir === null || (dir === ".." && cwd !== root)) {
                cwd = root;
            } else if (
                dir.startsWith("~/") &&
                Object.keys(directories).includes(dir.substring(2))
            ) {
                cwd = dir;
            } else if (Object.keys(directories).includes(dir)) {
                cwd = root + "/" + dir;
            } else {
                this.error("Wrong directory");
            }
        },
        motd() {
            renderMOTD($("#terminal").terminal());
            window.scrollTo(0, document.body.scrollHeight);
        },
        refresh() {
            $("#terminal").terminal().clear();
            renderMOTD($("#terminal").terminal());
        },
        ls(dir = null) {
            if (dir) {
                if (dir.match(/^~\/?$/)) {
                    // ls ~ or ls ~/
                    print_home();
                } else if (dir.startsWith("~/")) {
                    const path = dir.substring(2);
                    const dirs = path.split("/");
                    if (dirs.length > 1) {
                        this.error("Invalid directory");
                    } else {
                        const dir = dirs[0];
                        this.echo(directories[dir].join("\n"));
                    }
                } else if (cwd === root) {
                    if (dir in directories) {
                        this.echo(directories[dir].join("\n"));
                    } else {
                        this.error("Invalid directory");
                    }
                } else if (dir === "..") {
                    print_home();
                } else {
                    this.error("Invalid directory");
                }
            } else if (cwd === root) {
                print_home();
            } else {
                const dir = cwd.substring(2);
                this.echo(directories[dir].join("\n"));
            }
        },
    };

    const help = formatHelp(result);

    return result;
}

function print_home() {
    $("#terminal")
        .terminal()
        .echo(
            Object.keys(directories)
                .map((dir) => `<bold><lime>${dir}</lime></bold>`)
                .join(" ")
        );
}

function formatHelp(commands) {
    const command_list = ["clear"].concat(Object.keys(commands));

    const formatter = new Intl.ListFormat("en", {
        style: "long",
        type: "conjunction",
    });

    const formatted_list = command_list.map((cmd) => {
        return `<white class="command">\n${cmd}</white>`;
    });

    highlightCommands(command_list);

    return formatter.format(formatted_list);
}

// Function to highlight commands in the terminal
function highlightCommands(command_list) {
    const reg = createCommandRegex(command_list);

    $.terminal.defaults.formatters.push(function (string) {
        return formatInputString(string, reg);
    });
}

// apply the new formatter to the terminal
function formatInputString(string, reg) {
    return string.replace(reg, formattedInput);
}

// format the matched command and arguments
function formattedInput(match, command, args) {
    return `[[b;lime;]${command}] [[;white;]${args}]`;
}

// create a regex pattern to differentiate commands from arguments
function createCommandRegex(command_list) {
    return new RegExp(`^\\s*(${command_list.join("|")}) (.*)`);
}

export function renderMOTD(term) {
    const font = "Slant"; // "Standard" is also an option
    figlet.parseFont("Slant", Slant_flf);
    figlet.loadFont([font], ready);

    function ready() {
        term.echo(() => {
            const ascii = render("Rikkarth");
            const header = `[[g;darkolivegreen;]${ascii}]`;
            const msg = `[[;#ffffff;]\nWelcome to my Terminal Portfolio\n][[i;;]Type 'help' for additional info]`;

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

export function prompt() {
    const user = "guest";
    const server = "streambit.dev";
    return `<lightgreen>${user}</lightgreen><Fuchsia>@</Fuchsia><orange>${server}:</orange><aqua>${cwd}</aqua><Fuchsia>$</Fuchsia> `;
  }
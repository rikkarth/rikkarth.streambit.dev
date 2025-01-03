import { directories } from "./directories.js";

const dirs = directories();

const root = "~";
let cwd = root;

export function commands() {
    const result = {
        help() {
            this.echo(`Commands: ${help}`);
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
                Object.keys(dirs).includes(dir.substring(2))
            ) {
                cwd = dir;
            } else if (Object.keys(dirs).includes(dir)) {
                cwd = root + "/" + dir;
            } else {
                this.error("Wrong directory");
            }
        },
    };

    const help = formatHelp(result);

    return result;
}

function formatHelp(commands) {
    console.log(commands);

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

    // Register a new formatter with the terminal
    // The terminal library calls this function with the input string
    $.terminal.new_formatter(function (string) {
        // 'string' is the input provided by the terminal
        return formatInputString(string, reg);
    });
}

// format the matched command and arguments
function formattedInput(match, command, args) {
    return `<bold><lime>${command}</lime></bold> <white>${args}</white>`;
}

// create a regex pattern to differentiate commands from arguments
function createCommandRegex(command_list) {
    return new RegExp(`^\\s*(${command_list.join("|")}) (.*)`);
}

// apply the new formatter to the terminal
function formatInputString(string, reg) {
    return string.replace(reg, formattedInput);
}

export function prompt() {
    const user = "guest";
    const server = "streambit.dev";
    return `<lightgreen>${user}</lightgreen><Fuchsia>@</Fuchsia><orange>${server}:</orange><aqua>${cwd}</aqua><Fuchsia>$</Fuchsia> `;
}

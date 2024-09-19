const { St, Clutter, Gio, GLib } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const GObject = imports.gi.GObject;

let tmuxIndicator;

const TmuxIndicator = GObject.registerClass(
class TmuxIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Tmux Indicator', false);

        // Create the icon for the indicator
        let icon = new St.Icon({
            icon_name: 'utilities-terminal-symbolic',
            style_class: 'system-status-icon',
        });

        this.add_child(icon);

        this._updateIndicator();
        this._tmuxCheckTimeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 10, this._updateIndicator.bind(this));
    }

    _updateIndicator() {
        let [success, output] = GLib.spawn_command_line_sync('tmux list-sessions');
        if (success && output.length > 0) {
            this.menu.removeAll();
            let sessions = String.fromCharCode.apply(null, output).split("\n").filter(s => s.trim() !== '');

            // Add tmux sessions to the dropdown menu
            sessions.forEach(session => {
                let sessionMenuItem = new PopupMenu.PopupMenuItem(session.split(':')[0]);
                sessionMenuItem.connect('activate', () => {
                    this._openSession(session);
                });
                this.menu.addMenuItem(sessionMenuItem);
            });
            this.actor.show();
        } else {
            this.actor.hide();
        }
        return true;  // Returning true to keep the timeout alive
    }

    _openSession(session) {
        let terminalEmulator = this._getTerminalEmulator();
        let commandFlag = this._getTerminalCommandFlag();
        if (terminalEmulator) {
            let sessionName = session.split(':')[0];
            let command;
            if (commandFlag === '') {
                // For terminals like foot that don't use flags for commands
                command = `${terminalEmulator} tmux attach-session -t ${sessionName}`;
            } else {
                // For terminals like gnome-terminal that need the flag
                command = `${terminalEmulator} ${commandFlag} tmux attach-session -t ${sessionName}`;
            }
            GLib.spawn_command_line_async(command);
        } else {
            log("No terminal emulator configured.");
        }
    }

    _getTerminalEmulator() {
        let settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.tmux-indicator');
        return settings.get_string('terminal-emulator');
    }

    _getTerminalCommandFlag() {
        let settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.tmux-indicator');
        return settings.get_string('terminal-command-flag');
    }

    destroy() {
        if (this._tmuxCheckTimeout) {
            GLib.source_remove(this._tmuxCheckTimeout);
            this._tmuxCheckTimeout = null;
        }
        super.destroy();
    }
});

function init() {}

function enable() {
    tmuxIndicator = new TmuxIndicator();
    Main.panel.addToStatusArea('tmux-indicator', tmuxIndicator);
}

function disable() {
    if (tmuxIndicator) {
        tmuxIndicator.destroy();
        tmuxIndicator = null;
    }
}

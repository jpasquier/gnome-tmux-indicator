import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

let tmuxIndicator, settings;
let keyBindingActive = false;
let updateInProgress = false;

const TmuxIndicator = GObject.registerClass(
class TmuxIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Tmux Indicator', false);

        let icon = new St.Icon({
            icon_name: 'utilities-terminal-symbolic',
            style_class: 'system-status-icon',
        });

        this.add_child(icon);

        this._updateIndicator();
        this._tmuxCheckTimeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 10, this._updateIndicator.bind(this));
    }

    _updateIndicator() {
        if (updateInProgress) return true;
        updateInProgress = true;

        let process = new Gio.Subprocess({
            argv: ['tmux', 'list-sessions'],
            flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE,
        });

        process.init(null);

        process.communicate_utf8_async(null, null, (proc, res) => {
            try {
                let [ok, stdout, stderr] = proc.communicate_utf8_finish(res);

                if (ok && stdout.trim().length > 0) {
                    this.menu.removeAll();
                    let sessions = stdout.trim().split("\n").filter(s => s.trim() !== '');
                    sessions.forEach(session => {
                        let sessionName = session.split(':')[0];
                        let sessionMenuItem = new PopupMenu.PopupMenuItem(sessionName);
                        sessionMenuItem.connect('activate', () => {
                            this._openSession(session);
                        });
                        this.menu.addMenuItem(sessionMenuItem);
                    });
                    this.show();
                } else {
                    this.hide();
                }
            } catch (e) {
                console.error('Tmux Indicator:', e);
                this.hide();
            } finally {
                updateInProgress = false;
            }
        });

        return true;
    }

    _openSession(session) {
        let terminalEmulator = settings.get_string('terminal-emulator');
        let commandFlag = settings.get_string('terminal-command-flag');

        if (terminalEmulator) {
            let sessionName = session.split(':')[0];
            let command;
            if (commandFlag === '') {
                command = `${terminalEmulator} tmux attach-session -t ${sessionName}`;
            } else {
                command = `${terminalEmulator} ${commandFlag} tmux attach-session -t ${sessionName}`;
            }
            GLib.spawn_command_line_async(command);
        } else {
            console.log("No terminal emulator configured.");
        }
    }

    _openMenuWithKeyboard() {
        this.menu.toggle();

        let menuItems = this.menu._getMenuItems();
        if (menuItems.length > 0) {
            menuItems[0].grab_key_focus();
        }
    }

    destroy() {
        if (this._tmuxCheckTimeout) {
            GLib.source_remove(this._tmuxCheckTimeout);
            this._tmuxCheckTimeout = null;
        }
        super.destroy();
    }
});

function _addKeybinding() {
    if (keyBindingActive) return;
    let keybinding = 'tmux-indicator-shortcut';
    let accelerator = settings.get_strv(keybinding)[0];
    if (!accelerator || accelerator == '') return;

    Main.wm.addKeybinding(
        keybinding,
        settings,
        Meta.KeyBindingFlags.NONE,
        Shell.ActionMode.NORMAL,
        () => {
            if (tmuxIndicator) {
                tmuxIndicator._openMenuWithKeyboard();
            }
        }
    );
    keyBindingActive = true;
}

function _removeKeybinding() {
    if (!keyBindingActive) return;
    let keybinding = 'tmux-indicator-shortcut';
    Main.wm.removeKeybinding(keybinding);
    keyBindingActive = false;
}

export default class TmuxIndicatorExtension extends Extension {
    enable() {
        settings = this.getSettings('org.gnome.shell.extensions.tmux-indicator');
        tmuxIndicator = new TmuxIndicator();
        Main.panel.addToStatusArea('tmux-indicator', tmuxIndicator);

        _addKeybinding();

        this._settingsConnection = settings.connect('changed::tmux-indicator-shortcut', () => {
            _removeKeybinding();
            _addKeybinding();
        });
    }

    disable() {
        if (this._settingsConnection) {
            settings.disconnect(this._settingsConnection);
            this._settingsConnection = null;
        }

        if (tmuxIndicator) {
            tmuxIndicator.destroy();
            tmuxIndicator = null;
        }

        _removeKeybinding();
        settings = null;
    }
}

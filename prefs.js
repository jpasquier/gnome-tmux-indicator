const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const ExtensionUtils = imports.misc.extensionUtils;

function init() {}

function buildPrefsWidget() {
    let settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.tmux-indicator');

    let widget = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10 });

    // Create a terminal emulator entry
    let terminalLabel = new Gtk.Label({ label: "Terminal Emulator:", halign: Gtk.Align.START });
    terminalLabel.set_margin_top(10);
    terminalLabel.set_margin_bottom(5);

    let terminalEntry = new Gtk.Entry({ text: settings.get_string('terminal-emulator') });
    terminalEntry.set_margin_bottom(10);

    terminalEntry.connect('changed', (entry) => {
        settings.set_string('terminal-emulator', entry.text);
    });

    // Create a terminal command flag entry
    let flagLabel = new Gtk.Label({ label: "Terminal Command Flag:", halign: Gtk.Align.START });
    flagLabel.set_margin_top(10);
    flagLabel.set_margin_bottom(5);

    let flagEntry = new Gtk.Entry({ text: settings.get_string('terminal-command-flag') });
    flagEntry.set_margin_bottom(10);

    flagEntry.connect('changed', (entry) => {
        settings.set_string('terminal-command-flag', entry.text);
    });

    widget.append(terminalLabel);
    widget.append(terminalEntry);
    widget.append(flagLabel);
    widget.append(flagEntry);

    return widget;
}

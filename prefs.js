const { GObject, Gio, Gtk } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

function init() {}

function buildPrefsWidget() {
    const settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.tmux-indicator');

    const widget = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10 });

    // Terminal emulator entry
    const terminalLabel = new Gtk.Label({ label: "Terminal Emulator:", halign: Gtk.Align.START });
    terminalLabel.set_margin_top(10);
    terminalLabel.set_margin_bottom(5);

    const terminalEntry = new Gtk.Entry({ text: settings.get_string('terminal-emulator') });
    terminalEntry.set_margin_bottom(10);

    terminalEntry.connect('changed', (entry) => {
        settings.set_string('terminal-emulator', entry.text);
    });

    // Terminal command flag entry
    const flagLabel = new Gtk.Label({ label: "Terminal Command Flag:", halign: Gtk.Align.START });
    flagLabel.set_margin_top(10);
    flagLabel.set_margin_bottom(5);

    const flagEntry = new Gtk.Entry({ text: settings.get_string('terminal-command-flag') });
    flagEntry.set_margin_bottom(10);

    flagEntry.connect('changed', (entry) => {
        settings.set_string('terminal-command-flag', entry.text);
    });

    // Keyboard shortcut entry
    const shortcutLabel = new Gtk.Label({ label: "Keyboard Shortcut:", halign: Gtk.Align.START });
    shortcutLabel.set_margin_top(10);
    shortcutLabel.set_margin_bottom(5);

    const currentShortcut = settings.get_strv('tmux-indicator-shortcut')[0] || '';

    const shortcutEntry = new Gtk.Entry({ text: currentShortcut });
    shortcutEntry.set_margin_bottom(10);

    shortcutEntry.connect('changed', (entry) => {
        const newShortcut = entry.text.trim();
        // Optionally validate the shortcut here
        settings.set_strv('tmux-indicator-shortcut', [newShortcut]);
    });

    widget.append(terminalLabel);
    widget.append(terminalEntry);
    widget.append(flagLabel);
    widget.append(flagEntry);
    widget.append(shortcutLabel);
    widget.append(shortcutEntry);

    return widget;
}

// Export the buildPrefsWidget function
var buildPrefsWidget = buildPrefsWidget;

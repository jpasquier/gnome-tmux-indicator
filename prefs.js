import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class TmuxIndicatorPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings('org.gnome.shell.extensions.tmux-indicator');

        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({
            title: 'Tmux Indicator Settings',
            description: 'Configure terminal emulator and keyboard shortcut',
        });
        page.add(group);

        // Terminal emulator row
        const terminalRow = new Adw.EntryRow({
            title: 'Terminal Emulator',
        });
        terminalRow.set_text(settings.get_string('terminal-emulator'));
        terminalRow.connect('changed', (entry) => {
            settings.set_string('terminal-emulator', entry.get_text());
        });
        group.add(terminalRow);

        // Terminal command flag row
        const flagRow = new Adw.EntryRow({
            title: 'Terminal Command Flag',
        });
        flagRow.set_text(settings.get_string('terminal-command-flag'));
        flagRow.connect('changed', (entry) => {
            settings.set_string('terminal-command-flag', entry.get_text());
        });
        group.add(flagRow);

        // Keyboard shortcut row
        const shortcutRow = new Adw.EntryRow({
            title: 'Keyboard Shortcut',
        });
        const currentShortcut = settings.get_strv('tmux-indicator-shortcut')[0] || '';
        shortcutRow.set_text(currentShortcut);
        shortcutRow.connect('changed', (entry) => {
            const newShortcut = entry.get_text().trim();
            settings.set_strv('tmux-indicator-shortcut', [newShortcut]);
        });
        group.add(shortcutRow);

        window.add(page);
    }
}

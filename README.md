# GNOME Tmux Indicator Extension

**Tmux Indicator** is a GNOME Shell extension that provides an indicator in the
top bar, which appears only if at least one tmux session is running. The
indicator allows you to list active tmux sessions and open a selected session
in the terminal emulator of your choice.

## Features

- Automatically shows an indicator when there are active tmux sessions.
- Displays a list of available tmux sessions.
- Allows users to select and open a session in their preferred terminal
  emulator.
- Customizable terminal emulator and command flag settings in the extension
  preferences.

## Installation

### From Extensions.Gnome.org

1. Navigate to [GNOME Extensions Website](https://extensions.gnome.org/).
2. Search for **Tmux Indicator**.
3. Click the switch to enable the extension.

### Manual Installation

1. Download the ZIP file of this extension from the
   [Releases](https://github.com/jpasquier/gnome-tmux-indicator/releases)
   page.
2. Unzip it to the GNOME Shell extensions directory:
   ```bash
   ~/.local/share/gnome-shell/extensions/tmux-indicator@jpasquier.github.com/
   ```
3. Enable the extension using the following command:
   ```bash
   gnome-extensions enable tmux-indicator@jpasquier.github.com
   ```
4. Restart GNOME Shell (`Alt+F2`, type `r`, and press Enter) or log out and log
   back in.

## Preferences

To configure the extension, open GNOME Tweaks, navigate to the "Extensions"
section, and click on the gear icon next to **Tmux Indicator**. The following
options are available:

- **Terminal Emulator**: Set the path to your preferred terminal emulator
  (e.g., `gnome-terminal`, `wezterm`, `foot`, etc.).
- **Terminal Command Flag**: Specify the flag used by your terminal emulator to
  pass commands. For example, use `--` for `gnome-terminal`, `-e` for
  `wezterm`, and nothing for `foot`.

## Supported Terminal Emulators

- **Gnome Terminal**: Default setting (`--` flag).
- **WezTerm**: Requires `-e` flag.
- **Foot**: Requires no flag (leave empty).

If your terminal emulator requires a different flag to pass commands, simply
update it in the preferences.

## Development

### Cloning and Building

1. Clone the repository:
   ```bash
   git clone https://github.com/jpasquier/gnome-tmux-indicator.git
   cd gnome-tmux-indicator
   ```
2. Install the extension manually by copying the files to
   `~/.local/share/gnome-shell/extensions/tmux-indicator@github.com/`.
3. Compile the GSettings schema:
   ```bash
   glib-compile-schemas schemas/
   ```

4. Restart GNOME Shell or log out and log back in.

### Directory Structure

```plaintext
tmux-indicator@jpasquier.github.com
├── extension.js         # Core logic of the extension
├── metadata.json        # Extension metadata
├── prefs.js             # Preferences window
├── schemas              # GSettings schema for preferences
├── README.md            # This file
└── LICENSE              # License file
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request
with improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.

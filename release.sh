#!/bin/bash

glib-compile-schemas schemas
zip -r -9 tmux-indicator@jpasquier.github.com.zip schemas/ extension.js metadata.json prefs.js

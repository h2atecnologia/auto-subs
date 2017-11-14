# auto-subs

A tiny CLI tool to download subs from any folder.

This is a fork of https://github.com/olup/auto-subs

```
npm install -g auto-subs
```

Then, open a terminal and cd into the directory where your video is, and run:

```
auto-subs
```

Then select the best result from the list

## Options

`-f <filename>` to specify a video file for wich you need the subs. If not specified, the cli tool lets you choose between all video files present in folders.

`-l <language>` to specify the language you need in two letters (`en`, `fr` etc..) If not specified, the cli lets you choose between all languages available.

In any case, if multiple subs are available, the cli lets you choose.

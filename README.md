# ConfigEdit

Configuration editor using WebView

## Developer usage

This library is mainly meant to included within other applications for easy configuration.
You can compile ConfigEdit into an executable with `deno compile`:

```
deno compile -A --unstable https://deno.land/x/configedit/mod.ts --schema src/schema.json config.json
```

The user can override the config being edited by adding it as an argument to the compiled app
(or by dragging the config onto the executable).

---

You can also call the API directly from your own code, if you need to make some extra modifications.
See [example/advanced/mod.ts](example/advanced/mod.ts) for an advanced example
using YAML and version migration.

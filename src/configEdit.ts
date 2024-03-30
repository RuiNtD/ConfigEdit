// deno-lint-ignore-file no-explicit-any
import { Webview } from "@webview/webview";
import { resolve, toFileUrl } from "@std/path";
import { pathToUrl } from "./urlConversions.ts";
// @deno-types="npm:@types/json-editor"
export { type JSONEditorOptions } from "@json-editor/json-editor";

const thisDir = new URL(".", import.meta.url);

export default async function openConfigEdit<T>(opts: {
  configPath?: string;
  schemaPath?: string;
  schema?: Record<string, any>;
  customSave?: (data: T) => void;
  customLoad?: () => T;
  editorOptions?: JSONEditorOptions<T>;
}): Promise<void> {
  let schema: unknown = undefined;
  const configPath = resolve(opts.configPath || "config.json");

  if (opts.schema) schema = opts.schema;
  else {
    let schemaURL: URL | undefined;
    try {
      const file = await Deno.readTextFile(configPath);
      const json = JSON.parse(file);
      if (json["$schema"])
        schemaURL = pathToUrl(
          json["$schema"],
          new URL(".", toFileUrl(configPath))
        );
      // deno-lint-ignore no-empty
    } catch {}
    if (!schemaURL && opts.schemaPath) schemaURL = pathToUrl(opts.schemaPath);
    if (schemaURL) schema = await (await fetch(schemaURL)).json();
  }

  let startval: T | undefined;
  try {
    startval = load();
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) console.log("Config not found");
    else console.error(`Failed to load config: ${e}`);
  }

  const editorOptions = {
    ...{
      schema,
      startval,
      // https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/67566
      theme: "spectre",
      iconlib: "spectre",
    },
    ...opts.editorOptions,
  } as JSONEditorOptions<T>;

  let html = await (await fetch(new URL("index.html", thisDir))).text();
  html = html.replace(
    /^\s*const editorOptions = .*$/m,
    `const editorOptions = ${JSON.stringify(editorOptions)};`
  );

  const webview = new Webview();
  webview.title = "Config Editor";
  webview.navigate(`data:text/html,${encodeURIComponent(html)}`);

  webview.bind("wvSave", (data) => {
    console.log("Saving Config", data);
    save(data);
  });

  webview.bind("wvLoad", () => {
    console.log("Loading Config");
    return load();
  });

  function save(data: T) {
    if (opts.customSave) opts.customSave(data);
    else Deno.writeTextFileSync(configPath, JSON.stringify(data, null, 2));
  }

  function load(): T {
    if (opts.customLoad) return opts.customLoad();
    else return JSON.parse(Deno.readTextFileSync(configPath));
  }

  console.log("Opening Config Editor");
  webview.run();
}

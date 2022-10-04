// deno-lint-ignore-file no-explicit-any
import { Webview } from "https://deno.land/x/webview@0.7.5/mod.ts";
import { resolve, toFileUrl } from "https://deno.land/std@0.153.0/path/mod.ts";
import { pathToUrl } from "./urlConversions.ts";
import { Schema } from "https://deno.land/std@0.158.0/encoding/_yaml/schema.ts";

const thisDir = new URL(".", import.meta.url);

export default async function openConfigEdit(opts: {
  configPath?: string;
  schemaPath?: string;
  schema?: Record<string, any>;
  customSave?: (data: any) => void;
  customLoad?: () => any;
}): Promise<void> {
  let schema: unknown = undefined;
  let schemaURL: URL | undefined;
  const configPath = resolve(opts.configPath || "config.json");

  if (opts.schema) schema = opts.schema;
  else {
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

  if (!schema) schema = {};

  let html = await (await fetch(new URL("index.html", thisDir))).text();
  html = html.replace(
    /^\s*import schema.*$/m,
    `const schema = ${JSON.stringify(schema)};`
  );

  const webview = new Webview();
  webview.title = "Config Editor";
  webview.navigate(`data:text/html,${encodeURIComponent(html)}`);

  webview.bind("wvSave", (data) => {
    console.log("Saving Config", data);
    if (opts.customSave) opts.customSave(data);
    else Deno.writeTextFileSync(configPath, JSON.stringify(data, null, 2));
  });

  webview.bind("wvLoad", () => {
    console.log("Loading Config");
    if (opts.customLoad) return opts.customLoad();
    else return JSON.parse(Deno.readTextFileSync(configPath));
  });

  console.log("Opening Config Editor");
  webview.run();
}

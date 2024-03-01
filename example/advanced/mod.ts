// deno-lint-ignore-file no-explicit-any no-fallthrough

import openConfigEdit from "../../src/mod.ts";
import { join, fromFileUrl } from "@std/path";
import schema from "./schema.json" with { type: "json" };
import * as YAML from "@std/yaml";

const thisDir = fromFileUrl(new URL(".", import.meta.url));
const configPath = join(thisDir, "config.yml");

try {
  const conf: any = YAML.parse(await Deno.readTextFile(configPath));
  switch (conf._VERSION) {
    case 1:
      conf.username = conf.name;
      delete conf.name;
    case 2:
      conf._VERSION = 3;
      await Deno.writeTextFile(configPath, YAML.stringify(conf));
  }
  // deno-lint-ignore no-empty
} catch {}

openConfigEdit({
  // schemaPath: "schema.json",
  schema,
  customSave: (data: any) => {
    Deno.writeTextFileSync(configPath, YAML.stringify(data));
  },
  customLoad: () => {
    return YAML.parse(Deno.readTextFileSync(configPath));
  },
});

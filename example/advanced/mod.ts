// deno-lint-ignore-file no-explicit-any

import openConfigEdit from "../../mod.ts";
import { join, fromFileUrl } from "https://deno.land/std@0.153.0/path/mod.ts";
import schema from "./schema.json" assert { type: "json" };
import * as YAML from "https://deno.land/std@0.158.0/encoding/yaml.ts";

const thisDir = fromFileUrl(new URL(".", import.meta.url));
const configPath = join(thisDir, "config.yml");

try {
  const conf: any = YAML.parse(await Deno.readTextFile(configPath));
  switch (conf._VERSION) {
    case 1:
      conf.username = conf.name;
      delete conf.name;
  }
  conf._VERSION = 2;
  Deno.writeTextFile(configPath, YAML.stringify(conf));
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

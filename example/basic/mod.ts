import openConfigEditor from "../../mod.ts";
import schema from "./schema.json" assert { type: "json" };
import { fromFileUrl, join } from "https://deno.land/std@0.208.0/path/mod.ts";

const thisDir = fromFileUrl(new URL(".", import.meta.url));
const configPath = join(thisDir, "config.json");

openConfigEditor({
  configPath,
  //schemaPath: "schema.json",
  schema,
});

import openConfigEditor from "../../src/mod.ts";
import schema from "./schema.json" with { type: "json" };
import { fromFileUrl, join } from "@std/path";

const thisDir = fromFileUrl(new URL(".", import.meta.url));
const configPath = join(thisDir, "config.json");

openConfigEditor({
  configPath,
  //schemaPath: "schema.json",
  schema,
});

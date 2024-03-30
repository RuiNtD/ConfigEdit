import { parseArgs } from "@std/cli/parse-args";
import openConfigEdit from "./configEdit.ts";

export default openConfigEdit;

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    string: ["_", "schema"],
    alias: {
      schema: "s",
    },
  });

  openConfigEdit({
    schemaPath: args.schema,
    configPath: args._[args._.length - 1],
  });
}

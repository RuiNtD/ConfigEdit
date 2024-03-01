import { Command } from "cliffy/command/mod.ts";
import openConfigEdit from "./configEdit.ts";

export default openConfigEdit;

if (import.meta.main) {
  const { args, options } = await new Command()
    .name("ConfigEdit")
    .version("1.0.4")
    .option("-s, --schema <path:string>", "JSON Schema path")
    .arguments("<config...>")
    .parse(Deno.args);

  openConfigEdit({
    schemaPath: options.schema,
    configPath: args[args.length - 1],
  });
}

import {
  toFileUrl,
  fromFileUrl,
  resolve,
} from "https://deno.land/std@0.208.0/path/mod.ts";

export function urlToPath(url: string | URL): string {
  try {
    return fromFileUrl(url);
    // deno-lint-ignore no-empty
  } catch {}
  if (url instanceof URL) throw new TypeError();
  return url;
}

export function pathToUrl(path: string | URL, base?: string | URL): URL {
  if (path instanceof URL) return path;
  try {
    const url = new URL(path);
    const { protocol } = url;
    if (protocol == "http:" || protocol == "https:" || protocol == "file:")
      return url;
    // deno-lint-ignore no-empty
  } catch {}
  return toFileUrl(resolve(urlToPath(base || Deno.cwd()), path));
}

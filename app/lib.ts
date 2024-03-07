import { parseArgs } from "util";

export function parseDirectoryNameFromFlag() {
  const parsedResult = parseArgs({
    options: {
      directory: {
        type: "string",
      },
    },
  });

  return parsedResult.values.directory ?? null;
}

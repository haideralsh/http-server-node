const { parseArgs } = require("util");

function parseDirectoryNameFromFlag() {
  const parsedResult = parseArgs({
    options: {
      directory: {
        type: "string",
      },
    },
  });

  return parsedResult.values.directory ?? null;
}

module.exports = { parseDirectoryNameFromFlag };

// This transport enables Winston logging to the console.
const winston = require("winston");
const { format } = winston;
const { combine, timestamp, printf } = format;

function createJsonTransport() {
  return new winston.transports.Console({
    handleExceptions: true,
    format: combine(
      timestamp(),
      printf(info => {
        let { timestamp, level, error, ...args } = info;
        if (error) {
          // If there is an error then convert it from a Javascript error object into a string.
          error = JSON.parse(
            JSON.stringify(
              error
                .replace(/\r?\n|\r/g, "")
                .replace(/\s\s+/g, " ") // Remove tabbed chars
                .replace(/\\"/g, ""), // Remove escaped quotes
              Object.getOwnPropertyNames(error) // Turn the json object into a parsable structure.
            )
          );

          info = { timestamp, level, error, ...args };
        }
        return JSON.stringify(info);
      })
    )
  });
}

module.exports = { createJsonTransport };

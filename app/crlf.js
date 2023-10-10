// The end-of-line marker that HTTP uses
const CRLF = "\r\n";

const withCRLF = (s) => s + CRLF;

module.exports = {
  CRLF,
  withCRLF,
};

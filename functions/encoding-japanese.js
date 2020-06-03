import encoding from "encoding-japanese";
import fetch from "node-fetch";

exports.handler = async function (event, context, callback) {
  const queryParameters = event.queryStringParameters
  if (!queryParameters.url) {
    return {
      statusCode: 400,
      body: "query patameters `url` must be specified."
    }
  }
  const response = await fetch(queryParameters.url)
  const binary = await response.buffer()

  const utf8text = Buffer.from(encoding.convert(binary, "UTF8")).toString("utf-8")

  var replaced;
  switch (encoding.detect(binary)) {
    case "SJIS":
      replaced = utf8text
        .replace("charset=Shift_JIS", "charset=UTF-8")
        .replace('<?xml version="1.0" encoding="shift_jis"?>', '');
      break;
    default:
      break;
  }

  return {
    statusCode: 200,
    body: replaced
  };
}

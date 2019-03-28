const initTracer = require("jaeger-client").initTracer;
const express = require("express");
const request = require("request");
var endpoints = express();

const config = {
  serviceName: "nodejs-jaeger-tutorial",
  reporter: {
    logSpans: true,
    agentHost: "localhost",
    agentPort: 6832
  },
  sampler: {
    type: "probabilistic",
    param: 1.0
  }
};

const options = {
  tags: {
    "nodejs-jaeger-tutorial.version": "1.1.2"
  }
};

const tracer = initTracer(config, options);

endpoints.listen(3000, () => {
  console.log("Listening on port 3000");
})

endpoints.get("/url", (req, res, next) => {
  const span = tracer.startSpan("ENDPOINT");
  res.json(["Tony","Lisa","Michael","Ginger","Food"]);
  span.setTag("GET", "url");
  span.log({ 'event': "Check URL" });
  span.finish();
});

endpoints.get("/google", (req, res, next) => {
  const span = tracer.startSpan("ENDPOINT");
  request('http://www.google.com', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    res.send(body); // Print the HTML for the Google homepage.
  });
  span.setTag("GET", "Google");
  span.log({ 'event': "Displaying Google Homepage" });
  span.finish();
});
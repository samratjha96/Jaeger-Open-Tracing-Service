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

endpoints.listen(4000, () => {
  console.log("Listening on port 4000");
})

endpoints.get("/", (req, res, next) => {
  const span = tracer.startSpan("HOMEPAGE");
  res.send("Welcome to a Jaeger tracing example");
  sleep("HOMEPAGE").then( () => {
    span.setTag("GET", "Home");
    span.finish();
  });
}); 

endpoints.get("/github", (req, res, next) => {
  const span = tracer.startSpan("GITHUB");
  request(
    { headers: {
    'User-Agent': 'Test'
    },
    uri: 'https://api.github.com/repos/opentracing/opentracing-javascript/pulls'
   }, 
   function(error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      res.json(JSON.stringify(body, null, 2));
    });
  sleep("GITHUB").then(() => {
    span.setTag("GET", "GITHUB");
    span.log({ 'event': "Check Github Pull Requests" });
    span.finish();
  })
});

endpoints.get("/google", (req, res, next) => {
  const span = tracer.startSpan("GOOGLE");
  request('http://www.google.com', function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    res.send(body); 
  });
  sleep("GOOGLE").then(() => {
    span.setTag("GET", "Google");
    span.log({ 'event': "Displaying Google Homepage" });
    span.finish();
  }); 
});

function sleep(endpoint) {
  var randomSleepTime = Math.random() * (5000 - 1000) + 1000;
  console.log("In " + endpoint + " sleeping for " + Math.floor(randomSleepTime) + " milliseconds");
  return new Promise(resolve => setTimeout(resolve, randomSleepTime));
}
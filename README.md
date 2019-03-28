# Jaeger Tracing NodeJS Example
This is a simple NodeJS backed with Express example of a REST API that sends metrics to Jaeger

## Development
1. Clone this repo
1. Run `./service.sh`. This will run a simple `docker run` command and expose all the necessary ports for us to use Jaeger
1. The Jaeger service should be available at [http://localhost:16686](http://localhost:16686)
1. Run `npm install` to get all the dependencies
1. Run `node tracer.js` to start the listener on port 4000
1. You have access to a few endpoints for testing purposes
    - `/`: This is the default endpoint
    - `/github`: This makes a Github API request to retrieve all the open pull requests in the opentracing-javascript repository
    - `/google`: This retrieves the html code for the Google homepage
1. All the endpoints are setup with a random sleep amount to vary the time it takes to make the request
1. Navigate to `http://localhost:4000/<endpoint>`
1. Go to [http://localhost:16686](http://localhost:16686) and expand the `Service` dropdown
1. Select `nodejs-jaeger-tutorial` and click on `Find Traces` to see the data about the HTTP request you just made
1. You can click on each of the traces and drill down into them to see execution time, the tags and the logs that were configured for that endpoint as well as some information about the process
1. Play around and make more requests to the various endpoints and click `Find Traces` on Jaeger after every request to see the stats for that request show up on the dashboard
1. Run `./sevice.sh down` to terminate the Jaeger container

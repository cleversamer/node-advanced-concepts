// A built-in module for making http requests
const https = require("https");

// Detecting the current time to calculate how much
// time each process will take.
const start = Date.now();

// A function with the code for making a request
function doRequest() {
  https
    .request("https://www.google.com", (res) => {
      res.on("data", (data) => {});

      res.on("end", () => {
        console.log(`${Date.now() - start}ms`);
      });
    })
    .end();
}

// Making a request multiple times...
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();

/*
    We made a request to `https://www.google.com` multiple times
    and we noticed that all requests took almost the same time!

    HINT: the above process is marked as pendingOSTask.
    HINT: the above code is not related to the Thread Pool.
          because it's an OS Task and the OS decides whether
          it will use multiple threads or not.

    * How the above code will be executed?
      We're trying to make http requests, but in the same time,
      neither Node nor Libuv has code to handle low-level operations
      like networking stuff.
      So Libuv delegates the request making to the underline operating system.
      So it's actually our operating system that does the real http request.
      And Libuv is used to issue the request, and it does wait for the operating
      system to emit a signal the some response has come back to the request.
*/

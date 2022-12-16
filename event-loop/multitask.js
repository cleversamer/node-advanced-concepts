// A built-in module for making http requests
const https = require("https");

// A built-in module
const crypto = require("crypto");

// A built-in module for dealing with file system
const fs = require("fs");

// Detecting the current time to calculate how much
// time each process will take.
const start = Date.now();

// A function with the code for making a request
function doRequest() {
  https
    .request("https://www.google.com", (res) => {
      res.on("data", (data) => {});

      res.on("end", () => {
        console.log(`Request: ${Date.now() - start}ms`);
      });
    })
    .end();
}

// A function with the code for hashing
function doHash() {
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", (err, derivedKey) => {
    console.log(`Hash: ${Date.now() - start}ms`);
  });
}

// A function with the code for reading this file
function doRead() {
  fs.readFile("multitask.js", "utf8", (err, data) => {
    console.log(`FS: ${Date.now() - start}ms`);
  });
}

// Making a request once
doRequest();

// Reading this file once
doRead();

// Hashing 4 times
doHash();
doHash();
doHash();
doHash();

/*
  First, we made a request which is considered as a networking stuff
  by the Event Loop and it does not make any use of the Thread Pool.

  The `crypto` and `fs` modules make use of the Thread Pool. So they
  need threads, and the Thread Pool makes use of four threads by default.

  By running this file, we have noticed that first we always receive
  an http response, and then one or two hashes will be complete first.
  Second, the `read` operation will be complete.
  And finally, the other two or three hashes will be complete.

  Let's explain how that happens..

  * How the above code will be executed?
    The `request` operation will be proccessed by the OS.
    
    And now we have one `read` operation, and then four
    `hash` operations, and they are all make use of the
    Thread Pool.
    
    The Thread Pool uses four threads by default, and that means
    it can proccess four operations in the same time at most, and
    we have five operations.

    First, the `fs` module doesn't go directly to the file to read it.
    It will request file stats from the hard drive, and this proccess
    takes a while.

    So the Thread Pool will receive the following operations first:
    1. request file stats from the hard drive
    2. hash operation #1
    3. hash operation #2
    4. hash operation #3
    
    Thread #1 is now empty and is able to receive another job, and the
    another job will be the last `hash` operation which is hash #4.

    And now the first one or two `hash` operations will be complete,
    and the first thread that completes its task will be available
    to receive file stats from the hard drive and it will read
    the file.

    After that the last two or three `hash` operation will be complete.
*/

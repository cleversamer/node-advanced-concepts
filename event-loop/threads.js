// UV_THREADPOOL_SIZE => The number of threads that the Thread Pool uses.
// Thread Pool        => Is built-in inside libuv.

process.env.UV_THREADPOOL_SIZE = 8; // Default is 4, and maximum is 1024.

// A built-in Node module
const crypto = require("crypto");

// Detecting the current time to calculate how much
// time each process will take.
const start = Date.now();

// Operation 1
crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log(`1: ${Date.now() - start}ms`);
});

// Operation 2
crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log(`2: ${Date.now() - start}ms`);
});

// Operation 3
crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log(`3: ${Date.now() - start}ms`);
});

// Operation 4
crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log(`4: ${Date.now() - start}ms`);
});

// Operation 5
crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log(`5: ${Date.now() - start}ms`);
});

/*

  Assume that a hashing operation takes 1000ms.
  HINT: the value differs depending on your machine's CPU.

  * How the above code will be executed?
    1. The `Event Loop` will start
    2. The `Event Loop` will append each hashing operation to the pendingOperations
       array as we wrote at `loop.js` file. So it will not wait for each operation
       to complete before jumping to the next one.
    3. First four operations will be assigned to the `Thread Pool` to be proccessed
       because the `Thread Pool` by default uses four threads and each operation needs
       one thread to be executed (Don't forget that each operation takes 1000ms).
    4. Once an operation is complete, the fifth operation will be assigned to the
       empty thread and it will take additional 1000ms to execute.

  * Is node single-threaded?
    Yes, but no at the same time.
    Because some of built-in Node modules are using more threads (e.g. fs module).

  * What is the Thread Pool?
    A thread pool is a collection of worker threads that efficiently execute asynchronous
    callbacks on behalf of the application. The thread pool is primarily used to reduce the
    number of application threads and provide management of the worker threads.
    
*/

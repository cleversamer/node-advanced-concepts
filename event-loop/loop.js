// node myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// New timers, tasks, operations are recorded from myFile running.
myFile.runContents();

function shouldContinue() {
  // Check 1: Any pending setTimeout, setInterval, setImmediate?
  // Check 2: Any pending OS tasks? (Like server listening to port)
  // Check 3: Any pending long running operations? (Like fs module)

  return (
    pendingTimers.length || pendingOSTasks.length || pendingOperations.length
  );
}

// Entire body executes in one 'tick'
while (shouldContinue()) {
  // 1) Node looks at pendingTimers and sees if any functions
  // are ready to be called (setTimeout, setInterval).
  //
  // 2) Node looks at pendingOSTasks and pendingOperations and
  // calls relevant callbacks.
  //
  // 3) Node pauses execution, and continue when:
  // - A new pendingOSTask is done.
  // - A new pendingOperation is done.
  // - A timer is about to complete.
  //
  // 4) Node looks at pendingTimers. Call any setImmediate.
  //
  // 5) Handles any `close` events.
}

// exit back to terminal

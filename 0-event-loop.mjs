// L1
console.log('🥪 Synchronous 1');

// L2 Micro task
setTimeout(_ => console.log(`🍅 Timeout 2`), 0);

// L3 Macro task
Promise.resolve().then(_ => console.log('🍍 Promise 3'));

// L4
console.log('🥪 Synchronous 4');

// Macro task(promise is always before Micro task such as setTimeout)


/* More details
https://www.youtube.com/watch?v=PNa9OMajw9w
-------------------------------------------------------- */
// Event loop phases. Callbacks of each phases executed before next phase
1. setTimeout -> callbacks -> nextTick(MacroTask) queue -> dispatch to corresponding phase
2. I/O request -> callbacks (Network/Disk/Child process/Promise etc) -> MicroTask queue -> dispatch to corresponding phase
3. setImmediate -> callbacks -> MicroTask queue -> to corresponding phase
4. close event -> callbacks -> nextTick(MacroTask) queue -> dispatch to corresponding phase
// process.exit()

// IMPORTANT
// https://blog.insiderattack.net/timers-immediates-and-process-nexttick-nodejs-event-loop-part-2-2c53fd511bb3
/*  
1. Any callbacks in a phase could register a event to another phase in main loop, 
   such as setTimeout() within a callback would register timer to setTimeout PHASE.
   But this doesn't change current Phase in the main event loop.

   fs.readFile(__filename,          //1. ReadFile is IO request, so we are at I/O phase 
        () => {                     //2. Callback is register as an event in I/O queue, if no other Node event is in IO phase 
                                    //   such as another readFile, then queues are being processed
            setTimeout(() => {      //3. Add to nextTick MacroTask queues
                console.log('timeout')
            }, 0);
            setImmediate(() => {    //3. Add to IO MicroTask queues(like promise)
                console.log('immediate')
        })
    });



2. Each callback could have its own eventloop for nextTick loop and resolved Promise loop. Promise loop is nested within nextTick loop.
    
    process.nextTick callback is a "event queue" (MicroTask/setTimeout/setInterval/Close phase callbacks)
    promise callbacks is a "MacroTask queue" (I/O, setImmediate)

    ORDER: 
    Node checks for nextTick queue first, and process them until it's empty before moving to next "event loop phase"
    1 process.nextTick callbacks -> 
    2 resolved promises -> 
    3 next event loop phase in main thread (if no event, it continues main eventloop which is main thread tasks) 
    (this is how Async function works)

3. NextTick has limit of 1000 maximum events because it'll trigger a "starving" state which blocks any IO. 
    nextTick is not really "immediate" because it trigger after eventloop clears events
    setImmediate is actually more like a "next tick"
    
*/
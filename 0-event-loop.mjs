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
2. I/O request -> callbacks (Network/Disk/Child process/Promise etc) -> keep polling IO -> MicroTask queue -> dispatch to corresponding phase
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
        () => {                     //2. Once the file is read, callback is register as an event in I/O queue (not macrotask queue)
                                    //   if no other #1 events, Node will start execute IO queue, in this case the #2 callback

            setTimeout(() => {      //3. Add to Timer queue, then register callback as event to "nextTick MacroTask queues"
                console.log('timeout') // 6. Immediate phase finishes, then back to Timer phase and callback is handled.
            }, 0);
            
            setImmediate(() => {    //3. Add to Immediate queue as event, then add to "IO MicroTask queues(like promise)" 
                                    //4. Eventloop goes to next phase -> Immediate phase since we were at I/O phase, and no other IO events in IO queue(IO keeps polling)
                console.log('immediate') //5. callback is handled 
            })
    });



2. NextTick queue(Macro callbacks) is always run before "Micro callbacks queues"
    
    ORDER: 
    1. Node checks for Macro queue first, and process them until it's empty (if add a new event to queue, then it will be process before #2)
    2. process Micro queues (if Macro event is added in #2, then after #2, it'll run #1 again)


3. NextTick has limit of 1000 maximum events, because it could result a "starving" state which blocks any IO event 
*/
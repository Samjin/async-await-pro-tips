// L1
console.log('🥪 Synchronous 1');

// L2 Macro task
setTimeout(_ => console.log(`🍅 Timeout 2`), 0);

// L3 Micro task
Promise.resolve().then(_ => console.log('🍍 Promise 3'));

// L4
console.log('🥪 Synchronous 4');

/* 
    In the event loop:
    1. If CallStack is empty (otherwise, it'll execute all functions in callstack one by one before running any queues)
    2. nextTick queue (managed by node)
    3. MicroTask queues (managed by v8)
    4. Macro queues

    Execution order
    1. nextTick (rarely used since there isn't performance gain)
    2. microTasks (mostly used)
    3. timers (expired)
    4. immediate

*/


/* Must watch 
https://www.youtube.com/watch?v=BeHj9UOuUZ0&ab_channel=codedamn
https://stackoverflow.com/questions/55467033/difference-between-process-nexttick-and-queuemicrotask
-------------------------------------------------------- */

// <button id="btn1">This is button one</button>
// <button id="btn2">This is button two</button>

function funcOne () {
    setTimeout(()=> console.log('#1 timeout 1'), 0)
    Promise.resolve().then(() => console.info('#1 promise 1'))
    const promise = Promise.resolve()
    setTimeout(()=> console.log('#1 timeout 2'), 0)
    console.info('#1 main thread');
    setTimeout(()=> promise.then(() => console.info('#1 promise 2')), 0)
}

function funcTwo () {
    setTimeout(()=> console.log('#2 timeout 1'), 0)
    Promise.resolve().then(() => console.info('#2 promise 1'))
    const promise = Promise.resolve()
    setTimeout(()=> console.log('#2 timeout 2'), 0)
    console.info('#2 main thread');
    setTimeout(()=> promise.then(() => console.info('#2 promise 2')), 0)
}

// const btn = document.getElementById('btn1')
// btn.addEventListener('click', funcOne, false)
// btn.addEventListener('click', funcTwo, false)

// Example two: btn2.addEventListener('click', btn.click) //btn.click 

/* 
callstack = []
taskQueues = []
MicroTaskQueues = []

#1 main thread
#1 promise 1
#2 main thread
#2 promise 1
#1 timeout 1
#1 timeout 2
#2 timeout 1
#2 timeout 2
#2 promise 2
 */


// IMPORTANT
// https://blog.insiderattack.net/timers-immediates-and-process-nexttick-nodejs-event-loop-part-2-2c53fd511bb3
/*  
1. Any callbacks in a phase could register a event to another phase in main loop, 
   such as setTimeout() within a callback would register timer to setTimeout PHASE.
   But this doesn't change current Phase in the main event loop.

   fs.readFile(__filename,          //1. ReadFile is IO request, so we are at I/O phase 
        () => {                     //2. Once the file is read, callback is registered as an event in I/O queue (not macrotask queue)
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

m1 
m2
t1
m3 => t3
m4
m5
t2
t3

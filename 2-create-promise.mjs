// Note:
// I/O requests doesn't have blocking limitation
// However, Threads works(depending on cpus) does depending on threadPools(default 4 from node). 

const tick = Date.now();
const log = (v) => console.log(`${v} \n Elapsed: ${Date.now() - tick}ms`);

const notBlocked_1 = async () => {
    await Promise.resolve();
        let i = 0;
        while(i < 1000000000) { i++; }
        return '🐷 billion loops done 1';
}

const notBlocked_2 = async () => {
    await Promise.resolve(); //use await
    let i = 0;
    while(i < 1000000000) { i++; }
    return '🐷 billion loops done 2';
}


log('🥪 Synchronous 1');

//why enabling both function make running time doubled but still concurrently? Is this Cpu/Cores limitation?
notBlocked_1().then(log);
notBlocked_2().then(log);

log('🥪 Synchronous 2'); 

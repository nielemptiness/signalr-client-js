const processEvt = (event, eventName) => {
    console.log('\ngot update for event ' + eventName + '\n');

    if (process.env.LOG_MESSAGES == 'true') {
        const log = JSON.stringify(event);
        console.debug(log);
        if (log === '[]') {
            console.warn('\nTHIS WAS THE END OF BATCH SNAPHOT');
        }
    }
};

let recievedUpdates = 0;
let recievedHeartBeats = 0;
let firstUpdate;
let previousUpdateTime;
let lastUpdateTime;
let firstHeartBeat;
let previousHeartBeatTime;
let lastHeartBeatTime;

const processHeartBeat = (event, eventName) => {
    processEvt(event, eventName);
    recievedHeartBeats++;
    previousHeartBeatTime = lastHeartBeatTime;
    lastHeartBeatTime = new Date();

    if (!firstHeartBeat)
        firstHeartBeat = new Date();
}

const processUpdate = (event, eventName) => {
    processEvt(event, eventName);
    recievedUpdates++;
    previousUpdateTime = lastUpdateTime;
    lastUpdateTime = new Date();

    if(firstUpdate === undefined) {
        firstUpdate = new Date();
    }
    
    if (process.env.SPLIT_SNAPSHOT_SIZE == '0' && recievedUpdates === 1) {
        console.warn('\nTHIS WAS SNAPSHOT');
    }
};

const onExit = () => {
    console.log('\nfirst message: ' + firstUpdate + '\n');
    console.log('total received updates: ' + recievedUpdates + '\n');
    
    if (lastUpdateTime && previousUpdateTime)
        console.log('last update: ' + lastUpdateTime + '\nprevious update ' + previousUpdateTime + '\n');

    console.log('first heartBeat: ' + firstHeartBeat + '\n');
    console.log('total received heartBeats ' + recievedHeartBeats + '\n');
    
    if (lastHeartBeatTime && previousHeartBeatTime)
        console.log('last heartbeat: ' + lastHeartBeatTime + '\nprevious heartbeat ' + previousHeartBeatTime + '\n');
}

module.exports = {
    processHeartBeat, processUpdate, onExit, processEvt
}
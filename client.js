const signalr = require('@microsoft/signalr');
const dotenv = require('dotenv');

let recievedUpdates = 0;
let recievedHeartBeats = 0;
let firstUpdate;
let previousUpdateTime;
let lastUpdateTime;
let firstHeartBeat;
let previousHeartBeatTime;
let lastHeartBeatTime;

const onExit = () => {
    console.log('\nfist message: ' + firstUpdate + '\n');
    console.log('total received updates: ' + recievedUpdates + '\n');
    
    if (lastUpdateTime && previousUpdateTime)
        console.log('last update: ' + lastUpdateTime + '\n previous update ' + previousUpdateTime + '\n');

    console.log('first heartBeat: ' + firstHeartBeat + '\n');
    console.log('total received heartBeats ' + recievedHeartBeats + '\n');
    
    if (lastHeartBeatTime && previousHeartBeatTime)
        console.log('last heartbeat: ' + lastHeartBeatTime + '\nprevious heartbeat ' + previousHeartBeatTime + '\n');
}

dotenv.config({ path: "./test.env" });
const connection = new signalr.HubConnectionBuilder()
.configureLogging(signalr.LogLevel.Trace)
.withUrl(process.env.URL + `?${process.env.HEADER_NAME}=` + process.env.HEADER_VALUE, {
    skipNegotiation: true,
    transport: signalr.HttpTransportType.WebSockets
})
.withAutomaticReconnect([0, 1, 3, 5])
.build();

connection.onclose(function (e) {
    if (e) {
        console.log('error occured: ' + e)
    }
    else {
        console.log('Disconnected');
    }
    onExit();
});

const processEvt = (event, eventName) => {
    console.log('got update for event ' + eventName);

    if (process.env.LOG_MESSAGES == 'true') {
        console.log(JSON.stringify(event));
    }
};

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

    if(!firstUpdate)
       firstUpdate = new Date();
};


connection.on("OnUpdate", (evt) => processUpdate(evt, 'OnUpdate'));		
connection.on("OnHeartbeat", (evt) => processHeartBeat(evt, 'OnHeartbeat'));

connection.start()
.then(() => console.log('connected successfully!'))
.catch(e => console.error(e));

process.on("SIGINT", () => {
    onExit();
    process.exit();
});
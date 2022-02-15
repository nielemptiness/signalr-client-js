const signalr = require('@microsoft/signalr');
const dotenv = require('dotenv');


dotenv.config({ path: "./test.env" });
const connection = new signalr.HubConnectionBuilder()
.configureLogging(signalr.LogLevel.Trace)
.withUrl(process.env.URL + `?${process.env.HEADER_NAME}=` + process.env.HEADER_VALUE, {
    skipNegotiation: true,
    transport: signalr.HttpTransportType.WebSockets
})
.build();

connection.onclose(function (e) {
    if (e) {
        console.log('error occured: ' + e)
    }
    else {
        console.log('Disconnected');
    }
});

const processEvt = (event, eventName) => {
    console.log('got update for event ' + eventName);

    if (process.env.LOG_MESSAGES == 'true') {
        console.log(JSON.stringify(event));
    }
};

connection.on("OnUpdate", (evt) => processEvt(evt, 'OnUpdate'));		
connection.on("OnHeartbeat", (evt) => processEvt(evt, 'OnHeartbeat'));

connection.start()
.then(() => console.log('connected successfully!'))
.catch(e => console.error(e));
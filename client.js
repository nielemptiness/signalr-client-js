const dotenv = require('dotenv');
const { processUpdate, processHeartBeat, onExit, processEvt } = require('./handlers')
const { update, heartBeat, MatchUnBooked } = require('./constants');
const { buildClient } = require('./signalrBuilder');

dotenv.config({ path: "./test.env" });

const builder = buildClient();
const connection = builder.build();

connection.onclose(function (e) {
    if (e) {
        console.error('\nerror occured: ' + e)
    }
    else {
        console.info('\nDisconnected');
    }
    onExit();
});
connection.on(update, (evt) => processUpdate(evt, update));		
connection.on(heartBeat, (evt) => processHeartBeat(evt, heartBeat));
connection.on(MatchUnBooked, (evt) => processEvt(evt, MatchUnBooked) )

connection.start()
           .then(() => console.info('\nconnected successfully! \n'))
           .catch(e => console.error(e));

process.on("SIGINT", () => {
    connection.stop();
    onExit();
    process.exit();
});
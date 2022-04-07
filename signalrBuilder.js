const signalr = require('@microsoft/signalr');
const msgpc = require("@microsoft/signalr-protocol-msgpack");

const connetionUrl = () => {
    var url = process.env.URL + `?${process.env.HEADER_NAME}=` + process.env.HEADER_VALUE;
    const splitSnapshot = process.env.SPLIT_SNAPSHOT_SIZE;

    if (splitSnapshot > 0)
    {
        console.debug('You are now using snapshot splitter. \n');
        url = `${url}&snapshotBatchSize=${splitSnapshot}`;
    }

    console.debug('Your connection link is: \"' + url + '\"');
    return url;
}

const buildClient = () => {
    let builder = new signalr.HubConnectionBuilder()
    .configureLogging(signalr.LogLevel.Debug)
    .withUrl(connetionUrl(), {
        skipNegotiation: true,
        transport: signalr.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect([0, 1, 3, 5]);

    if (process.env.USE_MSGPC == 'true') {
        builder = builder.withHubProtocol(new msgpc.MessagePackHubProtocol());
        console.debug('using message pack!');
    }

    return builder;
}

module.exports = { buildClient }
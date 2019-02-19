export default {
    connection: {
        iceServers: [{
            urls: "turn:portal.it-port.ru",
            username: "andrey",
            credential: "111111"
        }],
        bundlePolicy: "balanced",
        iceTransportPolicy: "all",
        rtcpMuxPolicy: "require"
    }
}
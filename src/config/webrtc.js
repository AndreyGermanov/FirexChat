/**
 * Configuration used for WebRTC video and Audio connections
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCConfiguration_dictionary
 */
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
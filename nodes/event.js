const common = require("./common");

module.exports = function (RED) {
  class EventPostNode extends common.ConnectedNode {
    constructor(config) {
      super(RED, config);
      if (this.deviceNode) {
        this.on('input', (msg, send, done) => {
          this.deviceNode.device.postEvent(this.config.event || msg.event, msg.payload, res => {
            this.log(res);
            if (res.code !== 200) {
              this.error("Error " + res.code + ": " + res.message);
            }
            done();
          });
        });
      }
    }
  }
  RED.nodes.registerType("alibabacloud-event-post", EventPostNode);
}
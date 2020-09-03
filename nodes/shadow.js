const common = require("./common");

module.exports = function (RED) {
  class ShadowSetNode extends common.ConnectedNode {
    constructor(config) {
      super(RED, config);
      if (this.deviceNode) {
        this.deviceNode.device.onShadow(res => {
          this.send({
            payload: res
          });
        });
      }
    }
  }

  RED.nodes.registerType("alibabacloud-shadow-set", ShadowSetNode);

  class ShadowPostNode extends common.ConnectedNode {
    constructor(config) {
      super(RED, config);
      if (this.deviceNode) {
        this.on('input', (msg, send, done) => {
          this.deviceNode.device.postShadow(msg.payload, res => {
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

  RED.nodes.registerType("alibabacloud-shadow-post", ShadowPostNode);
}

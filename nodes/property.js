const common = require("./common");

module.exports = function (RED) {
  class PropertySetNode extends common.ConnectedNode {
    constructor(config) {
      super(RED, config);
      if (this.deviceNode) {
        this.deviceNode.device.onProps(res => {
          this.send({
            payload: res
          });
        });
      }
    }
  }
  RED.nodes.registerType("alibabacloud-property-set", PropertySetNode);
  class PropertyPostNode extends common.ConnectedNode {
    constructor(config) {
      super(RED, config);
      if (this.deviceNode) {
        this.on('input', (msg, send, done) => {
          this.deviceNode.device.postProps(msg.payload, res => {
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
  RED.nodes.registerType("alibabacloud-property-post", PropertyPostNode);
}
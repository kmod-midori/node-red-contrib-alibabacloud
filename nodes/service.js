const common = require("./common");

module.exports = function (RED) {
  class ServiceNode extends common.ConnectedNode {
    constructor(config) {
      super(RED, config)

      this.serviceName = this.config.service;
      this.cleanTimer = null;

      if (this.deviceNode) {
        this.log("Registering service: " + this.serviceName);
        this.deviceNode.device.onService(this.serviceName, (res, reply) => {
          if (this.cleanTimer !== null) {
            clearTimeout(this.cleanTimer);
            this.cleanTimer = null;
          }
          this.log("Get request: " + JSON.stringify(res));
          this.send({
            payload: res,
            _reply: reply,
          });
          this.status({
            fill: "green",
            shape: "ring",
            text: "Triggered",
          });

          this.cleanTimer = setTimeout(() => {
            this.setConnected();
          }, 3000);
        });
      }
    }
  }
  RED.nodes.registerType("alibabacloud-service", ServiceNode);

  class ServiceReplyNode extends common.RedNode {
    constructor(config) {
      super(RED, config);

      this.on("input", function (msg, send, done) {
        if (msg._reply) {
          let reply = {
            code: msg.code || 200,
            data: msg.payload
          };
          this.log("Send reply: " + JSON.stringify(reply));
          msg._reply(reply, 'async');
        }
        done();
      });
    }
  }
  RED.nodes.registerType("alibabacloud-service-reply", ServiceReplyNode);
};

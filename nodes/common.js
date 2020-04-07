class RedNode {
  constructor(RED, config) {
    RED.nodes.createNode(this, config);
    this.config = config;
  }
}

class ConnectedNode extends RedNode {
  constructor(RED, config) {
    super(RED, config);
    this.deviceNode = RED.nodes.getNode(this.config.device);
    this.setNotConnected();
    if (this.deviceNode) {
      this.connectListener = () => {
        this.setConnected();
      };
      this.deviceNode.on("connect", this.connectListener);
      this.closeListener = () => {
        this.setNotConnected();
      };
      this.deviceNode.on("close", this.closeListener);
      this.deviceNode.on("offline", this.closeListener);

      if (this.deviceNode.connected) {
        this.setConnected();
      }
    } else {
      this.status({
        fill: "red",
        shape: "dot",
        text: "node-red-contrib-alibabacloud/service:label.no_device",
      });
    }

    this.on("close", () => this.onClose());
  }

  setConnected() {
    this.status({
      fill: "green",
      shape: "dot",
      text: "node-red:common.status.connected",
    });
  }

  setNotConnected() {
    this.status({
      fill: "red",
      shape: "dot",
      text: "node-red:common.status.not-connected",
    });
  }

  onClose() {
    if (this.deviceNode) {
      if (this.connectListener) {
        this.deviceNode.removeListener("connect", this.connectListener);
      }
      if (this.closeListener) {
        this.deviceNode.removeListener("close", this.closeListener);
        this.deviceNode.removeListener("offline", this.closeListener);
      }
      this.setNotConnected();
    }
  }
}

exports.RedNode = RedNode;
exports.ConnectedNode = ConnectedNode;

const iot = require("alibabacloud-iot-device-sdk");

module.exports = function (RED) {
  class DeviceNode {
    constructor(config) {
      RED.nodes.createNode(this, config);
      this.config = config;
      this.connected = false;

      const options = {
        productKey: this.credentials.product_key || "",
        deviceName: config.device_name || "",
        deviceSecret: this.credentials.device_secret || "",
        region: config.region || "cn-shanghai",
      };
      this.log("Connecting with: " + options.toString());
      const device = iot.device(options);
      device.on("connect", () => this.onConnect());
      device.on("error", (err) => this.onError(err));
      device.on("reconnect", () => this.log("Device reconnect"));
      device.on("close", () => {
        this.connected = false;
        this.log("Device closed");
        this.emit("close");
      });
      device.on("offline", () => {
        this.connected = false;
        this.log("Device offline");
        this.emit("offline");
      });
      this.device = device;

      this.on("close", () => {
        this.connected = false;
        this.emit("close");
        this.device.end();
        this.log("Node/Device closed");
      });
    }

    onConnect() {
      this.connected = true;
      this.log("Device connected");
      this.emit("connect");
    }

    onError(err) {
      RED.log.error("Alibabacloud error: " + err);
      this.connected = false;
      this.emit("error", err);
      this.device.end(true);
    }
  }

  RED.nodes.registerType("alibabacloud-device", DeviceNode, {
    credentials: {
      product_key: { type: "text" },
      device_secret: { type: "text" },
    },
  });
};

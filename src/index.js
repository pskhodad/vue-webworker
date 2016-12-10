class PortCaller {
  constructor(port) {
    this.port = port;

    // worker jobs awaiting response {callId: [resolve, reject]}
    this._pendingRequests = {};

    port.addEventListener('message', event => {
      const {portCallerResponseId, value, error} = event.data;

      if (!portCallerResponseId) return;

      const [resolve, reject] = this._pendingRequests[portCallerResponseId];
      delete this._pendingRequests[portCallerResponseId];

      if (error) {
        reject(new Error(error));
        return;
      }

      resolve(value);
    });

    if (port.start) port.start();
  }
  send(method, ...args) {
    this.port.postMessage({
      method,
      args
    });
  }
  call(method, ...args) {
    return new Promise((resolve, reject) => {
      const portCallerMessageId = Math.random();
      this._pendingRequests[portCallerMessageId] = [resolve, reject];

      this.port.postMessage({
        method,
        args,
        portCallerMessageId
      });
    });
  }
}

export default {
    install(Vue, opts) {
        var ww = new Worker("worker.js");
        Vue.prototype.$WebWorker = new PortCaller(ww);
    }
}
/**
 * vuex v0.0.1
 * (c) 2016 Prashant S Khodade
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueWebWorker = factory());
}(this, (function () { 'use strict';

var PortCaller = function PortCaller(port) {
  var this$1 = this;

  this.port = port;

  // worker jobs awaiting response {callId: [resolve, reject]}
  this._pendingRequests = {};

  port.addEventListener('message', function (event) {
    var ref = event.data;
    var portCallerResponseId = ref.portCallerResponseId;
    var value = ref.value;
    var error = ref.error;

    if (!portCallerResponseId) { return; }

    var ref$1 = this$1._pendingRequests[portCallerResponseId];
    var resolve = ref$1[0];
    var reject = ref$1[1];
    delete this$1._pendingRequests[portCallerResponseId];

    if (error) {
      reject(new Error(error));
      return;
    }

    resolve(value);
  });

  if (port.start) { port.start(); }
};
PortCaller.prototype.send = function send (method) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  this.port.postMessage({
    method: method,
    args: args
  });
};
PortCaller.prototype.call = function call (method) {
    var this$1 = this;
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  return new Promise(function (resolve, reject) {
    var portCallerMessageId = Math.random();
    this$1._pendingRequests[portCallerMessageId] = [resolve, reject];

    this$1.port.postMessage({
      method: method,
      args: args,
      portCallerMessageId: portCallerMessageId
    });
  });
};

var index = {
    install: function install(Vue, opts) {
        var ww = new Worker("worker.js");
        Vue.prototype.$WebWorker = new PortCaller(ww);
    }
};

return index;

})));

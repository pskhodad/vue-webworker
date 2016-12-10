function portListener(port, methods) {
  port.addEventListener('message', event => {
    const {portCallerMessageId, method, args} = event.data;

    if (!method) return;

    // just a "send"
    if (!portCallerMessageId) {
      methods[method](...args);
      return;
    }

    const source = event.source || port;

    // It wants a response too
    new Promise(resolve => resolve(methods[method](...args))).then(value => {
      source.postMessage({
        portCallerResponseId: portCallerMessageId,
        value
      });
    }, err => {
      source.postMessage({
        portCallerResponseId: portCallerMessageId,
        error: err.message
      });
    });
  });

  if (port.start) port.start();
}

portListener(self, {
  slowRandomNumber() {
    return new Promise(r => setTimeout(r, 3000))
      .then(() => Math.random());
  }
})
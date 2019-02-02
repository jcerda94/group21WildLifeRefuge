const _handlers = {};

const Subject = {
  subscribe () {
    const [event, handler] = arguments;

    if (!_handlers[event]) _handlers[event] = [];
    _handlers[event].push(handler);
  },
  unsubscribe () {
    const [event, handler] = arguments;

    if (!_handlers[event]) return;
    _handlers[event] = _handlers[event].filter(func => func !== handler);
  },
  next () {
    const [event, value] = arguments;

    if (!_handlers[event]) return;
    _handlers[event].forEach(handler => {
      if (typeof handler === "function") {
        handler(value);
      }
    });
  }
};

Object.freeze(Subject);

export default Subject;

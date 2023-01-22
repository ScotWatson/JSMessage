/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Types from "https://scotwatson.github.io/Debug/Test/Types.mjs";
import * as ErrorLog from "https://scotwatson.github.io/Debug/Test/ErrorLog.mjs";
import * as Tasks from "https://scotwatson.github.io/Tasks/Test/Tasks.mjs";

export class openChannel() {
}

export class Thread {
  #worker; // could be Worker, SharedWorker, or ServiceWorker
  constructor() {
    this.#worker = new self.Worker();
    this.#type
    this.#credentials
    this.#name
  }
  async openChannel(args) {
    return {
      type: "openChannel",
      name: args.name,
    };
  }
}

export function createEvtListenerWindowForWorker(worker) {
  return function evtListenerWindowForWorker(evt) {
    try {
      if (!(Types.isSimpleObject(evt.data))) {
        throw "data must be a simple object.";
      }
      switch (evt.data.type) {
        case "openChannel":
          evt.data.name;
          evt.data.port;
          break;
        case "closeChannel":
          evt.data.name;
          break;
        case "badCommand":
          throw "Bad Command: " + evt.data.message;
          break;
        default:
          worker.postMessage({
            type: "badCommand",
            message: "Unrecognized Command Type",
          });
      };
    } catch (e) {
    }
  }
}


class MessageChannelNode {
  #callback;
  #port;
  #staticListener;
  constructor(args) {
    this.#port = args.port;
    this.#staticListener = Tasks.createStatic({
      function: this.#listener,
      this: this,
    });
    this.#port.addEventListener(this.#staticListener);
    this.#port.start();
    this.#signalClosed = args.signalClosed;
  }
  connectOutput(args) {
    this.#callback = args.callback;
  }
  get inputCallback(args) {
    return new Tasks.Callback({
      invoke: function () {
        self.postMessage(args.obj);
      },
    });
  }
  closeOutput() {
    this.#port.close();
  }
  get signalClosed() {
    return this.#signalClosed;
  }
  #listener(evt) {
    this.#callback.invoke(evt.data);
  }
}


// WindowMessaging.mjs

class ChannelManager {
  constructor() {
  }
  openChannel() {
    const channel = new MessageChannel();
    self.postMessage({
      type: "openChannel",
      port: channel.port2,
    }, origin, [ channel.port2 ]);
  }
  allowChannel() {
  }
}

self.addEventListener("message", function (evt) {
  try {
    const origin = evt.origin;
    if (!(Types.isSimpleObject(evt.data))) {
      throw "data must be a simple object.";
    }
    switch (evt.data.type) {
      case "badCommand": {
        throw evt.data.message;
      }
      case "openChannel": {
        const name = evt.data.name;
        const port = evt.data.port;
        ports.set(name, port);
        break;
      }
      case "ping": {
        const channel = evt.data.channel;
        self.postMessage({
          type: "echo",
        });
        break;
      }
      case "echo": {
        stillAlive(origin);
        break;
      }
      default: {
        self.postMessage({
          type: "badCommand",
          message: "Unrecognized Command Type",
        });
      }
    };
  } catch (e) {
  }
});

self.addEventListener("messageerror", function (evt) {
});


// WorkerMessaging.mjs

const ports = new Map();

function allowChannel(channelName) {
}
function createChannel(channelName) {
}

self.addEventListener("message", function (evt) {
  if (!(Types.isSimpleObject(evt.data))) {
    throw "data must be a simple object.";
  }
  switch (evt.data.type) {
    case "openChannel":
      evt.data.name
      break;
    case "transferPort":
      evt.data.name
      evt.data.port
      break;
    case "requestChannel":
      break;
    case "badCommand":
      throw evt.data.message;
    default:
      self.postMessage({
        type: "badCommand",
        message: "Unrecognized Command Type",
      });
  };
});

self.addEventListener("messageerror", function (evt) {
});

// SharedWorkerMessaging.mjs

// ServiceWorkerMessaging.mjs

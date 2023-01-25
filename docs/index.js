/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

const initPageTime = performance.now();

const asyncWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

const asyncErrorLog = (async function () {
  try {
    const module = await import("https://scotwatson.github.io/Debug/Test/ErrorLog.mjs");
    return module;
  } catch (e) {
    console.error(e);
  }
})();

(async function () {
  try {
    const modules = await Promise.all( [ asyncWindow, asyncErrorLog ] );
    await start(modules);
  } catch (e) {
    console.error(e);
  }
})();

const childWindows = new Set();
const parentWindows = new Set();
const logs = new Set();

async function start( [ evtWindow, ErrorLog ] ) {
  try {
    // Log functions
    function createLog() {
      const divLog = document.createElement("div");
      divLog.style.display = "block";
      divLog.style.position = "absolute";
      divLog.style.left = "50%";
      divLog.style.top = "50%";
      divLog.style.width = "50%";
      divLog.style.height = "50%";
      divLog.style.overflow = "scroll";
      document.body.appendChild(divLog);
      logs.add(divLog);
      return divLog;
    }
    function addEntry(divLog, message) {
      const pEntry = document.createElement("p");
      pEntry.appendChild(document.createTextNode((new Date()).toString() + " " + message));
      divLog.appendChild(pEntry);
    }
    function showLog(divLog) {
      for (const log of logs) {
        log.style.display = "none";
      }
      divLog.style.display = "block";
    }
    function deleteLog(divLog) {
      divLog.remove();
    }
    // Layout
    document.body.style.width = "100%";
    document.body.style.height = window.innerHeight + "px";
    const btnCreateWorker = document.createElement("button");
    btnCreateWorker.alt = "Create Worker";
    btnCreateWorker.style.position = "absolute";
    btnCreateWorker.style.left = "0px";
    btnCreateWorker.style.top = "0px";
    btnCreateWorker.style.width = "50%";
    btnCreateWorker.style.height = "10%";
    const imgCreateWorker = document.createElement("img");
    imgCreateWorker.src = "CreateWorker.bmp";
    imgCreateWorker.style.width = "50px";
    imgCreateWorker.style.height = "50px";
    btnCreateWorker.appendChild(imgCreateWorker);
    document.body.appendChild(btnCreateWorker);
    const divWorkers = document.createElement("div");
    divWorkers.style.position = "absolute";
    divWorkers.style.left = "0px";
    divWorkers.style.top = "10%";
    divWorkers.style.width = "50%";
    divWorkers.style.height = "40%";
    divWorkers.style.overflow = "scroll";
    document.body.appendChild(divWorkers);
    const btnCreateChildWindow = document.createElement("button");
    btnCreateChildWindow.alt = "Create Child Window";
    btnCreateChildWindow.style.position = "absolute";
    btnCreateChildWindow.style.left = "0px";
    btnCreateChildWindow.style.top = "50%";
    btnCreateChildWindow.style.width = "50%";
    btnCreateChildWindow.style.height = "10%";
    const imgCreateChildWindow = document.createElement("img");
    imgCreateChildWindow.src = "CreateChildWindow.bmp";
    imgCreateChildWindow.style.width = "50px";
    imgCreateChildWindow.style.height = "50px";
    btnCreateChildWindow.appendChild(imgCreateChildWindow);
    document.body.appendChild(btnCreateChildWindow);
    const divChildWindows = document.createElement("div");
    divChildWindows.style.position = "absolute";
    divChildWindows.style.left = "0px";
    divChildWindows.style.top = "60%";
    divChildWindows.style.width = "50%";
    divChildWindows.style.height = "40%";
    divChildWindows.style.overflow = "scroll";
    document.body.appendChild(divChildWindows);
    const divParentWindows = document.createElement("div");
    divParentWindows.style.position = "absolute";
    divParentWindows.style.left = "50%";
    divParentWindows.style.top = "0px";
    divParentWindows.style.width = "50%";
    divParentWindows.style.height = "50%";
    divParentWindows.style.overflow = "scroll";
    document.body.appendChild(divParentWindows);
    // Click Listeners
    btnCreateWorker.addEventListener("click", function () {
      const thisWorkerLog = createLog();
      const divWorker = document.createElement("div");
      divWorkers.appendChild(divWorker);
      const thisWorker = new Worker("worker.js");
      thisWorker.addEventListener("message", thisWorkerMessageHandler);
      thisWorker.addEventListener("messageerror", thisWorkerMessageErrorHandler);
      const thisWorkerChannels = new Map();
      function createChannel(name) {
        const thisChannel = new self.MessageChannel();
        thisWorkerChannels.set(name, thisChannel);
        thisWorker.postMessage({
          type: "open",
          name: name,
          port: thisChannel.port2,
        }, [ thisChannel.port2 ]);
        thisChannel.port1.start();
        return thisChannel.port1;
      }
      divWorker.appendChild(document.createTextNode("Worker"));
      const btnViewWorkerLog = document.createElement("button");
      btnViewWorkerLog.alt = "View Worker Log";
      const imgViewWorkerLog = document.createElement("img");
      imgViewWorkerLog.src = "ViewLog.bmp";
      imgViewWorkerLog.style.width = "50px";
      imgViewWorkerLog.style.height = "50px";
      btnViewWorkerLog.appendChild(imgViewWorkerLog);
      divWorker.appendChild(btnViewWorkerLog);
      btnViewWorkerLog.addEventListener("click", function () {
        showLog(thisWorkerLog);
      });
      const btnCreateChannel = document.createElement("button");
      btnCreateChannel.alt = "Create Channel";
      const imgCreateChannel = document.createElement("img");
      imgCreateChannel.src = "";
      imgCreateChannel.style.width = "50px";
      imgCreateChannel.style.height = "50px";
      btnCreateChannel.appendChild(imgCreateChannel);
      divWorker.appendChild(btnCreateChannel);
      const divChannels = document.createElement("div");
      divWorker.appendChild(divChannels);
      btnCreateChannel.addEventListener("click", function () {
        const thisChannelLog = createLog();
        const divChannel = document.createElement("div");
        divChannels.appendChild(divChannel);
        const channelName = self.prompt("Enter the new channel name:");
        addEntry(thisWorkerLog, "Create channel: " + channelName);
        const port = createChannel(channelName);
        divChannel.appendChild(document.createTextNode(channelName));
        const btnViewChannelLog = document.createElement("button");
        btnViewChannelLog.alt = "View Worker Channel Log";
        const imgViewChannelLog = document.createElement("img");
        imgViewChannelLog.src = "ViewLog.bmp";
        imgViewChannelLog.style.width = "50px";
        imgViewChannelLog.style.height = "50px";
        btnViewChannelLog.appendChild(imgViewChannelLog);
        divChannel.appendChild(btnViewChannelLog);
        btnViewChannelLog.addEventListener("click", function () {
          showLog(thisChannelLog);
        });
        const btnSendToWorker = document.createElement("button");
        btnSendToWorker.alt = "Send to Worker";
        const imgSendToWorker = document.createElement("img");
        imgSendToWorker.src = "Send.bmp";
        imgSendToWorker.style.width = "50px";
        imgSendToWorker.style.height = "50px";
        btnSendToWorker.appendChild(imgSendToWorker);
        divChannel.appendChild(btnSendToWorker);
        const btnCloseWorkerPort = document.createElement("button");
        btnCloseWorkerPort.alt = "Close Worker Port";
        const imgCloseWorkerPort = document.createElement("img");
        imgCloseWorkerPort.src = "CloseWorkerChannel.bmp";
        imgCloseWorkerPort.style.width = "50px";
        imgCloseWorkerPort.style.height = "50px";
        btnCloseWorkerPort.appendChild(imgCloseWorkerPort);
        divChannel.appendChild(btnCloseWorkerPort);
        btnSendToWorker.addEventListener("click", function () {
          port.postMessage("From Window to Worker");
          addEntry(thisChannelLog, "Send: From Window to Worker");
        });
        btnCloseWorkerPort.addEventListener("click", function () {
          addEntry(thisWorkerLog, "Close channel: " + channelName);
          port.close();
          thisWorker.postMessage({
            type: "close",
            name: channelName,
          });
          divChannel.remove();
        });
      });
      function thisWorkerMessageHandler(evt) {
        if (!("type" in evt.data)) {
          thisWorker.postMessage({
            type: "error",
            message: "type must be provided",
            data: evt.data,
          });
        }
        switch (evt.data.type) {
          case "echo": {
            // This is the standard response to ping. It is also sent when the worker is ready to processes messages.
            addEntry(thisWorkerLog, "Echo received");
            break;
          }
          case "error": {
            // Process error
            addEntry(thisWorkerLog, "Error received");
            break;
          }
          default: {
            thisWorker.postMessage({
              type: "error",
              message: "Unknown Type: " + evt.data.type,
            });
            break;
          }
        }
      }
      function thisWorkerMessageErrorHandler(evt) {
        console.error(evt);
      }
      function newWorkerMessageHandler(evt) {
        console.log(evt);
      }
      function newWorkerMessageErrorHandler(evt) {
        console.error(evt);
      }
    });

    // Main Message Listeners
    self.addEventListener("message", mainMessageHandler);
    self.addEventListener("messageerror", mainMessageErrorHandler);

    const otherOrigin = "https://scotwatson.github.io";
    const childWindows = new Set();

    btnCreateChildWindow.addEventListener("click", function (evt) {
      const childWindowLog = createLog();
      const divChildWindow = document.createElement("div");
      divChildWindows.appendChild(divChildWindow);
      const childWindow = self.window.open(otherOrigin + "/JSMessage/index.html");
      self.addEventListener("message", mainChildWindowMessageHandler);
      self.addEventListener("messageerror", mainChildWindowMessageErrorHandler);
      childWindow.addEventListener("message", childWindowMessageHandler);
      childWindow.addEventListener("messageerror", childWindowMessageErrorHandler);
      const intervalHandle = self.setInterval(function () {
        childWindow.postMessage({
          type: "ping",
        }, otherOrigin);
      }, 500);
      const btnViewWindowLog = document.createElement("button");
      btnViewWindowLog.alt = "View Child Window Log";
      const imgViewWindowLog = document.createElement("img");
      imgViewWindowLog.src = "ViewLog.bmp";
      imgViewWindowLog.style.width = "50px";
      imgViewWindowLog.style.height = "50px";
      btnViewWindowLog.appendChild(imgViewWindowLog);
      divChildWindow.appendChild(btnViewWindowLog);
      btnViewWindowLog.addEventListener("click", function () {
        showLog(childWindowLog);
      });
      const btnCreateChannel = document.createElement("button");
      btnCreateChannel.alt = "Create Channel";
      const imgCreateChannel = document.createElement("img");
      imgCreateChannel.src = "CreateWindowChannel.bmp";
      imgCreateChannel.style.width = "50px";
      imgCreateChannel.style.height = "50px";
      btnCreateChannel.appendChild(imgCreateChannel);
      divChildWindow.appendChild(btnCreateChannel);
      const divChannels = document.createElement("div");
      divChildWindow.appendChild(divChannels);
      const thisWindowChannels = new Map();
      
      btnCreateChannel.addEventListener("click", function () {
        const childWindowChannelLog = createLog();
        const divChannel = document.creatreElement("div");
        divChannels.appendChild(divChannel);
        const newWindowChannel = new self.MessageChannel();
        const obj = {
          cmd: "port",
          port: newWindowChannel.port2,
        };
        childWindow.postMessage(obj, otherOrigin, [ newWindowChannel.port2 ] );
        const port = newWindowChannel.port1;
        port.start();
        addEntry(childWindowLog, "port sent to child window");
        // Layout
        const btnViewChannelLog = document.createElement("button");
        btnViewChannelLog.alt = "View Child Window Log";
        const imgViewChannelLog = document.createElement("img");
        imgViewChannelLog.src = "ViewLog.bmp";
        imgViewChannelLog.style.width = "50px";
        imgViewChannelLog.style.height = "50px";
        btnViewChannelLog.appendChild(imgViewChannelLog);
        divChannel.appendChild(btnViewChannelLog);
        btnViewWindowLog.addEventListener("click", function () {
          showLog(childWindowChannelLog);
        });
        const btnSendToChildWindow = document.createElement("button");
        btnSendToChildWindow.alt = "Send to Child Window";
        const imgSendToChildWindow = document.createElement("img");
        imgSendToChildWindow.src = "Send.bmp";
        imgSendToChildWindow.style.width = "50px";
        imgSendToChildWindow.style.height = "50px";
        btnSendToChildWindow.appendChild(imgSendToChildWindow);
        divChannel.appendChild(btnSendToChildWindow);
        const btnClosePortToChildWindow = document.createElement("button");
        btnClosePortToChildWindow.alt = "Close Port To Child Window";
        const imgClosePortToChildWindow = document.createElement("img");
        imgClosePortToChildWindow.src = "";
        imgClosePortToChildWindow.style.width = "50px";
        imgClosePortToChildWindow.style.height = "50px";
        btnClosePortToChildWindow.appendChild(imgClosePortToChildWindow);
        divChannel.appendChild(btnClosePortToChildWindow);
        // Click Listeners
        btnSendToChildWindow.addEventListener("click", function () {
          port.postMessage("test from parent");
          addEntry(childWindowChannelLog, "SendToChildWindow");
        });
        btnClosePortToChildWindow.addEventListener("click", function () {
          port.close();
          addEntry(childWindowLog, "ClosePortToChildWindow");
        });
      });
      // In parent, sees parent sent messages
      // Does not exist in child
      function childWindowMessageHandler(evt) {
        const logObj = {
          data: evt.data,
          source: (function () {
            switch (evt.source) {
              case self.window: {
                return "This Window";
              }
              case childWindow: {
                return "Child Window";
              }
              default: {
                return "Other Window";
              }
            };
          })(),
          origin: (function () {
            if (!("origin" in evt)) {
              return "does not exist";
            }
            if (evt.origin === undefined) {
              return "undefined";
            } else {
              return evt.origin;
            }
          })(),
        };
        addEntry(childWindowLog, "[Eve] Type: " + logObj.data.type + " Source: " + logObj.source + " Origin: " + logObj.origin);
      }
      function childWindowMessageErrorHandler(evt) {
        addEntry(childWindowLog, "[Eve] Error: " + evt);
      }
      function mainChildWindowMessageHandler(evt) {
        if (evt.source !== childWindow) {
          return;
        }
        const thisOrigin = evt.origin;
        if (thisOrigin !== otherOrigin) {
          throw "Bad Origin: " + thisOrigin;
        }
        switch (evt.data.type) {
          case "echo": {
            self.clearInterval(intervalHandle);
            break;
          }
          default: {
            break;
          }
        };
      }
      function mainChildWindowMessageErrorHandler(evt) {
        if (evt.source !== childWindow) {
          return;
        }
        console.error(evt);
      }
    });
    function registerParent(window) {
      const parentWindowLog = createLog();
      const divParentWindow = document.createElement("div");
      divParentWindows.appendChild(divParentWindow);
      const divChannels = document.createElement("div");
      divParentWindow.appendChild(divChannels);
      self.addEventListener("message", mainParentWindowMessageHandler);
      self.addEventListener("messageerror", mainParentWindowMessageErrorHandler);
      function mainParentWindowMessageHandler(evt) {
        switch (evt.data.type) {
          case "port": {
            const divChannel = document.createElement("div");
            divChannels.appendChild(divChannel);
            const channelName = evt.data.name;
            const port = evt.data.port;
            port.addEventListener("message", parentWindowMessageHandler);
            port.addEventListener("messageerror", parentWindowMessageErrorHandler);
            port.start();
            function parentWindowMessageHandler(evt) {
              addEntry(parentWindowLog, "Data: " + evt.data);
            }
            function parentWindowMessageErrorHandler(evt) {
              addEntry(parentWindowLog, "Error: " + evt);
            }
            // Layout
            const btnViewWindowLog = document.createElement("button");
            btnViewWindowLog.alt = "View Parent Window Log";
            const imgViewWindowLog = document.createElement("img");
            imgViewWindowLog.src = "ViewLog.bmp";
            imgViewWindowLog.style.width = "50px";
            imgViewWindowLog.style.height = "50px";
            btnViewWindowLog.appendChild(imgViewWindowLog);
            divParentWindow.appendChild(btnViewWindowLog);
            btnViewWindowLog.addEventListener("click", function () {
              showLog(parentWindowLog);
            });
            const btnSendToParentWindow = document.createElement("button");
            btnSendToParentWindow.alt = "Send to Parent Window";
            const imgSendToParentWindow = document.createElement("img");
            imgSendToParentWindow.src = "";
            imgSendToParentWindow.style.width = "50px";
            imgSendToParentWindow.style.height = "50px";
            btnSendToParentWindow.appendChild(imgSendToParentWindow);
            divChannel.appendChild(btnSendToParentWindow);
            const btnClosePortToParentWindow = document.createElement("button");
            btnClosePortToParentWindow.alt = "Close Port To Parent Window";
            const imgClosePortToParentWindow = document.createElement("img");
            imgClosePortToParentWindow.src = "";
            imgClosePortToParentWindow.style.width = "50px";
            imgClosePortToParentWindow.style.height = "50px";
            btnClosePortToParentWindow.appendChild(imgClosePortToParentWindow);
            divChannel.appendChild(btnClosePortToParentWindow);
            // Click Listener
            btnSendToParentWindow.addEventListener("click", function () {
              port.postMessage("test from child");
              addEntry(parentWindowLog, "SendToParentWindow");
            });
            btnClosePortToParentWindow.addEventListener("click", function () {
              port.close();
              addEntry(parentWindowLog, "ClosePortToParentWindow");
            });
            break;
          }
          case "error": {
            // Process Error
            break;
          }
          default: {
            break;
          }
        };
      }
      function mainParentWindowMessageErrorHandler(evt) {
        console.error(evt);
      }
    }

    // In parent, sees child sent messages
    // In child, sees parent sent messages
    function mainMessageHandler(evt) {
      const fromOrigin = evt.origin;
      const fromWindow = evt.source;
      if (fromOrigin !== otherOrigin) {
        throw "Bad Origin: " + fromOrigin;
      }
      if (fromWindow === self.window) {
        console.log("I see myself!");
        return;
      }
      if (parentWindows.has(fromWindow) || childWindows.has(fromWindow)) {
        // Parent and Child windows are handled by other listeners
        return;
      }
      // Unknown Window
      if (evt.data.type === "ping") {
        registerParent(fromWindow);
        fromWindow.postMessage({
          type: "echo",
        }, fromOrigin);
      } else {
        fromWindow.postMessage({
          type: "error",
          message: "ping must be sent to begin communication",
        }, fromOrigin);
      }
    }
    function mainMessageErrorHandler(evt) {
      console.error(evt);
    }
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "start",
      error: e,
    });
  }
}

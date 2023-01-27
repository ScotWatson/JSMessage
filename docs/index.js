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
      divLog.style.display = "none";
      divLog.style.position = "absolute";
      divLog.style.left = "50%";
      divLog.style.top = "50%";
      divLog.style.width = "50%";
      divLog.style.height = "50%";
      divLog.style.overflow = "hidden scroll";
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
    if (self.window.name === "") {
      self.window.name = self.prompt("Enter the name for this window:");
    }
    // Layout
    document.body.style.width = "100%";
    document.body.style.height = window.innerHeight + "px";
    document.body.style.margin = "0px";
    const divWorkersHeader = document.createElement("div");
    divWorkersHeader.style.position = "absolute";
    divWorkersHeader.style.left = "0%";
    divWorkersHeader.style.top = "0%";
    divWorkersHeader.style.width = "50%";
    divWorkersHeader.style.height = "10%";
    divWorkersHeader.style.overflow = "hidden";
    document.body.appendChild(divWorkersHeader);
    const imgWorker = document.createElement("img");
    imgWorker.src = "Worker.bmp";
    imgWorker.style.aspectRatio = "1";
    imgWorker.style.display = "inline-block";
    imgWorker.style.maxWidth = "10%";
    imgWorker.style.maxHeight = "100%";
    divWorkersHeader.appendChild(imgWorker);
    const inpNewWorkerURL = document.createElement("input");
    inpNewWorkerURL.type = "text";
    inpNewWorkerURL.value = "worker.js";
    inpNewWorkerURL.style.display = "inline-block";
    inpNewWorkerURL.style.verticalAlign = "bottom";
    inpNewWorkerURL.style.width = "75%";
    inpNewWorkerURL.style.height = "100%";
    divWorkersHeader.appendChild(inpNewWorkerURL);
    const btnCreateWorker = document.createElement("button");
    btnCreateWorker.alt = "Create Worker";
    btnCreateWorker.style.display = "inline-block";
    btnCreateWorker.style.width = "10%";
    btnCreateWorker.style.height = "100%";
    const imgCreateWorker = document.createElement("img");
    imgCreateWorker.src = "Create.bmp";
    imgCreateWorker.style.aspectRatio = "1";
    imgCreateWorker.style.maxWidth = "100%";
    imgCreateWorker.style.maxHeight = "100%";
    btnCreateWorker.appendChild(imgCreateWorker);
    divWorkersHeader.appendChild(btnCreateWorker);
    const divWorkers = document.createElement("div");
    divWorkers.style.position = "absolute";
    divWorkers.style.left = "0%";
    divWorkers.style.top = "10%";
    divWorkers.style.width = "50%";
    divWorkers.style.height = "40%";
    divWorkers.style.overflow = "hidden scroll";
    document.body.appendChild(divWorkers);
    const divChildWindowsHeader = document.createElement("div");
    divChildWindowsHeader.style.position = "absolute";
    divChildWindowsHeader.style.left = "0%";
    divChildWindowsHeader.style.top = "50%";
    divChildWindowsHeader.style.width = "50%";
    divChildWindowsHeader.style.height = "10%";
    divChildWindowsHeader.style.overflow = "hidden";
    document.body.appendChild(divChildWindowsHeader);
    const imgChildWindow = document.createElement("img");
    imgChildWindow.src = "ChildWindow.bmp";
    imgChildWindow.style.aspectRatio = "1";
    imgChildWindow.style.display = "inline-block";
    imgChildWindow.style.maxWidth = "10%";
    imgChildWindow.style.maxHeight = "100%";
    divChildWindowsHeader.appendChild(imgChildWindow);
    const inpNewChildWindowURL = document.createElement("input");
    inpNewChildWindowURL.type = "text";
    inpNewChildWindowURL.value = "https://scotwatson.github.io/JSMessage/index.html";
    inpNewChildWindowURL.style.display = "inline-block";
    inpNewChildWindowURL.style.verticalAlign = "bottom";
    inpNewChildWindowURL.style.width = "75%";
    inpNewChildWindowURL.style.height = "100%";
    divChildWindowsHeader.appendChild(inpNewChildWindowURL);
    const btnCreateChildWindow = document.createElement("button");
    btnCreateChildWindow.alt = "Create Child Window";
    btnCreateChildWindow.style.display = "inline-block";
    btnCreateChildWindow.style.width = "10%";
    btnCreateChildWindow.style.height = "100%";
    const imgCreateChildWindow = document.createElement("img");
    imgCreateChildWindow.src = "Create.bmp";
    imgCreateChildWindow.style.aspectRatio = "1";
    imgCreateChildWindow.style.display = "inline-block";
    imgCreateChildWindow.style.maxWidth = "100%";
    imgCreateChildWindow.style.maxHeight = "100%";
    btnCreateChildWindow.appendChild(imgCreateChildWindow);
    divChildWindowsHeader.appendChild(btnCreateChildWindow);
    const divChildWindows = document.createElement("div");
    divChildWindows.style.position = "absolute";
    divChildWindows.style.left = "0px";
    divChildWindows.style.top = "60%";
    divChildWindows.style.width = "50%";
    divChildWindows.style.height = "40%";
    divChildWindows.style.overflow = "hidden scroll";
    document.body.appendChild(divChildWindows);
    const divParentWindows = document.createElement("div");
    divParentWindows.style.position = "absolute";
    divParentWindows.style.left = "50%";
    divParentWindows.style.top = "0px";
    divParentWindows.style.width = "50%";
    divParentWindows.style.height = "50%";
    divParentWindows.style.overflow = "hidden scroll";
    document.body.appendChild(divParentWindows);
    // Click Listeners
    btnCreateWorker.addEventListener("click", function () {
      const thisWorkerLog = createLog();
      const workerName = self.prompt("Enter the new worker name:");
      const thisWorker = new self.Worker(inpNewWorkerURL.value, {
        name: workerName,
      });
      thisWorker.addEventListener("message", thisWorkerMessageHandler);
      thisWorker.addEventListener("messageerror", thisWorkerMessageErrorHandler);
      // Layout
      const divWorker = document.createElement("div");
      divWorker.style.width = "100%";
      divWorkers.appendChild(divWorker);
      const divWorkerHeader = document.createElement("div");
      divWorkerHeader.style.width = "100%";
      divWorker.appendChild(divWorkerHeader);
      const imgWorker = document.createElement("img");
      imgWorker.src = "Worker.bmp";
      imgWorker.style.display = "inline-block";
      imgWorker.style.aspectRatio = "1";
      imgWorker.style.width = "10%";
      divWorkerHeader.appendChild(imgWorker);
      const divWorkerName = document.createElement("div");
      divWorkerName.appendChild(document.createTextNode(workerName));
      divWorkerName.style.display = "inline-block";
      divWorkerName.style.width = "50%";
      divWorkerName.style.height = "100%";
      divWorkerHeader.appendChild(divWorkerName);
      const btnViewWorkerLog = document.createElement("button");
      btnViewWorkerLog.alt = "View Worker Log";
      btnViewWorkerLog.style.display = "inline-block";
      btnViewWorkerLog.style.width = "10%";
      btnViewWorkerLog.style.height = "100%";
      const imgViewWorkerLog = document.createElement("img");
      imgViewWorkerLog.src = "ViewLog.bmp";
      imgViewWorkerLog.style.aspectRatio = "1";
      imgViewWorkerLog.style.width = "100%";
      imgViewWorkerLog.style.height = "100%";
      btnViewWorkerLog.appendChild(imgViewWorkerLog);
      divWorkerHeader.appendChild(btnViewWorkerLog);
      const btnPingWorker = document.createElement("button");
      btnPingWorker.alt = "Ping Worker";
      btnPingWorker.style.display = "inline-block";
      btnPingWorker.style.width = "10%";
      btnPingWorker.style.height = "100%";
      const imgPingWorker = document.createElement("img");
      imgPingWorker.src = "Ping.bmp";
      imgPingWorker.style.aspectRatio = "1";
      imgPingWorker.style.width = "100%";
      imgPingWorker.style.height = "100%";
      btnPingWorker.appendChild(imgPingWorker);
      divWorkerHeader.appendChild(btnPingWorker);
      const btnCreateChannel = document.createElement("button");
      btnCreateChannel.alt = "Create Channel";
      btnCreateChannel.style.display = "inline-block";
      btnCreateChannel.style.width = "10%";
      btnCreateChannel.style.height = "100%";
      const imgCreateChannel = document.createElement("img");
      imgCreateChannel.src = "CreateChannel.bmp";
      imgCreateChannel.style.aspectRatio = "1";
      imgCreateChannel.style.width = "100%";
      imgCreateChannel.style.height = "100%";
      btnCreateChannel.appendChild(imgCreateChannel);
      divWorkerHeader.appendChild(btnCreateChannel);
      const btnTerminateWorker = document.createElement("button");
      btnTerminateWorker.alt = "Terminate Worker";
      btnTerminateWorker.style.display = "inline-block";
      btnTerminateWorker.style.width = "10%";
      btnTerminateWorker.style.height = "100%";
      const imgTerminateWorker = document.createElement("img");
      imgTerminateWorker.src = "Delete.bmp";
      imgTerminateWorker.style.aspectRatio = "1";
      imgTerminateWorker.style.width = "100%";
      imgTerminateWorker.style.height = "100%";
      btnTerminateWorker.appendChild(imgTerminateWorker);
      divWorkerHeader.appendChild(btnTerminateWorker);
      const divChannels = document.createElement("div");
      divChannels.style.paddingLeft = "10%";
      divChannels.style.width = "100%";
      divWorker.appendChild(divChannels);
      // Functions
      btnViewWorkerLog.addEventListener("click", function () {
        showLog(thisWorkerLog);
      });
      btnPingWorker.addEventListener("click", function () {
        addEntry(thisWorkerLog, "Ping sent");
        thisWorker.postMessage({
          type: "ping",
        });
      });
      btnCreateChannel.addEventListener("click", function () {
        const thisChannelLog = createLog();
        const channelName = self.prompt("Enter the new channel name:");
        addEntry(thisWorkerLog, "Create channel: " + channelName);
        const thisChannel = new self.MessageChannel();
        thisWorker.postMessage({
          type: "open",
          name: channelName,
          port: thisChannel.port2,
        }, [ thisChannel.port2 ]);
        thisChannel.port1.start();
        const port = thisChannel.port1;
        port.addEventListener("message", channelMessageHandler);
        port.addEventListener("messageerror", channelMessageErrorHandler);
        function channelMessageHandler(evt) {
          addEntry(thisChannelLog, "Received: " + evt.data);
        }
        function channelMessageErrorHandler(evt) {
          addEntry(thisChannelLog, "Message Error");
        }
        // Layout
        const divChannel = document.createElement("div");
        divChannel.style.width = "100%";
        divChannels.appendChild(divChannel);
        const imgChannel = document.createElement("img");
        imgChannel.src = "Channel.bmp";
        imgChannel.style.display = "inline-block";
        imgChannel.style.aspectRatio = "1";
        imgChannel.style.width = "10%";
        divChannel.appendChild(imgChannel);
        const divChannelName = document.createElement("div");
        divChannelName.style.display = "inline-block";
        divChannelName.style.width = "50%";
        divChannelName.appendChild(document.createTextNode(channelName));
        divChannel.appendChild(divChannelName);
        const btnViewChannelLog = document.createElement("button");
        btnViewChannelLog.alt = "View Worker Channel Log";
        btnViewChannelLog.style.display = "inline-block";
        btnViewChannelLog.style.width = "10%";
        const imgViewChannelLog = document.createElement("img");
        imgViewChannelLog.src = "ViewLog.bmp";
        imgViewChannelLog.style.width = "100%";
        imgViewChannelLog.style.height = "100%";
        btnViewChannelLog.appendChild(imgViewChannelLog);
        divChannel.appendChild(btnViewChannelLog);
        const btnSendToWorker = document.createElement("button");
        btnSendToWorker.alt = "Send to Worker";
        btnSendToWorker.style.display = "inline-block";
        btnSendToWorker.style.width = "10%";
        const imgSendToWorker = document.createElement("img");
        imgSendToWorker.src = "Send.bmp";
        imgSendToWorker.style.width = "100%";
        imgSendToWorker.style.height = "100%";
        btnSendToWorker.appendChild(imgSendToWorker);
        divChannel.appendChild(btnSendToWorker);
        const btnCloseWorkerPort = document.createElement("button");
        btnCloseWorkerPort.alt = "Close Worker Port";
        btnCloseWorkerPort.style.display = "inline-block";
        btnCloseWorkerPort.style.width = "10%";
        const imgCloseWorkerPort = document.createElement("img");
        imgCloseWorkerPort.src = "Delete.bmp";
        imgCloseWorkerPort.style.width = "100%";
        imgCloseWorkerPort.style.height = "100%";
        btnCloseWorkerPort.appendChild(imgCloseWorkerPort);
        divChannel.appendChild(btnCloseWorkerPort);
        // Click Listeners
        btnViewChannelLog.addEventListener("click", function () {
          showLog(thisChannelLog);
        });
        btnSendToWorker.addEventListener("click", function () {
          const message = self.prompt("Enter the message to send:");
          port.postMessage(message);
          addEntry(thisChannelLog, "Send: " + message);
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
      btnTerminateWorker.addEventListener("click", function () {
        thisWorker.terminate();
        divWorker.remove();
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
          case "info": {
            addEntry(thisWorkerLog, "Info: " + evt.data.message);
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
        addEntry(thisWorkerLog, "Message Error");
      }
    });

    // Main Message Listeners
    self.addEventListener("message", mainMessageHandler);
    self.addEventListener("messageerror", mainMessageErrorHandler);

    const otherOrigin = "https://scotwatson.github.io";

    btnCreateChildWindow.addEventListener("click", function (evt) {
      const childWindowLog = createLog();
      const childWindowName = self.prompt("Enter the new child window name:");
      const childWindow = self.window.open(otherOrigin + "/JSMessage/index.html", childWindowName);
      self.addEventListener("message", mainChildWindowMessageHandler);
      self.addEventListener("messageerror", mainChildWindowMessageErrorHandler);
      const intervalHandle = self.setInterval(function () {
        childWindow.postMessage({
          type: "ping",
        }, otherOrigin);
      }, 500);
      childWindows.add(childWindow);
      // Layout
      const divChildWindow = document.createElement("div");
      divChildWindow.style.width = "100%";
      divChildWindows.appendChild(divChildWindow);
      const divChildWindowHeader = document.createElement("div");
      divChildWindowHeader.style.width = "100%";
      divChildWindow.appendChild(divChildWindowHeader);
      const imgChildWindow = document.createElement("img");
      imgChildWindow.src = "ChildWindow.bmp";
      imgChildWindow.style.width = "10%";
      imgChildWindow.style.height = "100%";
      divChildWindowHeader.appendChild(imgChildWindow);
      const divChildWindowName = document.createElement("div");
      divChildWindowName.style.display = "inline-block";
      divChildWindowName.style.width = "50%";
      divChildWindowName.appendChild(document.createTextNode(childWindowName));
      divChildWindowHeader.appendChild(divChildWindowName);
      const btnViewWindowLog = document.createElement("button");
      btnViewWindowLog.alt = "View Child Window Log";
      btnViewWindowLog.style.display = "inline-block";
      btnViewWindowLog.style.width = "10%";
      const imgViewWindowLog = document.createElement("img");
      imgViewWindowLog.src = "ViewLog.bmp";
      imgViewWindowLog.style.width = "100%";
      imgViewWindowLog.style.height = "100%";
      btnViewWindowLog.appendChild(imgViewWindowLog);
      divChildWindowHeader.appendChild(btnViewWindowLog);
      const btnPing = document.createElement("button");
      btnPing.alt = "Ping";
      btnPing.style.display = "inline-block";
      btnPing.style.width = "10%";
      const imgPing = document.createElement("img");
      imgPing.src = "Ping.bmp";
      imgPing.style.width = "100%";
      imgPing.style.height = "100%";
      btnPing.appendChild(imgPing);
      divChildWindowHeader.appendChild(btnPing);
      const btnCreateChannel = document.createElement("button");
      btnCreateChannel.alt = "Create Channel";
      btnCreateChannel.style.display = "inline-block";
      btnCreateChannel.style.width = "10%";
      const imgCreateChannel = document.createElement("img");
      imgCreateChannel.src = "CreateChannel.bmp";
      imgCreateChannel.style.width = "100%";
      imgCreateChannel.style.height = "100%";
      btnCreateChannel.appendChild(imgCreateChannel);
      divChildWindowHeader.appendChild(btnCreateChannel);
      const btnCloseWindow = document.createElement("button");
      btnCloseWindow.alt = "Create Channel";
      btnCloseWindow.style.display = "inline-block";
      btnCloseWindow.style.width = "10%";
      const imgCloseWindow = document.createElement("img");
      imgCloseWindow.src = "Delete.bmp";
      imgCloseWindow.style.width = "100%";
      imgCloseWindow.style.height = "100%";
      btnCloseWindow.appendChild(imgCloseWindow);
      divChildWindowHeader.appendChild(btnCloseWindow);
      const divChannels = document.createElement("div");
      divChannels.style.paddingLeft = "10%";
      divChannels.style.width = "100%";
      divChildWindow.appendChild(divChannels);
      // Click Listeners
      btnViewWindowLog.addEventListener("click", function () {
        showLog(childWindowLog);
      });
      btnPing.addEventListener("click", function () {
        childWindow.postMessage({
          type: "ping",
        }, otherOrigin);
        addEntry(childWindowLog, "Ping sent");
      });
      btnCreateChannel.addEventListener("click", function () {
        const childWindowChannelLog = createLog();
        const channelName = self.prompt("Enter the new channel name:");
        const newWindowChannel = new self.MessageChannel();
        const obj = {
          type: "open",
          name: channelName,
          port: newWindowChannel.port2,
        };
        childWindow.postMessage(obj, otherOrigin, [ newWindowChannel.port2 ] );
        const port = newWindowChannel.port1;
        port.addEventListener("message", channelMessageHandler);
        port.addEventListener("messageerror", channelMessageErrorHandler);
        port.start();
        addEntry(childWindowLog, "Open Channel: " + channelName);
        // Layout
        const divChannel = document.createElement("div");
        divChannels.appendChild(divChannel);
        const imgChannel = document.createElement("img");
        imgChannel.src = "Channel.bmp";
        imgChannel.style.display = "inline-block";
        imgChannel.style.width = "10%";
        divChannel.appendChild(imgChannel);
        const divChannelName = document.createElement("div");
        divChannelName.style.display = "inline-block";
        divChannelName.style.width = "50%";
        divChannelName.appendChild(document.createTextNode(channelName));
        divChannel.appendChild(divChannelName);
        const btnViewChannelLog = document.createElement("button");
        btnViewChannelLog.alt = "View Child Window Log";
        btnViewChannelLog.style.display = "inline-block";
        btnViewChannelLog.style.width = "10%";
        const imgViewChannelLog = document.createElement("img");
        imgViewChannelLog.src = "ViewLog.bmp";
        imgViewChannelLog.style.width = "100%";
        imgViewChannelLog.style.height = "100%";
        btnViewChannelLog.appendChild(imgViewChannelLog);
        divChannel.appendChild(btnViewChannelLog);
        const btnSend = document.createElement("button");
        btnSend.alt = "Send Message";
        btnSend.style.display = "inline-block";
        btnSend.style.width = "10%";
        const imgSend = document.createElement("img");
        imgSend.src = "Send.bmp";
        imgSend.style.width = "100%";
        imgSend.style.height = "100%";
        btnSend.appendChild(imgSend);
        divChannel.appendChild(btnSend);
        const btnClose = document.createElement("button");
        btnClose.alt = "Delete Channel";
        btnClose.style.display = "inline-block";
        btnClose.style.width = "10%";
        const imgClose = document.createElement("img");
        imgClose.src = "Delete.bmp";
        imgClose.style.width = "100%";
        imgClose.style.height = "100%";
        btnClose.appendChild(imgClose);
        divChannel.appendChild(btnClose);
        // Click Listeners
        btnViewWindowLog.addEventListener("click", function () {
          showLog(childWindowChannelLog);
        });
        btnSend.addEventListener("click", function () {
          const message = self.prompt("Enter the message to send:");
          port.postMessage(message);
          addEntry(childWindowChannelLog, "Sent: " + message);
        });
        btnClose.addEventListener("click", function () {
          childWindow.postMessage({
            type: "close",
            name: channelName,
          }, otherOrigin);
          port.close();
          addEntry(childWindowLog, "Close Channel: " + channelName);
        });
        // Message Handlers
        function channelMessageHandler(evt) {
          addEntry(childWindowChannelLog, "Received: " + evt.data);
        }
        function channelMessageErrorHandler(evt) {
          addEntry(childWindowChannelLog, "!!!message error!!!");
        }
      });
      btnCloseWindow.addEventListener("click", function () {
        childWindow.close();
        divChildWindow.remove();
      });
      // Message Handlers
      function mainChildWindowMessageHandler(evt) {
        if (evt.source !== childWindow) {
          return;
        }
        const thisOrigin = evt.origin;
        if (thisOrigin !== otherOrigin) {
          childWindow.postMessage({
            type: "error",
            message: "Bad Origin: " + thisOrigin,
          }, thisOrigin);
        }
        switch (evt.data.type) {
          case "echo": {
            self.clearInterval(intervalHandle);
            addEntry(childWindowLog, "Echo received");
            break;
          }
          default: {
            childWindow.postMessage({
              type: "error",
              message: "Unrecognized Type: " + evt.data.type,
            }, otherOrigin);
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
      // Parent can eavesdrop on child
      childWindow.addEventListener("message", childWindowMessageHandler);
      childWindow.addEventListener("messageerror", childWindowMessageErrorHandler);
      function childWindowMessageHandler(evt) {
        const logObj = {
          data: evt.data,
          source: (function () {
            switch (evt.source) {
              case self.window: {
                return evt.source.name + " (This Window)";
              }
              case childWindow: {
                return evt.source.name + " (Child Window)";
              }
              default: {
                return evt.source.name + " (Other Window)";
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
    });
    function registerParent(parentWindow, parentWindowOrigin) {
      const parentWindowLog = createLog();
      self.addEventListener("message", mainParentWindowMessageHandler);
      self.addEventListener("messageerror", mainParentWindowMessageErrorHandler);
      parentWindows.add(parentWindow);
      // Layout
      const divParentWindow = document.createElement("div");
      divParentWindow.style.width = "100%";
      divParentWindows.appendChild(divParentWindow);
      const divParentWindowHeader = document.createElement("div");
      divParentWindowHeader.style.width = "100%";
      divParentWindow.appendChild(divParentWindowHeader);
      const imgParentWindow = document.createElement("img");
      imgParentWindow.src = "ParentWindow.bmp";
      imgParentWindow.style.display = "inline-block";
      imgParentWindow.style.width = "10%";
      divParentWindowHeader.appendChild(imgParentWindow);
      const divParentWindowName = document.createElement("div");
      divParentWindowName.style.display = "inline-block";
      divParentWindowName.style.width = "50%";
      divParentWindowName.appendChild(document.createTextNode(parentWindow.name));
      divParentWindowHeader.appendChild(divParentWindowName);
      const btnViewWindowLog = document.createElement("button");
      btnViewWindowLog.alt = "View Parent Window Log";
      btnViewWindowLog.style.display = "inline-block";
      btnViewWindowLog.style.width = "10%";
      const imgViewWindowLog = document.createElement("img");
      imgViewWindowLog.src = "ViewLog.bmp";
      imgViewWindowLog.style.width = "100%";
      imgViewWindowLog.style.height = "100%";
      btnViewWindowLog.appendChild(imgViewWindowLog);
      divParentWindowHeader.appendChild(btnViewWindowLog);
      const divChannels = document.createElement("div");
      divChannels.style.paddingLeft = "10%";
      divChannels.style.width = "100%";
      divParentWindow.appendChild(divChannels);
      // Send Response
      parentWindow.postMessage({
        type: "echo",
      }, parentWindowOrigin);
      addEntry(parentWindowLog, "Initial Ping & Echo");
      const channels = new Map();
      const channelDivs = new Map();
      // Click Listeners
      btnViewWindowLog.addEventListener("click", function () {
        showLog(parentWindowLog);
      });
      // Message Handlers
      function mainParentWindowMessageHandler(evt) {
        if (evt.source !== parentWindow) {
          return;
        }
        switch (evt.data.type) {
          case "ping": {
            parentWindow.postMessage({
              type: "echo",
            });
            addEntry(parentWindowLog, "Ping & Echo");
            break;
          }
          case "open": {
            const parentWindowChannelLog = createLog();
            const channelName = evt.data.name;
            const port = evt.data.port;
            addEntry(parentWindowLog, "Channel Opened: " + channelName);
            port.addEventListener("message", parentWindowMessageHandler);
            port.addEventListener("messageerror", parentWindowMessageErrorHandler);
            port.start();
            channels.set(channelName, port);
            function parentWindowMessageHandler(evt) {
              addEntry(parentWindowChannelLog, "Recieved: " + evt.data);
            }
            function parentWindowMessageErrorHandler(evt) {
              addEntry(parentWindowChannelLog, "Error: " + evt);
            }
            // Layout
            const divChannel = document.createElement("div");
            divChannel.style.width = "100%";
            divChannels.appendChild(divChannel);
            channelDivs.set(channelName, divChannel);
            const imgChannel = document.createElement("img");
            imgChannel.src = "Channel.bmp";
            imgChannel.style.width = "inline-block";
            imgChannel.style.width = "10%";
            divChannel.appendChild(imgChannel);
            const divChannelName = document.createElement("div");
            divChannelName.style.display = "inline-block";
            divChannelName.style.width = "50%";
            divChannelName.appendChild(document.createTextNode(channelName));
            divChannel.appendChild(divChannelName);
            const btnViewChannelLog = document.createElement("button");
            btnViewChannelLog.alt = "View Parent Window Channel Log";
            btnViewChannelLog.style.display = "inline-block";
            btnViewChannelLog.style.width = "10%";
            const imgViewChannelLog = document.createElement("img");
            imgViewChannelLog.src = "ViewLog.bmp";
            imgViewChannelLog.style.width = "100%";
            imgViewChannelLog.style.height = "100%";
            btnViewChannelLog.appendChild(imgViewChannelLog);
            divChannel.appendChild(btnViewChannelLog);
            const btnSend = document.createElement("button");
            btnSend.alt = "Send to Parent Window";
            btnSend.style.display = "inline-block";
            btnSend.style.width = "10%";
            const imgSend = document.createElement("img");
            imgSend.src = "Send.bmp";
            imgSend.style.width = "100%";
            imgSend.style.height = "100%";
            btnSend.appendChild(imgSend);
            divChannel.appendChild(btnSend);
            const btnCloseChannel = document.createElement("button");
            btnCloseChannel.alt = "Close Port To Parent Window";
            btnCloseChannel.style.display = "inline-block";
            btnCloseChannel.style.width = "10%";
            const imgCloseChannel = document.createElement("img");
            imgCloseChannel.src = "Delete.bmp";
            imgCloseChannel.style.width = "100%";
            imgCloseChannel.style.height = "100%";
            btnCloseChannel.appendChild(imgCloseChannel);
            divChannel.appendChild(btnCloseChannel);
            // Click Listener
            btnViewChannelLog.addEventListener("click", function () {
              showLog(parentWindowChannelLog);
            });
            btnSend.addEventListener("click", function () {
              const message = self.prompt("Enter the message to send:");
              port.postMessage(message);
              addEntry(parentWindowChannelLog, "Send: " + message);
            });
            btnCloseChannel.addEventListener("click", function () {
              port.close();
              addEntry(parentWindowLog, "Close Channel: " + channelName);
            });
            break;
          }
          case "close": {
            channels.get(channelName).close();
            channels.remove(channelName);
            channelDivs.get(channelName).remove();
            channelDivs.remove(channelName);
            addEntry(parentWindowLog, "Channel Closed: " + channelName);
            break;
          }
          case "error": {
            // Process Error
            addEntry(parentWindowLog, "Error Received: " + evt.data.message);
            break;
          }
          default: {
            const message = "Unrecognized Type: " + evt.data.type;
            parentWindow.postMessage({
              type: "error",
              message: message,
            });
            addEntry(parentWindowLog, "Error Sent: " + message);
            break;
          }
        };
      }
      function mainParentWindowMessageErrorHandler(evt) {
        console.error(evt);
      }
    }
    // In parent, sees child-sent messages
    // In child, sees parent-sent messages
    function mainMessageHandler(evt) {
      const fromOrigin = evt.origin;
      const fromWindow = evt.source;
      if (fromOrigin !== otherOrigin) {
        fromWindow.postMessage({
          type: "error",
          message: "Bad Origin: " + fromOrigin,
        }, fromOrigin);
        return;
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
        registerParent(fromWindow, fromOrigin);
      } else {
        fromWindow.postMessage({
          type: "error",
          message: "ping must be sent to begin communication, type received: " + evt.data.type,
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

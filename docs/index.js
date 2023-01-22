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

async function start( [ evtWindow, ErrorLog ] ) {
  try {
    const imgBird = document.createElement("img");
    imgBird.src = "FlappingBird.gif";
    imgBird.style.width = "200px";
    document.body.appendChild(imgBird);
    document.body.appendChild(document.createElement("br"));

    const btnSendToWorker = document.createElement("button");
    btnSendToWorker.appendChild(document.createTextNode("Send to Worker"));
    document.body.appendChild(btnSendToWorker);
    document.body.appendChild(document.createElement("br"));
    
    const btnSendFromWorker = document.createElement("button");
    btnSendFromWorker.appendChild(document.createTextNode("Send from Worker"));
    document.body.appendChild(btnSendFromWorker);
    document.body.appendChild(document.createElement("br"));
    
    const btnCloseWindowPort = document.createElement("button");
    btnCloseWindowPort.appendChild(document.createTextNode("Close Window Side Port"));
    document.body.appendChild(btnCloseWindowPort);
    document.body.appendChild(document.createElement("br"));
    
    const btnCloseWorkerPort = document.createElement("button");
    btnCloseWorkerPort.appendChild(document.createTextNode("Close Worker Side Port"));
    document.body.appendChild(btnCloseWorkerPort);
    document.body.appendChild(document.createElement("br"));
    
    const btnOpenChildWindow = document.createElement("button");
    btnOpenChildWindow.appendChild(document.createTextNode("Open Child Window"));
    document.body.appendChild(btnOpenChildWindow);
    document.body.appendChild(document.createElement("br"));

    self.addEventListener("message", mainMessageHandler);
    self.addEventListener("messageerror", mainMessageErrorHandler);
    const myWorker = new Worker("worker.js");
    myWorker.addEventListener("message", mainWorkerMessageHandler);
    myWorker.addEventListener("messageerror", mainWorkerMessageErrorHandler);
    const newChannel = new MessageChannel();
    newChannel.port1.addEventListener("message", newWorkerMessageHandler);
    newChannel.port1.addEventListener("messageerror", newWorkerMessageErrorHandler);

    const otherOrigin = "https://scotwatson.github.io";

    btnSendToWorker.addEventListener("click", function () {
      newChannel.port1.postMessage("From Window to Worker");
      console.log("From Window to Worker");
    });
    btnSendFromWorker.addEventListener("click", function () {
      myWorker.postMessage({
        cmd: "send",
      });
    });
    btnCloseWindowPort.addEventListener("click", function () {
      newChannel.port1.close();
      console.log("Window Port Closed");
    });
    btnCloseWorkerPort.addEventListener("click", function () {
      myWorker.postMessage({
        cmd: "close",
      });
    });
    
    btnOpenChildWindow.addEventListener("click", function (evt) {

      const childWindow = self.window.open(otherOrigin + "/JSMessage/index.html");
      childWindow.addEventListener("message", childWindowMessageHandler);
      childWindow.addEventListener("messageerror", childWindowMessageErrorHandler);

      const newWindowChannel = new MessageChannel();
      newWindowChannel.port1.addEventListener("message", newWindowMessageHandler);
      newWindowChannel.port1.addEventListener("messageerror", newWindowMessageErrorHandler);

      const intervalHandle = self.setInterval(function () {
        childWindow.postMessage({
          cmd: "Start",
        }, otherOrigin);
      }, 500);
      evt.target.remove();
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
                return "Unknown Window";
              }
            };
          })(),
        };
        console.log(logObj);
        const childOrigin = evt.origin;
        const childWindow = evt.source;
        if (childOrigin !== otherOrigin) {
          throw "Bad Origin: " + childOrigin;
        }
        switch (evt.data.cmd) {
          case "Hello": {
            self.clearInterval(intervalHandle);
            const obj = {
              cmd: "port",
              port: newWindowChannel.port2,
            };
            newWindowChannel.port1.start();
            childWindow.postMessage(obj, otherOrigin, [ newWindowChannel.port2 ] );

            const btnSendToChildWindow = document.createElement("button");
            btnSendToChildWindow.appendChild(document.createTextNode("Send to Child Window"));
            document.body.appendChild(btnSendToChildWindow);
            document.body.appendChild(document.createElement("br"));
            const btnClosePortToChildWindow = document.createElement("button");
            btnClosePortToChildWindow.appendChild(document.createTextNode("Close Port To Child Window"));
            document.body.appendChild(btnClosePortToChildWindow);
            document.body.appendChild(document.createElement("br"));

            btnSendToChildWindow.addEventListener("click", function () {
              newWindowChannel.port1.postMessage({
                cmd: "test from parent",
              });
            });
            btnClosePortToChildWindow.addEventListener("click", function () {
              newWindowChannel.port1.postMessage({
                cmd: "close parent to child port",
              });
            });

            console.log("port sent to child window");
            break;
          }
          default: {
            break;
          }
        };
      }
      function childWindowMessageErrorHandler(evt) {
        console.error(evt);
      }
      function newWindowMessageHandler(evt) {
        console.log(evt);
      }
      function newWindowMessageErrorHandler(evt) {
        console.error(evt);
      }
    });

    let parentWindow;
    let parentWindowPort;
    let helloSent = false;
    
    function mainMessageHandler(evt) {
      const logObj = {
        data: evt.data,
        source: (function () {
          switch (evt.source) {
            case self.window: {
              return "This Window";
            }
            case parentWindow: {
              return "Parent Window";
            }
            default: {
              return "Unknown Window";
            }
          };
        })(),
      };
      console.log(logObj);
      const thisOrigin = evt.origin;
      const thisWindow = evt.source;
      if (thisOrigin !== otherOrigin) {
        throw "Bad Origin: " + thisOrigin;
      }
      switch (evt.data.cmd) {
        case "Start": {
          if (!helloSent) {
            thisWindow.postMessage({
              cmd: "Hello",
            });
            helloSent = true;
          }
          break;
        }
        case "port": {
          parentWindow = thisWindow;
          parentWindowPort = evt.data.port;
          
          const btnSendToParentWindow = document.createElement("button");
          btnSendToParentWindow.appendChild(document.createTextNode("Send to Parent Window"));
          document.body.appendChild(btnSendToParentWindow);
          document.body.appendChild(document.createElement("br"));
          const btnClosePortToParentWindow = document.createElement("button");
          btnClosePortToParentWindow.appendChild(document.createTextNode("Close Port To Parent Window"));
          document.body.appendChild(btnClosePortToParentWindow);
          document.body.appendChild(document.createElement("br"));

          btnSendToParentWindow.addEventListener("click", function () {
            parentWindow.postMessage({
              cmd: "test from child",
            });
          });
          btnClosePortToParentWindow.addEventListener("click", function () {
            parentWindow.postMessage({
              cmd: "close child to parent port",
            });
          });
          break;
        }
        default: {
          break;
        }
      };
    }
    function mainMessageErrorHandler(evt) {
      console.error(evt);
    }
    function mainWorkerMessageHandler(evt) {
      console.log(evt);
      if (evt.data === "Hello") {
        const obj = {
          cmd: "port",
          port: newChannel.port2,
        };
        newChannel.port1.start();
        myWorker.postMessage(obj, [ newChannel.port2 ] );
        console.log("port sent to worker");
      }
    }
    function mainWorkerMessageErrorHandler(evt) {
      console.error(evt);
    }
    function newWorkerMessageHandler(evt) {
      console.log(evt);
    }
    function newWorkerMessageErrorHandler(evt) {
      console.error(evt);
    }
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "start",
      error: e,
    });
  }
}

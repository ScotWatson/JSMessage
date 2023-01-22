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
    
    const myWorker = new Worker("worker.js");
    myWorker.addEventListener("message", mainMessageHandler);
    myWorker.addEventListener("messageerror", mainMessageErrorHandler);
    const newChannel = new MessageChannel();
    newChannel.port1.addEventListener("message", newMessageHandler);
    newChannel.port1.addEventListener("messageerror", newMessageErrorHandler);
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
    function mainMessageHandler(evt) {
      console.log(evt);
      if (evt.data === "Hello") {
        const obj = {
          cmd: "port",
          port: newChannel.port2,
        };
        newChannel.port1.start();
        myWorker.postMessage(obj, [ newChannel.port2 ] );
        console.log("port sent");
      }
    }
    function mainMessageErrorHandler(evt) {
      console.error(evt);
    }
    function newMessageHandler(evt) {
      console.log(evt);
    }
    function newMessageErrorHandler(evt) {
      console.error(evt);
    }
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "start",
      error: e,
    });
  }
}

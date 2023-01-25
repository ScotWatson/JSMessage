/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

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
    const modules = await Promise.all( [ asyncErrorLog ] );
    start(modules);
  } catch (e) {
    console.error(e);
  }
})();

const ports = new Map();

async function start( [ ErrorLog ] ) {
  try {
    self.addEventListener("message", mainMessageHandler);
    self.addEventListener("messageerror", mainMessageErrorHandler);
    function mainMessageHandler(evt) {
      switch (evt.data.type) {
        case "ping": {
          self.postMessage({
            type: "echo",
          });
          break;
        }
        case "open": {
          const port = evt.data.port;
          const name = evt.data.name;
          addPort(name, port);
          self.postMessage({
            type: "info",
            message: "Port added: " + evt.data.name,
          });
          break;
        }
        case "close": {
          const name = evt.data.name;
          ports.get(name).close();
          ports.delete(name);
          break;
        }
        default: {
          self.postMessage({
            type: "error",
            message: "Unknown Type: " + evt.data.type,
          });
          break;
        }
      };
    }
    function mainMessageErrorHandler(evt) {
      self.postMessage(evt);
    }
    function addPort(name, port) {
      ports.set(name, port);
      port.addEventListener("message", myMessageHandler);
      port.addEventListener("messageerror", myMessageErrorHandler);
      port.start();
      function myMessageHandler(evt) {
        port.postMessage("Received: " + evt.data);
        self.postMessage({
          type: "info",
          message: "message on port: " + name,
        });
      }
      function myMessageErrorHandler(evt) {
        port.postMessage("port message error");
        self.postMessage({
          type: "info",
          message: "Error on port: " + name,
        });
      }
    }
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "start",
      error: e,
    });
  }
}

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

async function start( [ ErrorLog ] ) {
  try {
    let myPort;
    self.addEventListener("message", mainMessageHandler);
    self.addEventListener("messageerror", mainMessageErrorHandler);
    self.postMessage("Hello");
    function mainMessageHandler(evt) {
      switch (evt.data.type) {
        case "port":
          if (myPort === undefined) {
            myPort = evt.data.port;
            myPort.addEventListener("message", myMessageHandler);
            myPort.addEventListener("messageerror", myMessageErrorHandler);
            myPort.start();
            self.postMessage("port received");
          } else {
            // Close and discard received port
            evt.data.port.close();
          }
          break;
        case "send":
          myPort.postMessage("From Worker to Window");
          break;
        case "close":
          myPort.close();
          break;
        default:
          break;
      };
      if ("port" in evt.data) {
      }
    }
    function mainMessageErrorHandler(evt) {
      self.postMessage(evt);
    }
    function myMessageHandler(evt) {
      myPort.postMessage("Received: " + evt.data);
    }
    function myMessageErrorHandler(evt) {
      self.postMessage("port message error");
    }
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "start",
      error: e,
    });
  }
}

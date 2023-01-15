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
  }
  async openChannel(args) {
    return {
      type: "openChannel",
      name: args.name,
    };
  }
}

export function evtListener(evt) {
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
    default:
      throw "Unrecognized Command Type";
  };
}

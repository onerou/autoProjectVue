const MyWorker = require('worker-loader!@/assets/workers/index.worker.js')
// var worker = new MyWorker()
// worker.postMessage({ a: 1 })
// worker.onmessage = function(event) {
//   console.log('event: ', event)
//   /* 操作 */
// }
export default {
  MyWorker
}

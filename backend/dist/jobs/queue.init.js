"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportQueue = exports.syncQueue = exports.scoringQueue = void 0;
const simple_queue_1 = require("../lib/queue/simple-queue");
exports.scoringQueue = simple_queue_1.QueueManager.getQueue('scoring-jobs', {
    maxAttempts: 3,
});
exports.syncQueue = simple_queue_1.QueueManager.getQueue('sync-jobs', {
    maxAttempts: 5,
});
exports.reportQueue = simple_queue_1.QueueManager.getQueue('report-jobs', {
    maxAttempts: 3,
});
//# sourceMappingURL=queue.init.js.map
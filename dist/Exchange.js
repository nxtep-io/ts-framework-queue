"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_framework_common_1 = require("ts-framework-common");
const Queue_1 = require("./Queue");
exports.NACK_TIMEOUT = 30000;
class Exchange {
    constructor(name, channel, options) {
        this.name = name;
        this.channel = channel;
        this.options = options;
        this.queues = [];
        this.logger = options.logger || ts_framework_common_1.Logger.getInstance();
        this.queues = options.queues || [];
        if (options.prefetch) {
            this.channel.prefetch(options.prefetch);
        }
    }
    // tslint:disable-next-line:max-line-length
    static from(name, channel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const exchange = new Exchange(name, channel, options);
            if (options.bind) {
                // Ensure all requested queues exists in channel
                yield exchange.bindQueues();
            }
            return exchange;
        });
    }
    /**
     * Binds a new queue in the current channel.
     */
    bindQueues() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('Binding queues to AMQP exchange instance', {
                exchange: this.name,
                queues: this.options.queues,
            });
            const tasks = this.options.bind.map((info) => __awaiter(this, void 0, void 0, function* () {
                this.logger.debug('Initializing AMQP queue instance in exchange', info);
                const queue = yield Queue_1.default.from(info.name, this.channel, {
                    exchangeName: this.name,
                    routes: info.routes
                });
                this.queues.push(queue);
            }));
            // TODO: Improve this eventually, parallel may not be safe
            yield Promise.all(tasks);
        });
    }
    /**
     * Publishes data to exchange with specific routing.
     */
    publish(route, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.publish(this.name, route, data, options);
        });
    }
    subscribe(queueName, onData, options) {
        const queue = this.queues.find(q => q.name === queueName);
        // Ensure queue is bound to curren exchange
        if (!queue) {
            throw new ts_framework_common_1.BaseError(`Cannot subscribe to unbound queue "${queueName}"`);
        }
        const actions = {
            ack: (msg, allUpTo) => __awaiter(this, void 0, void 0, function* () {
                this.channel.ack(msg, allUpTo);
            }),
            nack: (msg, allUpTo, requeue) => __awaiter(this, void 0, void 0, function* () {
                this.channel.nack(msg, allUpTo, requeue);
            }),
            publish: (route, data, options) => __awaiter(this, void 0, void 0, function* () {
                this.publish(route, data, options);
                return true;
            }),
        };
        const wrapper = (content, message) => onData(content, message, actions);
        this.channel.consume(queueName, wrapper, options);
    }
}
exports.default = Exchange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhjaGFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvRXhjaGFuZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZEQUF3RDtBQUd4RCxtQ0FBNEI7QUFFZixRQUFBLFlBQVksR0FBRyxLQUFLLENBQUM7QUFtQmxDLE1BQXFCLFFBQVE7SUFJM0IsWUFBbUIsSUFBWSxFQUFZLE9BQXNCLEVBQVMsT0FBOEI7UUFBckYsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFZLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUF1QjtRQUZqRyxXQUFNLEdBQWtCLEVBQUUsQ0FBQztRQUdoQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksNEJBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1FBRW5DLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBRUQsMkNBQTJDO0lBQ3BDLE1BQU0sQ0FBTyxJQUFJLENBQU8sSUFBWSxFQUFFLE9BQXNCLEVBQUUsT0FBOEI7O1lBQ2pHLE1BQU0sUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFdEQsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUNoQixnREFBZ0Q7Z0JBQ2hELE1BQU0sUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQzdCO1lBRUQsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDRyxVQUFVOztZQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxFQUFFO2dCQUM1RCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07YUFDNUIsQ0FBQyxDQUFDO1lBRUgsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQU0sSUFBSSxFQUFDLEVBQUU7Z0JBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN4RSxNQUFNLEtBQUssR0FBRyxNQUFNLGVBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUN0RCxZQUFZLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDcEIsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCwwREFBMEQ7WUFDMUQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1UsT0FBTyxDQUFDLEtBQWEsRUFBRSxJQUFJLEVBQUUsT0FBNkI7O1lBQ3JFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9ELENBQUM7S0FBQTtJQUVNLFNBQVMsQ0FBQyxTQUFpQixFQUFFLE1BQWdDLEVBQUUsT0FBNkI7UUFDakcsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBRTFELDJDQUEyQztRQUMzQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsTUFBTSxJQUFJLCtCQUFTLENBQUMsc0NBQXNDLFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDekU7UUFDRCxNQUFNLE9BQU8sR0FBRztZQUNkLEdBQUcsRUFBRSxDQUFPLEdBQUcsRUFBRSxPQUFpQixFQUFFLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUNoQyxDQUFDLENBQUE7WUFDRCxJQUFJLEVBQUUsQ0FBTyxHQUFHLEVBQUUsT0FBaUIsRUFBRSxPQUFpQixFQUFFLEVBQUU7Z0JBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFDMUMsQ0FBQyxDQUFBO1lBQ0QsT0FBTyxFQUFFLENBQU8sS0FBSyxFQUFFLElBQUksRUFBRSxPQUE2QixFQUFFLEVBQUU7Z0JBQzVELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbkMsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDLENBQUE7U0FDRixDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQUcsQ0FBQyxPQUFZLEVBQUUsT0FBb0IsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0Y7QUE3RUQsMkJBNkVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUVycm9yLCBMb2dnZXIgfSBmcm9tIFwidHMtZnJhbWV3b3JrLWNvbW1vblwiO1xuaW1wb3J0IHsgQU1RUE9wdGlvbnMsIEFNUVBNZXNzYWdlLCBBTVFQQWN0aW9ucyB9IGZyb20gXCIuL0FNUVBcIjtcbmltcG9ydCBDaGFubmVsIGZyb20gXCIuL0NoYW5uZWxcIjtcbmltcG9ydCBRdWV1ZSBmcm9tIFwiLi9RdWV1ZVwiO1xuXG5leHBvcnQgY29uc3QgTkFDS19USU1FT1VUID0gMzAwMDA7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVJbmZvcm1hdGlvbiB7XG4gIG5hbWU6IHN0cmluZztcbiAgcm91dGVzPzogc3RyaW5nW107XG59XG5cbmV4cG9ydCB0eXBlIEV4Y2hhbmdlU3Vic2NyaWJlcjxEYXRhPiA9IChkYXRhOiBhbnksIG1lc3NhZ2U6IEFNUVBNZXNzYWdlLCBhY3Rpb25zOiBBTVFQQWN0aW9uczxEYXRhPikgPT4gUHJvbWlzZTx2b2lkPjtcblxuZXhwb3J0IGludGVyZmFjZSBFeGNoYW5nZU9wdGlvbnM8RGF0YT4ge1xuICBiaW5kOiBRdWV1ZUluZm9ybWF0aW9uW107XG4gIHR5cGU/OiBzdHJpbmc7XG4gIGxvZ2dlcj86IExvZ2dlcjtcbiAgcXVldWVzPzogUXVldWU8RGF0YT5bXTtcbiAgcHJlZmV0Y2g/OiBudW1iZXI7XG4gIHF1ZXVlT3B0aW9ucz86IEFNUVBPcHRpb25zLkFzc2VydFF1ZXVlO1xuICBleGNoYW5nZU9wdGlvbnM/OiBBTVFQT3B0aW9ucy5Bc3NlcnRFeGNoYW5nZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhjaGFuZ2U8RGF0YT4ge1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHB1YmxpYyBxdWV1ZXM6IFF1ZXVlPERhdGE+W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwcm90ZWN0ZWQgY2hhbm5lbDogQ2hhbm5lbDxEYXRhPiwgcHVibGljIG9wdGlvbnM6IEV4Y2hhbmdlT3B0aW9uczxEYXRhPikge1xuICAgIHRoaXMubG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIgfHwgTG9nZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgdGhpcy5xdWV1ZXMgPSBvcHRpb25zLnF1ZXVlcyB8fCBbXTtcblxuICAgIGlmIChvcHRpb25zLnByZWZldGNoKSB7XG4gICAgICB0aGlzLmNoYW5uZWwucHJlZmV0Y2gob3B0aW9ucy5wcmVmZXRjaCk7XG4gICAgfVxuICB9XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICBwdWJsaWMgc3RhdGljIGFzeW5jIGZyb208RGF0YT4obmFtZTogc3RyaW5nLCBjaGFubmVsOiBDaGFubmVsPERhdGE+LCBvcHRpb25zOiBFeGNoYW5nZU9wdGlvbnM8RGF0YT4pOiBQcm9taXNlPEV4Y2hhbmdlPERhdGE+PiB7XG4gICAgY29uc3QgZXhjaGFuZ2UgPSBuZXcgRXhjaGFuZ2UobmFtZSwgY2hhbm5lbCwgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5iaW5kKSB7XG4gICAgICAvLyBFbnN1cmUgYWxsIHJlcXVlc3RlZCBxdWV1ZXMgZXhpc3RzIGluIGNoYW5uZWxcbiAgICAgIGF3YWl0IGV4Y2hhbmdlLmJpbmRRdWV1ZXMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXhjaGFuZ2U7XG4gIH1cblxuICAvKipcbiAgICogQmluZHMgYSBuZXcgcXVldWUgaW4gdGhlIGN1cnJlbnQgY2hhbm5lbC5cbiAgICovXG4gIGFzeW5jIGJpbmRRdWV1ZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0JpbmRpbmcgcXVldWVzIHRvIEFNUVAgZXhjaGFuZ2UgaW5zdGFuY2UnLCB7XG4gICAgICBleGNoYW5nZTogdGhpcy5uYW1lLFxuICAgICAgcXVldWVzOiB0aGlzLm9wdGlvbnMucXVldWVzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGFza3MgPSB0aGlzLm9wdGlvbnMuYmluZC5tYXAoYXN5bmMgaW5mbyA9PiB7XG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnSW5pdGlhbGl6aW5nIEFNUVAgcXVldWUgaW5zdGFuY2UgaW4gZXhjaGFuZ2UnLCBpbmZvKTtcbiAgICAgIGNvbnN0IHF1ZXVlID0gYXdhaXQgUXVldWUuZnJvbShpbmZvLm5hbWUsIHRoaXMuY2hhbm5lbCwge1xuICAgICAgICBleGNoYW5nZU5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgcm91dGVzOiBpbmZvLnJvdXRlc1xuICAgICAgfSk7XG4gICAgICB0aGlzLnF1ZXVlcy5wdXNoKHF1ZXVlKTtcbiAgICB9KTtcblxuICAgIC8vIFRPRE86IEltcHJvdmUgdGhpcyBldmVudHVhbGx5LCBwYXJhbGxlbCBtYXkgbm90IGJlIHNhZmVcbiAgICBhd2FpdCBQcm9taXNlLmFsbCh0YXNrcyk7XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGVzIGRhdGEgdG8gZXhjaGFuZ2Ugd2l0aCBzcGVjaWZpYyByb3V0aW5nLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHB1Ymxpc2gocm91dGU6IHN0cmluZywgZGF0YSwgb3B0aW9ucz86IEFNUVBPcHRpb25zLlB1Ymxpc2gpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLnB1Ymxpc2godGhpcy5uYW1lLCByb3V0ZSwgZGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgc3Vic2NyaWJlKHF1ZXVlTmFtZTogc3RyaW5nLCBvbkRhdGE6IEV4Y2hhbmdlU3Vic2NyaWJlcjxEYXRhPiwgb3B0aW9ucz86IEFNUVBPcHRpb25zLkNvbnN1bWUpOiB2b2lkIHtcbiAgICBjb25zdCBxdWV1ZSA9IHRoaXMucXVldWVzLmZpbmQocSA9PiBxLm5hbWUgPT09IHF1ZXVlTmFtZSk7XG5cbiAgICAvLyBFbnN1cmUgcXVldWUgaXMgYm91bmQgdG8gY3VycmVuIGV4Y2hhbmdlXG4gICAgaWYgKCFxdWV1ZSkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFcnJvcihgQ2Fubm90IHN1YnNjcmliZSB0byB1bmJvdW5kIHF1ZXVlIFwiJHtxdWV1ZU5hbWV9XCJgKTtcbiAgICB9XG4gICAgY29uc3QgYWN0aW9ucyA9IHtcbiAgICAgIGFjazogYXN5bmMgKG1zZywgYWxsVXBUbz86IGJvb2xlYW4pID0+IHtcbiAgICAgICAgdGhpcy5jaGFubmVsLmFjayhtc2csIGFsbFVwVG8pXG4gICAgICB9LFxuICAgICAgbmFjazogYXN5bmMgKG1zZywgYWxsVXBUbz86IGJvb2xlYW4sIHJlcXVldWU/OiBib29sZWFuKSA9PiB7XG4gICAgICAgIHRoaXMuY2hhbm5lbC5uYWNrKG1zZywgYWxsVXBUbywgcmVxdWV1ZSlcbiAgICAgIH0sXG4gICAgICBwdWJsaXNoOiBhc3luYyAocm91dGUsIGRhdGEsIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5QdWJsaXNoKSA9PiB7XG4gICAgICAgIHRoaXMucHVibGlzaChyb3V0ZSwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3Qgd3JhcHBlciA9IChjb250ZW50OiBhbnksIG1lc3NhZ2U6IEFNUVBNZXNzYWdlKSA9PiBvbkRhdGEoY29udGVudCwgbWVzc2FnZSwgYWN0aW9ucyk7XG4gICAgdGhpcy5jaGFubmVsLmNvbnN1bWUocXVldWVOYW1lLCB3cmFwcGVyLCBvcHRpb25zKTtcbiAgfVxufVxuIl19
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
const utils_1 = require("./utils");
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
    /**
     * Listens for new messages in the exchange.
     */
    subscribe(queueName, onData, options) {
        const queue = this.queues.find(q => q.name === queueName);
        // Ensure queue is bound to curren exchange
        if (!queue) {
            throw new ts_framework_common_1.BaseError(`Cannot subscribe to unbound queue "${queueName}"`);
        }
        // Prepare wrapper for channel subscriber
        const wrapper = (content, message) => __awaiter(this, void 0, void 0, function* () {
            yield onData(content, message, new utils_1.ExchangeActions(this, message));
        });
        this.channel.consume(queueName, wrapper, options);
    }
}
exports.default = Exchange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhjaGFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvRXhjaGFuZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZEQUF3RDtBQUd4RCxtQ0FBNEI7QUFDNUIsbUNBQTBDO0FBb0IxQyxNQUFxQixRQUFRO0lBSTNCLFlBQW1CLElBQVksRUFBUyxPQUFzQixFQUFTLE9BQThCO1FBQWxGLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFlO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBdUI7UUFGOUYsV0FBTSxHQUFrQixFQUFFLENBQUM7UUFHaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLDRCQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUVuQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVELDJDQUEyQztJQUNwQyxNQUFNLENBQU8sSUFBSSxDQUFPLElBQVksRUFBRSxPQUFzQixFQUFFLE9BQThCOztZQUNqRyxNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXRELElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDaEIsZ0RBQWdEO2dCQUNoRCxNQUFNLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUM3QjtZQUVELE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0csVUFBVTs7WUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsRUFBRTtnQkFDNUQsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO2FBQzVCLENBQUMsQ0FBQztZQUVILE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFNLElBQUksRUFBQyxFQUFFO2dCQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEUsTUFBTSxLQUFLLEdBQUcsTUFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDdEQsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUN2QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07aUJBQ3BCLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUEsQ0FBQyxDQUFDO1lBRUgsMERBQTBEO1lBQzFELE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLE9BQU8sQ0FBQyxLQUFhLEVBQUUsSUFBVSxFQUFFLE9BQTZCOztZQUMzRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvRCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNJLFNBQVMsQ0FBQyxTQUFpQixFQUFFLE1BQWdDLEVBQUUsT0FBNkI7UUFDakcsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBRTFELDJDQUEyQztRQUMzQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsTUFBTSxJQUFJLCtCQUFTLENBQUMsc0NBQXNDLFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDekU7UUFFRCx5Q0FBeUM7UUFDekMsTUFBTSxPQUFPLEdBQUcsQ0FBTyxPQUFZLEVBQUUsT0FBb0IsRUFBRSxFQUFFO1lBQzNELE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSx1QkFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ3BFLENBQUMsQ0FBQSxDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0Y7QUF4RUQsMkJBd0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUVycm9yLCBMb2dnZXIgfSBmcm9tIFwidHMtZnJhbWV3b3JrLWNvbW1vblwiO1xuaW1wb3J0IHsgQU1RUE1lc3NhZ2UsIEFNUVBPcHRpb25zIH0gZnJvbSBcIi4vQU1RUFwiO1xuaW1wb3J0IENoYW5uZWwgZnJvbSBcIi4vQ2hhbm5lbFwiO1xuaW1wb3J0IFF1ZXVlIGZyb20gXCIuL1F1ZXVlXCI7XG5pbXBvcnQgeyBFeGNoYW5nZUFjdGlvbnMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXVlSW5mb3JtYXRpb24ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHJvdXRlcz86IHN0cmluZ1tdO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG5leHBvcnQgdHlwZSBFeGNoYW5nZVN1YnNjcmliZXI8RGF0YT4gPSAoZGF0YTogRGF0YSwgbWVzc2FnZTogQU1RUE1lc3NhZ2UsIGFjdGlvbnM6IEV4Y2hhbmdlQWN0aW9uczxEYXRhPikgPT4gUHJvbWlzZTx2b2lkPjtcblxuZXhwb3J0IGludGVyZmFjZSBFeGNoYW5nZU9wdGlvbnM8RGF0YT4ge1xuICBiaW5kOiBRdWV1ZUluZm9ybWF0aW9uW107XG4gIHR5cGU/OiBzdHJpbmc7XG4gIGxvZ2dlcj86IExvZ2dlcjtcbiAgcXVldWVzPzogUXVldWU8RGF0YT5bXTtcbiAgcHJlZmV0Y2g/OiBudW1iZXI7XG4gIHF1ZXVlT3B0aW9ucz86IEFNUVBPcHRpb25zLkFzc2VydFF1ZXVlO1xuICBleGNoYW5nZU9wdGlvbnM/OiBBTVFQT3B0aW9ucy5Bc3NlcnRFeGNoYW5nZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhjaGFuZ2U8RGF0YT4ge1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHB1YmxpYyBxdWV1ZXM6IFF1ZXVlPERhdGE+W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgY2hhbm5lbDogQ2hhbm5lbDxEYXRhPiwgcHVibGljIG9wdGlvbnM6IEV4Y2hhbmdlT3B0aW9uczxEYXRhPikge1xuICAgIHRoaXMubG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIgfHwgTG9nZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgdGhpcy5xdWV1ZXMgPSBvcHRpb25zLnF1ZXVlcyB8fCBbXTtcblxuICAgIGlmIChvcHRpb25zLnByZWZldGNoKSB7XG4gICAgICB0aGlzLmNoYW5uZWwucHJlZmV0Y2gob3B0aW9ucy5wcmVmZXRjaCk7XG4gICAgfVxuICB9XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICBwdWJsaWMgc3RhdGljIGFzeW5jIGZyb208RGF0YT4obmFtZTogc3RyaW5nLCBjaGFubmVsOiBDaGFubmVsPERhdGE+LCBvcHRpb25zOiBFeGNoYW5nZU9wdGlvbnM8RGF0YT4pOiBQcm9taXNlPEV4Y2hhbmdlPERhdGE+PiB7XG4gICAgY29uc3QgZXhjaGFuZ2UgPSBuZXcgRXhjaGFuZ2UobmFtZSwgY2hhbm5lbCwgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5iaW5kKSB7XG4gICAgICAvLyBFbnN1cmUgYWxsIHJlcXVlc3RlZCBxdWV1ZXMgZXhpc3RzIGluIGNoYW5uZWxcbiAgICAgIGF3YWl0IGV4Y2hhbmdlLmJpbmRRdWV1ZXMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXhjaGFuZ2U7XG4gIH1cblxuICAvKipcbiAgICogQmluZHMgYSBuZXcgcXVldWUgaW4gdGhlIGN1cnJlbnQgY2hhbm5lbC5cbiAgICovXG4gIGFzeW5jIGJpbmRRdWV1ZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0JpbmRpbmcgcXVldWVzIHRvIEFNUVAgZXhjaGFuZ2UgaW5zdGFuY2UnLCB7XG4gICAgICBleGNoYW5nZTogdGhpcy5uYW1lLFxuICAgICAgcXVldWVzOiB0aGlzLm9wdGlvbnMucXVldWVzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGFza3MgPSB0aGlzLm9wdGlvbnMuYmluZC5tYXAoYXN5bmMgaW5mbyA9PiB7XG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnSW5pdGlhbGl6aW5nIEFNUVAgcXVldWUgaW5zdGFuY2UgaW4gZXhjaGFuZ2UnLCBpbmZvKTtcbiAgICAgIGNvbnN0IHF1ZXVlID0gYXdhaXQgUXVldWUuZnJvbShpbmZvLm5hbWUsIHRoaXMuY2hhbm5lbCwge1xuICAgICAgICBleGNoYW5nZU5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgcm91dGVzOiBpbmZvLnJvdXRlc1xuICAgICAgfSk7XG4gICAgICB0aGlzLnF1ZXVlcy5wdXNoKHF1ZXVlKTtcbiAgICB9KTtcblxuICAgIC8vIFRPRE86IEltcHJvdmUgdGhpcyBldmVudHVhbGx5LCBwYXJhbGxlbCBtYXkgbm90IGJlIHNhZmVcbiAgICBhd2FpdCBQcm9taXNlLmFsbCh0YXNrcyk7XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGVzIGRhdGEgdG8gZXhjaGFuZ2Ugd2l0aCBzcGVjaWZpYyByb3V0aW5nLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHB1Ymxpc2gocm91dGU6IHN0cmluZywgZGF0YTogRGF0YSwgb3B0aW9ucz86IEFNUVBPcHRpb25zLlB1Ymxpc2gpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLnB1Ymxpc2godGhpcy5uYW1lLCByb3V0ZSwgZGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVucyBmb3IgbmV3IG1lc3NhZ2VzIGluIHRoZSBleGNoYW5nZS5cbiAgICovXG4gIHB1YmxpYyBzdWJzY3JpYmUocXVldWVOYW1lOiBzdHJpbmcsIG9uRGF0YTogRXhjaGFuZ2VTdWJzY3JpYmVyPERhdGE+LCBvcHRpb25zPzogQU1RUE9wdGlvbnMuQ29uc3VtZSk6IHZvaWQge1xuICAgIGNvbnN0IHF1ZXVlID0gdGhpcy5xdWV1ZXMuZmluZChxID0+IHEubmFtZSA9PT0gcXVldWVOYW1lKTtcblxuICAgIC8vIEVuc3VyZSBxdWV1ZSBpcyBib3VuZCB0byBjdXJyZW4gZXhjaGFuZ2VcbiAgICBpZiAoIXF1ZXVlKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUVycm9yKGBDYW5ub3Qgc3Vic2NyaWJlIHRvIHVuYm91bmQgcXVldWUgXCIke3F1ZXVlTmFtZX1cImApO1xuICAgIH1cblxuICAgIC8vIFByZXBhcmUgd3JhcHBlciBmb3IgY2hhbm5lbCBzdWJzY3JpYmVyXG4gICAgY29uc3Qgd3JhcHBlciA9IGFzeW5jIChjb250ZW50OiBhbnksIG1lc3NhZ2U6IEFNUVBNZXNzYWdlKSA9PiB7XG4gICAgICBhd2FpdCBvbkRhdGEoY29udGVudCwgbWVzc2FnZSwgbmV3IEV4Y2hhbmdlQWN0aW9ucyh0aGlzLCBtZXNzYWdlKSlcbiAgICB9O1xuXG4gICAgdGhpcy5jaGFubmVsLmNvbnN1bWUocXVldWVOYW1lLCB3cmFwcGVyLCBvcHRpb25zKTtcbiAgfVxufVxuIl19
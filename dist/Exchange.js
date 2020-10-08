"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhjaGFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvRXhjaGFuZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2REFBd0U7QUFHeEUsbUNBQTRCO0FBQzVCLG1DQUEwQztBQW9CMUMsTUFBcUIsUUFBUTtJQUkzQixZQUFtQixJQUFZLEVBQVMsT0FBc0IsRUFBUyxPQUE4QjtRQUFsRixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBRjlGLFdBQU0sR0FBa0IsRUFBRSxDQUFDO1FBR2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSw0QkFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFFbkMsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN6QztJQUNILENBQUM7SUFFRCwyQ0FBMkM7SUFDcEMsTUFBTSxDQUFPLElBQUksQ0FBTyxJQUFZLEVBQUUsT0FBc0IsRUFBRSxPQUE4Qjs7WUFDakcsTUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUV0RCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hCLGdEQUFnRDtnQkFDaEQsTUFBTSxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDN0I7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLFVBQVU7O1lBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEVBQUU7Z0JBQzVELFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbkIsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTthQUM1QixDQUFDLENBQUM7WUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBTSxJQUFJLEVBQUMsRUFBRTtnQkFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsOENBQThDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3hFLE1BQU0sS0FBSyxHQUFHLE1BQU0sZUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ3RELFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2lCQUNwQixDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFBLENBQUMsQ0FBQztZQUVILDBEQUEwRDtZQUMxRCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDVSxPQUFPLENBQUMsS0FBYSxFQUFFLElBQVUsRUFBRSxPQUE2Qjs7WUFDM0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0QsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDSSxTQUFTLENBQUMsU0FBaUIsRUFBRSxNQUFnQyxFQUFFLE9BQTZCO1FBQ2pHLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQztRQUUxRCwyQ0FBMkM7UUFDM0MsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE1BQU0sSUFBSSwrQkFBUyxDQUFDLHNDQUFzQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1NBQ3pFO1FBRUQseUNBQXlDO1FBQ3pDLE1BQU0sT0FBTyxHQUFHLENBQU8sT0FBWSxFQUFFLE9BQW9CLEVBQUUsRUFBRTtZQUMzRCxNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksdUJBQWUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUNwRSxDQUFDLENBQUEsQ0FBQztRQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNGO0FBeEVELDJCQXdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2VFcnJvciwgTG9nZ2VyLCBMb2dnZXJJbnN0YW5jZSB9IGZyb20gXCJ0cy1mcmFtZXdvcmstY29tbW9uXCI7XG5pbXBvcnQgeyBBTVFQTWVzc2FnZSwgQU1RUE9wdGlvbnMgfSBmcm9tIFwiLi9BTVFQXCI7XG5pbXBvcnQgQ2hhbm5lbCBmcm9tIFwiLi9DaGFubmVsXCI7XG5pbXBvcnQgUXVldWUgZnJvbSBcIi4vUXVldWVcIjtcbmltcG9ydCB7IEV4Y2hhbmdlQWN0aW9ucyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVJbmZvcm1hdGlvbiB7XG4gIG5hbWU6IHN0cmluZztcbiAgcm91dGVzPzogc3RyaW5nW107XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbmV4cG9ydCB0eXBlIEV4Y2hhbmdlU3Vic2NyaWJlcjxEYXRhPiA9IChkYXRhOiBEYXRhLCBtZXNzYWdlOiBBTVFQTWVzc2FnZSwgYWN0aW9uczogRXhjaGFuZ2VBY3Rpb25zPERhdGE+KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG5leHBvcnQgaW50ZXJmYWNlIEV4Y2hhbmdlT3B0aW9uczxEYXRhPiB7XG4gIGJpbmQ6IFF1ZXVlSW5mb3JtYXRpb25bXTtcbiAgdHlwZT86IHN0cmluZztcbiAgbG9nZ2VyPzogTG9nZ2VySW5zdGFuY2U7XG4gIHF1ZXVlcz86IFF1ZXVlPERhdGE+W107XG4gIHByZWZldGNoPzogbnVtYmVyO1xuICBxdWV1ZU9wdGlvbnM/OiBBTVFQT3B0aW9ucy5Bc3NlcnRRdWV1ZTtcbiAgZXhjaGFuZ2VPcHRpb25zPzogQU1RUE9wdGlvbnMuQXNzZXJ0RXhjaGFuZ2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4Y2hhbmdlPERhdGE+IHtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VySW5zdGFuY2U7XG4gIHB1YmxpYyBxdWV1ZXM6IFF1ZXVlPERhdGE+W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgY2hhbm5lbDogQ2hhbm5lbDxEYXRhPiwgcHVibGljIG9wdGlvbnM6IEV4Y2hhbmdlT3B0aW9uczxEYXRhPikge1xuICAgIHRoaXMubG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIgfHwgTG9nZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgdGhpcy5xdWV1ZXMgPSBvcHRpb25zLnF1ZXVlcyB8fCBbXTtcblxuICAgIGlmIChvcHRpb25zLnByZWZldGNoKSB7XG4gICAgICB0aGlzLmNoYW5uZWwucHJlZmV0Y2gob3B0aW9ucy5wcmVmZXRjaCk7XG4gICAgfVxuICB9XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICBwdWJsaWMgc3RhdGljIGFzeW5jIGZyb208RGF0YT4obmFtZTogc3RyaW5nLCBjaGFubmVsOiBDaGFubmVsPERhdGE+LCBvcHRpb25zOiBFeGNoYW5nZU9wdGlvbnM8RGF0YT4pOiBQcm9taXNlPEV4Y2hhbmdlPERhdGE+PiB7XG4gICAgY29uc3QgZXhjaGFuZ2UgPSBuZXcgRXhjaGFuZ2UobmFtZSwgY2hhbm5lbCwgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5iaW5kKSB7XG4gICAgICAvLyBFbnN1cmUgYWxsIHJlcXVlc3RlZCBxdWV1ZXMgZXhpc3RzIGluIGNoYW5uZWxcbiAgICAgIGF3YWl0IGV4Y2hhbmdlLmJpbmRRdWV1ZXMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXhjaGFuZ2U7XG4gIH1cblxuICAvKipcbiAgICogQmluZHMgYSBuZXcgcXVldWUgaW4gdGhlIGN1cnJlbnQgY2hhbm5lbC5cbiAgICovXG4gIGFzeW5jIGJpbmRRdWV1ZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0JpbmRpbmcgcXVldWVzIHRvIEFNUVAgZXhjaGFuZ2UgaW5zdGFuY2UnLCB7XG4gICAgICBleGNoYW5nZTogdGhpcy5uYW1lLFxuICAgICAgcXVldWVzOiB0aGlzLm9wdGlvbnMucXVldWVzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGFza3MgPSB0aGlzLm9wdGlvbnMuYmluZC5tYXAoYXN5bmMgaW5mbyA9PiB7XG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnSW5pdGlhbGl6aW5nIEFNUVAgcXVldWUgaW5zdGFuY2UgaW4gZXhjaGFuZ2UnLCBpbmZvKTtcbiAgICAgIGNvbnN0IHF1ZXVlID0gYXdhaXQgUXVldWUuZnJvbShpbmZvLm5hbWUsIHRoaXMuY2hhbm5lbCwge1xuICAgICAgICBleGNoYW5nZU5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgcm91dGVzOiBpbmZvLnJvdXRlc1xuICAgICAgfSk7XG4gICAgICB0aGlzLnF1ZXVlcy5wdXNoKHF1ZXVlKTtcbiAgICB9KTtcblxuICAgIC8vIFRPRE86IEltcHJvdmUgdGhpcyBldmVudHVhbGx5LCBwYXJhbGxlbCBtYXkgbm90IGJlIHNhZmVcbiAgICBhd2FpdCBQcm9taXNlLmFsbCh0YXNrcyk7XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGVzIGRhdGEgdG8gZXhjaGFuZ2Ugd2l0aCBzcGVjaWZpYyByb3V0aW5nLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHB1Ymxpc2gocm91dGU6IHN0cmluZywgZGF0YTogRGF0YSwgb3B0aW9ucz86IEFNUVBPcHRpb25zLlB1Ymxpc2gpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLnB1Ymxpc2godGhpcy5uYW1lLCByb3V0ZSwgZGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVucyBmb3IgbmV3IG1lc3NhZ2VzIGluIHRoZSBleGNoYW5nZS5cbiAgICovXG4gIHB1YmxpYyBzdWJzY3JpYmUocXVldWVOYW1lOiBzdHJpbmcsIG9uRGF0YTogRXhjaGFuZ2VTdWJzY3JpYmVyPERhdGE+LCBvcHRpb25zPzogQU1RUE9wdGlvbnMuQ29uc3VtZSk6IHZvaWQge1xuICAgIGNvbnN0IHF1ZXVlID0gdGhpcy5xdWV1ZXMuZmluZChxID0+IHEubmFtZSA9PT0gcXVldWVOYW1lKTtcblxuICAgIC8vIEVuc3VyZSBxdWV1ZSBpcyBib3VuZCB0byBjdXJyZW4gZXhjaGFuZ2VcbiAgICBpZiAoIXF1ZXVlKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUVycm9yKGBDYW5ub3Qgc3Vic2NyaWJlIHRvIHVuYm91bmQgcXVldWUgXCIke3F1ZXVlTmFtZX1cImApO1xuICAgIH1cblxuICAgIC8vIFByZXBhcmUgd3JhcHBlciBmb3IgY2hhbm5lbCBzdWJzY3JpYmVyXG4gICAgY29uc3Qgd3JhcHBlciA9IGFzeW5jIChjb250ZW50OiBhbnksIG1lc3NhZ2U6IEFNUVBNZXNzYWdlKSA9PiB7XG4gICAgICBhd2FpdCBvbkRhdGEoY29udGVudCwgbWVzc2FnZSwgbmV3IEV4Y2hhbmdlQWN0aW9ucyh0aGlzLCBtZXNzYWdlKSlcbiAgICB9O1xuXG4gICAgdGhpcy5jaGFubmVsLmNvbnN1bWUocXVldWVOYW1lLCB3cmFwcGVyLCBvcHRpb25zKTtcbiAgfVxufVxuIl19
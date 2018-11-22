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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhjaGFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvRXhjaGFuZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZEQUF3RDtBQUd4RCxtQ0FBNEI7QUFDNUIsbUNBQTBDO0FBb0IxQyxNQUFxQixRQUFRO0lBSTNCLFlBQW1CLElBQVksRUFBUyxPQUFzQixFQUFTLE9BQThCO1FBQWxGLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFlO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBdUI7UUFGOUYsV0FBTSxHQUFrQixFQUFFLENBQUM7UUFHaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLDRCQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUVuQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVELDJDQUEyQztJQUNwQyxNQUFNLENBQU8sSUFBSSxDQUFPLElBQVksRUFBRSxPQUFzQixFQUFFLE9BQThCOztZQUNqRyxNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXRELElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDaEIsZ0RBQWdEO2dCQUNoRCxNQUFNLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUM3QjtZQUVELE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0csVUFBVTs7WUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsRUFBRTtnQkFDNUQsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO2FBQzVCLENBQUMsQ0FBQztZQUVILE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFNLElBQUksRUFBQyxFQUFFO2dCQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEUsTUFBTSxLQUFLLEdBQUcsTUFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDdEQsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUN2QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07aUJBQ3BCLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUEsQ0FBQyxDQUFDO1lBRUgsMERBQTBEO1lBQzFELE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLE9BQU8sQ0FBQyxLQUFhLEVBQUUsSUFBSSxFQUFFLE9BQTZCOztZQUNyRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvRCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNJLFNBQVMsQ0FBQyxTQUFpQixFQUFFLE1BQWdDLEVBQUUsT0FBNkI7UUFDakcsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBRTFELDJDQUEyQztRQUMzQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsTUFBTSxJQUFJLCtCQUFTLENBQUMsc0NBQXNDLFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDekU7UUFFRCx5Q0FBeUM7UUFDekMsTUFBTSxPQUFPLEdBQUcsQ0FBTyxPQUFZLEVBQUUsT0FBb0IsRUFBRSxFQUFFO1lBQzNELE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSx1QkFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ3BFLENBQUMsQ0FBQSxDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0Y7QUF4RUQsMkJBd0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUVycm9yLCBMb2dnZXIgfSBmcm9tIFwidHMtZnJhbWV3b3JrLWNvbW1vblwiO1xuaW1wb3J0IHsgQU1RUE1lc3NhZ2UsIEFNUVBPcHRpb25zIH0gZnJvbSBcIi4vQU1RUFwiO1xuaW1wb3J0IENoYW5uZWwgZnJvbSBcIi4vQ2hhbm5lbFwiO1xuaW1wb3J0IFF1ZXVlIGZyb20gXCIuL1F1ZXVlXCI7XG5pbXBvcnQgeyBFeGNoYW5nZUFjdGlvbnMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXVlSW5mb3JtYXRpb24ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHJvdXRlcz86IHN0cmluZ1tdO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG5leHBvcnQgdHlwZSBFeGNoYW5nZVN1YnNjcmliZXI8RGF0YT4gPSAoZGF0YTogYW55LCBtZXNzYWdlOiBBTVFQTWVzc2FnZSwgYWN0aW9uczogRXhjaGFuZ2VBY3Rpb25zPERhdGE+KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG5leHBvcnQgaW50ZXJmYWNlIEV4Y2hhbmdlT3B0aW9uczxEYXRhPiB7XG4gIGJpbmQ6IFF1ZXVlSW5mb3JtYXRpb25bXTtcbiAgdHlwZT86IHN0cmluZztcbiAgbG9nZ2VyPzogTG9nZ2VyO1xuICBxdWV1ZXM/OiBRdWV1ZTxEYXRhPltdO1xuICBwcmVmZXRjaD86IG51bWJlcjtcbiAgcXVldWVPcHRpb25zPzogQU1RUE9wdGlvbnMuQXNzZXJ0UXVldWU7XG4gIGV4Y2hhbmdlT3B0aW9ucz86IEFNUVBPcHRpb25zLkFzc2VydEV4Y2hhbmdlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeGNoYW5nZTxEYXRhPiB7XG4gIHB1YmxpYyBsb2dnZXI6IExvZ2dlcjtcbiAgcHVibGljIHF1ZXVlczogUXVldWU8RGF0YT5bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBjaGFubmVsOiBDaGFubmVsPERhdGE+LCBwdWJsaWMgb3B0aW9uczogRXhjaGFuZ2VPcHRpb25zPERhdGE+KSB7XG4gICAgdGhpcy5sb2dnZXIgPSBvcHRpb25zLmxvZ2dlciB8fCBMb2dnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICB0aGlzLnF1ZXVlcyA9IG9wdGlvbnMucXVldWVzIHx8IFtdO1xuXG4gICAgaWYgKG9wdGlvbnMucHJlZmV0Y2gpIHtcbiAgICAgIHRoaXMuY2hhbm5lbC5wcmVmZXRjaChvcHRpb25zLnByZWZldGNoKTtcbiAgICB9XG4gIH1cblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gIHB1YmxpYyBzdGF0aWMgYXN5bmMgZnJvbTxEYXRhPihuYW1lOiBzdHJpbmcsIGNoYW5uZWw6IENoYW5uZWw8RGF0YT4sIG9wdGlvbnM6IEV4Y2hhbmdlT3B0aW9uczxEYXRhPik6IFByb21pc2U8RXhjaGFuZ2U8RGF0YT4+IHtcbiAgICBjb25zdCBleGNoYW5nZSA9IG5ldyBFeGNoYW5nZShuYW1lLCBjaGFubmVsLCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zLmJpbmQpIHtcbiAgICAgIC8vIEVuc3VyZSBhbGwgcmVxdWVzdGVkIHF1ZXVlcyBleGlzdHMgaW4gY2hhbm5lbFxuICAgICAgYXdhaXQgZXhjaGFuZ2UuYmluZFF1ZXVlcygpO1xuICAgIH1cblxuICAgIHJldHVybiBleGNoYW5nZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyBhIG5ldyBxdWV1ZSBpbiB0aGUgY3VycmVudCBjaGFubmVsLlxuICAgKi9cbiAgYXN5bmMgYmluZFF1ZXVlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnQmluZGluZyBxdWV1ZXMgdG8gQU1RUCBleGNoYW5nZSBpbnN0YW5jZScsIHtcbiAgICAgIGV4Y2hhbmdlOiB0aGlzLm5hbWUsXG4gICAgICBxdWV1ZXM6IHRoaXMub3B0aW9ucy5xdWV1ZXMsXG4gICAgfSk7XG5cbiAgICBjb25zdCB0YXNrcyA9IHRoaXMub3B0aW9ucy5iaW5kLm1hcChhc3luYyBpbmZvID0+IHtcbiAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdJbml0aWFsaXppbmcgQU1RUCBxdWV1ZSBpbnN0YW5jZSBpbiBleGNoYW5nZScsIGluZm8pO1xuICAgICAgY29uc3QgcXVldWUgPSBhd2FpdCBRdWV1ZS5mcm9tKGluZm8ubmFtZSwgdGhpcy5jaGFubmVsLCB7XG4gICAgICAgIGV4Y2hhbmdlTmFtZTogdGhpcy5uYW1lLFxuICAgICAgICByb3V0ZXM6IGluZm8ucm91dGVzXG4gICAgICB9KTtcbiAgICAgIHRoaXMucXVldWVzLnB1c2gocXVldWUpO1xuICAgIH0pO1xuXG4gICAgLy8gVE9ETzogSW1wcm92ZSB0aGlzIGV2ZW50dWFsbHksIHBhcmFsbGVsIG1heSBub3QgYmUgc2FmZVxuICAgIGF3YWl0IFByb21pc2UuYWxsKHRhc2tzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoZXMgZGF0YSB0byBleGNoYW5nZSB3aXRoIHNwZWNpZmljIHJvdXRpbmcuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgcHVibGlzaChyb3V0ZTogc3RyaW5nLCBkYXRhLCBvcHRpb25zPzogQU1RUE9wdGlvbnMuUHVibGlzaCkge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwucHVibGlzaCh0aGlzLm5hbWUsIHJvdXRlLCBkYXRhLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW5zIGZvciBuZXcgbWVzc2FnZXMgaW4gdGhlIGV4Y2hhbmdlLlxuICAgKi9cbiAgcHVibGljIHN1YnNjcmliZShxdWV1ZU5hbWU6IHN0cmluZywgb25EYXRhOiBFeGNoYW5nZVN1YnNjcmliZXI8RGF0YT4sIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5Db25zdW1lKTogdm9pZCB7XG4gICAgY29uc3QgcXVldWUgPSB0aGlzLnF1ZXVlcy5maW5kKHEgPT4gcS5uYW1lID09PSBxdWV1ZU5hbWUpO1xuXG4gICAgLy8gRW5zdXJlIHF1ZXVlIGlzIGJvdW5kIHRvIGN1cnJlbiBleGNoYW5nZVxuICAgIGlmICghcXVldWUpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXJyb3IoYENhbm5vdCBzdWJzY3JpYmUgdG8gdW5ib3VuZCBxdWV1ZSBcIiR7cXVldWVOYW1lfVwiYCk7XG4gICAgfVxuXG4gICAgLy8gUHJlcGFyZSB3cmFwcGVyIGZvciBjaGFubmVsIHN1YnNjcmliZXJcbiAgICBjb25zdCB3cmFwcGVyID0gYXN5bmMgKGNvbnRlbnQ6IGFueSwgbWVzc2FnZTogQU1RUE1lc3NhZ2UpID0+IHtcbiAgICAgIGF3YWl0IG9uRGF0YShjb250ZW50LCBtZXNzYWdlLCBuZXcgRXhjaGFuZ2VBY3Rpb25zKHRoaXMsIG1lc3NhZ2UpKVxuICAgIH07XG5cbiAgICB0aGlzLmNoYW5uZWwuY29uc3VtZShxdWV1ZU5hbWUsIHdyYXBwZXIsIG9wdGlvbnMpO1xuICB9XG59XG4iXX0=
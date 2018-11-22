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
const utils_1 = require("./utils");
class Queue {
    constructor(name, channel, options) {
        this.name = name;
        this.channel = channel;
        this.options = options;
        this.logger = options.logger || ts_framework_common_1.Logger.getInstance();
        this.options.routes = this.options.routes || [];
    }
    static from(name, channel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = new Queue(name, channel, options);
            yield queue.bind();
            return queue;
        });
    }
    bind() {
        return __awaiter(this, void 0, void 0, function* () {
            // Asert queue exists in current channel
            yield this.channel.assertQueue(this.name, this.options.queueOptions);
            // Bind all routes from channel
            if (this.options.routes && this.options.routes.length && this.options.exchangeName) {
                const subTasks = this.options.routes.map(route => {
                    return this.channel.bindQueue(this.name, this.options.exchangeName, route);
                });
                // TODO: Improve this eventually, parallel may not be safe
                yield Promise.all(subTasks);
            }
            else if (this.options.routes && this.options.routes.length) {
                throw new ts_framework_common_1.BaseError('Cannot bind queue to exchange without a valid name');
            }
        });
    }
    /**
     * Publishes data to queue.
     */
    publish(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.sendToQueue(this.name, data, options);
        });
    }
    /**
     * Subscribes to queue messages.
     */
    subscribe(onData, options) {
        const wrapper = (content, message) => __awaiter(this, void 0, void 0, function* () {
            yield onData(content, message, new utils_1.QueueActions(this, message));
        });
        this.channel.consume(this.name, wrapper, options);
    }
}
exports.default = Queue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvUXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZEQUF3RDtBQUd4RCxtQ0FBdUM7QUFZdkMsTUFBcUIsS0FBSztJQUd4QixZQUFtQixJQUFZLEVBQVMsT0FBc0IsRUFBUyxPQUFxQjtRQUF6RSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDMUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLDRCQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0lBQ2xELENBQUM7SUFFTSxNQUFNLENBQU8sSUFBSSxDQUFPLElBQVksRUFBRSxPQUFzQixFQUFFLE9BQXFCOztZQUN4RixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25CLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRVksSUFBSTs7WUFDZix3Q0FBd0M7WUFDeEMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFckUsK0JBQStCO1lBQy9CLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO2dCQUNsRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQy9DLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDN0UsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsMERBQTBEO2dCQUMxRCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDN0I7aUJBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQzVELE1BQU0sSUFBSSwrQkFBUyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7YUFDM0U7UUFDSCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLE9BQU8sQ0FBQyxJQUFVLEVBQUUsT0FBNkI7O1lBQzVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUQsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDSSxTQUFTLENBQUMsTUFBNkIsRUFBRSxPQUE2QjtRQUMzRSxNQUFNLE9BQU8sR0FBRyxDQUFPLE9BQVksRUFBRSxPQUFvQixFQUFFLEVBQUU7WUFDM0QsTUFBTSxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLG9CQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDakUsQ0FBQyxDQUFBLENBQUM7UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0Y7QUEvQ0Qsd0JBK0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUVycm9yLCBMb2dnZXIgfSBmcm9tIFwidHMtZnJhbWV3b3JrLWNvbW1vblwiO1xuaW1wb3J0IHsgQU1RUE1lc3NhZ2UsIEFNUVBPcHRpb25zIH0gZnJvbSBcIi4vQU1RUFwiO1xuaW1wb3J0IENoYW5uZWwgZnJvbSBcIi4vQ2hhbm5lbFwiO1xuaW1wb3J0IHsgUXVldWVBY3Rpb25zIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBRdWV1ZU9wdGlvbnMge1xuICByb3V0ZXM/OiBzdHJpbmdbXTtcbiAgbG9nZ2VyPzogTG9nZ2VyO1xuICBleGNoYW5nZU5hbWU/OiBzdHJpbmc7XG4gIHF1ZXVlT3B0aW9ucz86IEFNUVBPcHRpb25zLkFzc2VydFF1ZXVlO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG5leHBvcnQgdHlwZSBRdWV1ZVN1YnNjcmliZXI8RGF0YT4gPSAoZGF0YTogRGF0YSwgbWVzc2FnZTogQU1RUE1lc3NhZ2UsIGFjdGlvbnM6IFF1ZXVlQWN0aW9uczxEYXRhPikgPT4gUHJvbWlzZTx2b2lkPjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVldWU8RGF0YT4ge1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGNoYW5uZWw6IENoYW5uZWw8RGF0YT4sIHB1YmxpYyBvcHRpb25zOiBRdWV1ZU9wdGlvbnMpIHtcbiAgICB0aGlzLmxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyIHx8IExvZ2dlci5nZXRJbnN0YW5jZSgpO1xuICAgIHRoaXMub3B0aW9ucy5yb3V0ZXMgPSB0aGlzLm9wdGlvbnMucm91dGVzIHx8IFtdO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBhc3luYyBmcm9tPERhdGE+KG5hbWU6IHN0cmluZywgY2hhbm5lbDogQ2hhbm5lbDxEYXRhPiwgb3B0aW9uczogUXVldWVPcHRpb25zKTogUHJvbWlzZTxRdWV1ZTxEYXRhPj4ge1xuICAgIGNvbnN0IHF1ZXVlID0gbmV3IFF1ZXVlKG5hbWUsIGNoYW5uZWwsIG9wdGlvbnMpO1xuICAgIGF3YWl0IHF1ZXVlLmJpbmQoKTtcbiAgICByZXR1cm4gcXVldWU7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgYmluZCgpIHtcbiAgICAvLyBBc2VydCBxdWV1ZSBleGlzdHMgaW4gY3VycmVudCBjaGFubmVsXG4gICAgYXdhaXQgdGhpcy5jaGFubmVsLmFzc2VydFF1ZXVlKHRoaXMubmFtZSwgdGhpcy5vcHRpb25zLnF1ZXVlT3B0aW9ucyk7XG5cbiAgICAvLyBCaW5kIGFsbCByb3V0ZXMgZnJvbSBjaGFubmVsXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yb3V0ZXMgJiYgdGhpcy5vcHRpb25zLnJvdXRlcy5sZW5ndGggJiYgdGhpcy5vcHRpb25zLmV4Y2hhbmdlTmFtZSkge1xuICAgICAgY29uc3Qgc3ViVGFza3MgPSB0aGlzLm9wdGlvbnMucm91dGVzLm1hcChyb3V0ZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuYmluZFF1ZXVlKHRoaXMubmFtZSwgdGhpcy5vcHRpb25zLmV4Y2hhbmdlTmFtZSwgcm91dGUpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFRPRE86IEltcHJvdmUgdGhpcyBldmVudHVhbGx5LCBwYXJhbGxlbCBtYXkgbm90IGJlIHNhZmVcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHN1YlRhc2tzKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5yb3V0ZXMgJiYgdGhpcy5vcHRpb25zLnJvdXRlcy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXJyb3IoJ0Nhbm5vdCBiaW5kIHF1ZXVlIHRvIGV4Y2hhbmdlIHdpdGhvdXQgYSB2YWxpZCBuYW1lJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2hlcyBkYXRhIHRvIHF1ZXVlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHB1Ymxpc2goZGF0YTogRGF0YSwgb3B0aW9ucz86IEFNUVBPcHRpb25zLlB1Ymxpc2gpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLnNlbmRUb1F1ZXVlKHRoaXMubmFtZSwgZGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byBxdWV1ZSBtZXNzYWdlcy5cbiAgICovXG4gIHB1YmxpYyBzdWJzY3JpYmUob25EYXRhOiBRdWV1ZVN1YnNjcmliZXI8RGF0YT4sIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5Db25zdW1lKTogdm9pZCB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGFzeW5jIChjb250ZW50OiBhbnksIG1lc3NhZ2U6IEFNUVBNZXNzYWdlKSA9PiB7XG4gICAgICBhd2FpdCBvbkRhdGEoY29udGVudCwgbWVzc2FnZSwgbmV3IFF1ZXVlQWN0aW9ucyh0aGlzLCBtZXNzYWdlKSlcbiAgICB9O1xuICAgIHRoaXMuY2hhbm5lbC5jb25zdW1lKHRoaXMubmFtZSwgd3JhcHBlciwgb3B0aW9ucyk7XG4gIH1cbn0iXX0=
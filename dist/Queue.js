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
            yield this.assert();
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
     * Assert queue in the channel.
     */
    assert() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.assertQueue(this.name, this.options.queueOptions);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvUXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZEQUF3RTtBQUd4RSxtQ0FBdUM7QUFZdkMsTUFBcUIsS0FBSztJQUd4QixZQUFtQixJQUFZLEVBQVMsT0FBc0IsRUFBUyxPQUFxQjtRQUF6RSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDMUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLDRCQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0lBQ2xELENBQUM7SUFFTSxNQUFNLENBQU8sSUFBSSxDQUFPLElBQVksRUFBRSxPQUFzQixFQUFFLE9BQXFCOztZQUN4RixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25CLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRVksSUFBSTs7WUFDZix3Q0FBd0M7WUFDeEMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFcEIsK0JBQStCO1lBQy9CLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO2dCQUNsRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQy9DLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDN0UsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsMERBQTBEO2dCQUMxRCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDN0I7aUJBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQzVELE1BQU0sSUFBSSwrQkFBUyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7YUFDM0U7UUFDSCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLE1BQU07O1lBQ2pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3hFLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1UsT0FBTyxDQUFDLElBQVUsRUFBRSxPQUE2Qjs7WUFDNUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNJLFNBQVMsQ0FBQyxNQUE2QixFQUFFLE9BQTZCO1FBQzNFLE1BQU0sT0FBTyxHQUFHLENBQU8sT0FBWSxFQUFFLE9BQW9CLEVBQUUsRUFBRTtZQUMzRCxNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksb0JBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUNqRSxDQUFDLENBQUEsQ0FBQztRQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELENBQUM7Q0FDRjtBQXRERCx3QkFzREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlRXJyb3IsIExvZ2dlciwgTG9nZ2VySW5zdGFuY2UgfSBmcm9tIFwidHMtZnJhbWV3b3JrLWNvbW1vblwiO1xuaW1wb3J0IHsgQU1RUE1lc3NhZ2UsIEFNUVBPcHRpb25zIH0gZnJvbSBcIi4vQU1RUFwiO1xuaW1wb3J0IENoYW5uZWwgZnJvbSBcIi4vQ2hhbm5lbFwiO1xuaW1wb3J0IHsgUXVldWVBY3Rpb25zIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBRdWV1ZU9wdGlvbnMge1xuICByb3V0ZXM/OiBzdHJpbmdbXTtcbiAgbG9nZ2VyPzogTG9nZ2VySW5zdGFuY2U7XG4gIGV4Y2hhbmdlTmFtZT86IHN0cmluZztcbiAgcXVldWVPcHRpb25zPzogQU1RUE9wdGlvbnMuQXNzZXJ0UXVldWU7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbmV4cG9ydCB0eXBlIFF1ZXVlU3Vic2NyaWJlcjxEYXRhPiA9IChkYXRhOiBEYXRhLCBtZXNzYWdlOiBBTVFQTWVzc2FnZSwgYWN0aW9uczogUXVldWVBY3Rpb25zPERhdGE+KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWV1ZTxEYXRhPiB7XG4gIHB1YmxpYyBsb2dnZXI6IExvZ2dlckluc3RhbmNlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBjaGFubmVsOiBDaGFubmVsPERhdGE+LCBwdWJsaWMgb3B0aW9uczogUXVldWVPcHRpb25zKSB7XG4gICAgdGhpcy5sb2dnZXIgPSBvcHRpb25zLmxvZ2dlciB8fCBMb2dnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICB0aGlzLm9wdGlvbnMucm91dGVzID0gdGhpcy5vcHRpb25zLnJvdXRlcyB8fCBbXTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgYXN5bmMgZnJvbTxEYXRhPihuYW1lOiBzdHJpbmcsIGNoYW5uZWw6IENoYW5uZWw8RGF0YT4sIG9wdGlvbnM6IFF1ZXVlT3B0aW9ucyk6IFByb21pc2U8UXVldWU8RGF0YT4+IHtcbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBRdWV1ZShuYW1lLCBjaGFubmVsLCBvcHRpb25zKTtcbiAgICBhd2FpdCBxdWV1ZS5iaW5kKCk7XG4gICAgcmV0dXJuIHF1ZXVlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGJpbmQoKSB7XG4gICAgLy8gQXNlcnQgcXVldWUgZXhpc3RzIGluIGN1cnJlbnQgY2hhbm5lbFxuICAgIGF3YWl0IHRoaXMuYXNzZXJ0KCk7XG5cbiAgICAvLyBCaW5kIGFsbCByb3V0ZXMgZnJvbSBjaGFubmVsXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yb3V0ZXMgJiYgdGhpcy5vcHRpb25zLnJvdXRlcy5sZW5ndGggJiYgdGhpcy5vcHRpb25zLmV4Y2hhbmdlTmFtZSkge1xuICAgICAgY29uc3Qgc3ViVGFza3MgPSB0aGlzLm9wdGlvbnMucm91dGVzLm1hcChyb3V0ZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuYmluZFF1ZXVlKHRoaXMubmFtZSwgdGhpcy5vcHRpb25zLmV4Y2hhbmdlTmFtZSwgcm91dGUpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFRPRE86IEltcHJvdmUgdGhpcyBldmVudHVhbGx5LCBwYXJhbGxlbCBtYXkgbm90IGJlIHNhZmVcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHN1YlRhc2tzKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5yb3V0ZXMgJiYgdGhpcy5vcHRpb25zLnJvdXRlcy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXJyb3IoJ0Nhbm5vdCBiaW5kIHF1ZXVlIHRvIGV4Y2hhbmdlIHdpdGhvdXQgYSB2YWxpZCBuYW1lJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydCBxdWV1ZSBpbiB0aGUgY2hhbm5lbC5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBhc3NlcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5hc3NlcnRRdWV1ZSh0aGlzLm5hbWUsIHRoaXMub3B0aW9ucy5xdWV1ZU9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2hlcyBkYXRhIHRvIHF1ZXVlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHB1Ymxpc2goZGF0YTogRGF0YSwgb3B0aW9ucz86IEFNUVBPcHRpb25zLlB1Ymxpc2gpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLnNlbmRUb1F1ZXVlKHRoaXMubmFtZSwgZGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byBxdWV1ZSBtZXNzYWdlcy5cbiAgICovXG4gIHB1YmxpYyBzdWJzY3JpYmUob25EYXRhOiBRdWV1ZVN1YnNjcmliZXI8RGF0YT4sIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5Db25zdW1lKTogdm9pZCB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGFzeW5jIChjb250ZW50OiBhbnksIG1lc3NhZ2U6IEFNUVBNZXNzYWdlKSA9PiB7XG4gICAgICBhd2FpdCBvbkRhdGEoY29udGVudCwgbWVzc2FnZSwgbmV3IFF1ZXVlQWN0aW9ucyh0aGlzLCBtZXNzYWdlKSlcbiAgICB9O1xuICAgIHRoaXMuY2hhbm5lbC5jb25zdW1lKHRoaXMubmFtZSwgd3JhcHBlciwgb3B0aW9ucyk7XG4gIH1cbn0iXX0=
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvUXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZEQUF3RDtBQUd4RCxtQ0FBdUM7QUFZdkMsTUFBcUIsS0FBSztJQUd4QixZQUFtQixJQUFZLEVBQVMsT0FBc0IsRUFBUyxPQUFxQjtRQUF6RSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDMUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLDRCQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0lBQ2xELENBQUM7SUFFTSxNQUFNLENBQU8sSUFBSSxDQUFPLElBQVksRUFBRSxPQUFzQixFQUFFLE9BQXFCOztZQUN4RixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25CLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRVksSUFBSTs7WUFDZix3Q0FBd0M7WUFDeEMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFckUsK0JBQStCO1lBQy9CLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO2dCQUNsRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQy9DLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDN0UsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsMERBQTBEO2dCQUMxRCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDN0I7aUJBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQzVELE1BQU0sSUFBSSwrQkFBUyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7YUFDM0U7UUFDSCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLE9BQU8sQ0FBQyxJQUFTLEVBQUUsT0FBNkI7O1lBQzNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUQsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDSSxTQUFTLENBQUMsTUFBNkIsRUFBRSxPQUE2QjtRQUMzRSxNQUFNLE9BQU8sR0FBRyxDQUFPLE9BQVksRUFBRSxPQUFvQixFQUFFLEVBQUU7WUFDM0QsTUFBTSxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLG9CQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDakUsQ0FBQyxDQUFBLENBQUM7UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0Y7QUEvQ0Qsd0JBK0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUVycm9yLCBMb2dnZXIgfSBmcm9tIFwidHMtZnJhbWV3b3JrLWNvbW1vblwiO1xuaW1wb3J0IHsgQU1RUE1lc3NhZ2UsIEFNUVBPcHRpb25zIH0gZnJvbSBcIi4vQU1RUFwiO1xuaW1wb3J0IENoYW5uZWwgZnJvbSBcIi4vQ2hhbm5lbFwiO1xuaW1wb3J0IHsgUXVldWVBY3Rpb25zIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBRdWV1ZU9wdGlvbnMge1xuICByb3V0ZXM/OiBzdHJpbmdbXTtcbiAgbG9nZ2VyPzogTG9nZ2VyO1xuICBleGNoYW5nZU5hbWU/OiBzdHJpbmc7XG4gIHF1ZXVlT3B0aW9ucz86IEFNUVBPcHRpb25zLkFzc2VydFF1ZXVlO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG5leHBvcnQgdHlwZSBRdWV1ZVN1YnNjcmliZXI8RGF0YT4gPSAoZGF0YTogYW55LCBtZXNzYWdlOiBBTVFQTWVzc2FnZSwgYWN0aW9uczogUXVldWVBY3Rpb25zPERhdGE+KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWV1ZTxEYXRhPiB7XG4gIHB1YmxpYyBsb2dnZXI6IExvZ2dlcjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgY2hhbm5lbDogQ2hhbm5lbDxEYXRhPiwgcHVibGljIG9wdGlvbnM6IFF1ZXVlT3B0aW9ucykge1xuICAgIHRoaXMubG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIgfHwgTG9nZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgdGhpcy5vcHRpb25zLnJvdXRlcyA9IHRoaXMub3B0aW9ucy5yb3V0ZXMgfHwgW107XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGFzeW5jIGZyb208RGF0YT4obmFtZTogc3RyaW5nLCBjaGFubmVsOiBDaGFubmVsPERhdGE+LCBvcHRpb25zOiBRdWV1ZU9wdGlvbnMpOiBQcm9taXNlPFF1ZXVlPERhdGE+PiB7XG4gICAgY29uc3QgcXVldWUgPSBuZXcgUXVldWUobmFtZSwgY2hhbm5lbCwgb3B0aW9ucyk7XG4gICAgYXdhaXQgcXVldWUuYmluZCgpO1xuICAgIHJldHVybiBxdWV1ZTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBiaW5kKCkge1xuICAgIC8vIEFzZXJ0IHF1ZXVlIGV4aXN0cyBpbiBjdXJyZW50IGNoYW5uZWxcbiAgICBhd2FpdCB0aGlzLmNoYW5uZWwuYXNzZXJ0UXVldWUodGhpcy5uYW1lLCB0aGlzLm9wdGlvbnMucXVldWVPcHRpb25zKTtcblxuICAgIC8vIEJpbmQgYWxsIHJvdXRlcyBmcm9tIGNoYW5uZWxcbiAgICBpZiAodGhpcy5vcHRpb25zLnJvdXRlcyAmJiB0aGlzLm9wdGlvbnMucm91dGVzLmxlbmd0aCAmJiB0aGlzLm9wdGlvbnMuZXhjaGFuZ2VOYW1lKSB7XG4gICAgICBjb25zdCBzdWJUYXNrcyA9IHRoaXMub3B0aW9ucy5yb3V0ZXMubWFwKHJvdXRlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5iaW5kUXVldWUodGhpcy5uYW1lLCB0aGlzLm9wdGlvbnMuZXhjaGFuZ2VOYW1lLCByb3V0ZSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gVE9ETzogSW1wcm92ZSB0aGlzIGV2ZW50dWFsbHksIHBhcmFsbGVsIG1heSBub3QgYmUgc2FmZVxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoc3ViVGFza3MpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnJvdXRlcyAmJiB0aGlzLm9wdGlvbnMucm91dGVzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFcnJvcignQ2Fubm90IGJpbmQgcXVldWUgdG8gZXhjaGFuZ2Ugd2l0aG91dCBhIHZhbGlkIG5hbWUnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGVzIGRhdGEgdG8gcXVldWUuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgcHVibGlzaChkYXRhOiBhbnksIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5QdWJsaXNoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5zZW5kVG9RdWV1ZSh0aGlzLm5hbWUsIGRhdGEsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gcXVldWUgbWVzc2FnZXMuXG4gICAqL1xuICBwdWJsaWMgc3Vic2NyaWJlKG9uRGF0YTogUXVldWVTdWJzY3JpYmVyPERhdGE+LCBvcHRpb25zPzogQU1RUE9wdGlvbnMuQ29uc3VtZSk6IHZvaWQge1xuICAgIGNvbnN0IHdyYXBwZXIgPSBhc3luYyAoY29udGVudDogYW55LCBtZXNzYWdlOiBBTVFQTWVzc2FnZSkgPT4ge1xuICAgICAgYXdhaXQgb25EYXRhKGNvbnRlbnQsIG1lc3NhZ2UsIG5ldyBRdWV1ZUFjdGlvbnModGhpcywgbWVzc2FnZSkpXG4gICAgfTtcbiAgICB0aGlzLmNoYW5uZWwuY29uc3VtZSh0aGlzLm5hbWUsIHdyYXBwZXIsIG9wdGlvbnMpO1xuICB9XG59Il19
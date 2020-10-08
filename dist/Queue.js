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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvUXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2REFBd0U7QUFHeEUsbUNBQXVDO0FBWXZDLE1BQXFCLEtBQUs7SUFHeEIsWUFBbUIsSUFBWSxFQUFTLE9BQXNCLEVBQVMsT0FBcUI7UUFBekUsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFjO1FBQzFGLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSw0QkFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0lBRU0sTUFBTSxDQUFPLElBQUksQ0FBTyxJQUFZLEVBQUUsT0FBc0IsRUFBRSxPQUFxQjs7WUFDeEYsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNoRCxNQUFNLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNuQixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7S0FBQTtJQUVZLElBQUk7O1lBQ2Ysd0NBQXdDO1lBQ3hDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRXBCLCtCQUErQjtZQUMvQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtnQkFDbEYsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUMvQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzdFLENBQUMsQ0FBQyxDQUFDO2dCQUVILDBEQUEwRDtnQkFDMUQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzdCO2lCQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUM1RCxNQUFNLElBQUksK0JBQVMsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO2FBQzNFO1FBQ0gsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDVSxNQUFNOztZQUNqQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4RSxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLE9BQU8sQ0FBQyxJQUFVLEVBQUUsT0FBNkI7O1lBQzVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUQsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDSSxTQUFTLENBQUMsTUFBNkIsRUFBRSxPQUE2QjtRQUMzRSxNQUFNLE9BQU8sR0FBRyxDQUFPLE9BQVksRUFBRSxPQUFvQixFQUFFLEVBQUU7WUFDM0QsTUFBTSxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLG9CQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDakUsQ0FBQyxDQUFBLENBQUM7UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0Y7QUF0REQsd0JBc0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUVycm9yLCBMb2dnZXIsIExvZ2dlckluc3RhbmNlIH0gZnJvbSBcInRzLWZyYW1ld29yay1jb21tb25cIjtcbmltcG9ydCB7IEFNUVBNZXNzYWdlLCBBTVFQT3B0aW9ucyB9IGZyb20gXCIuL0FNUVBcIjtcbmltcG9ydCBDaGFubmVsIGZyb20gXCIuL0NoYW5uZWxcIjtcbmltcG9ydCB7IFF1ZXVlQWN0aW9ucyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVPcHRpb25zIHtcbiAgcm91dGVzPzogc3RyaW5nW107XG4gIGxvZ2dlcj86IExvZ2dlckluc3RhbmNlO1xuICBleGNoYW5nZU5hbWU/OiBzdHJpbmc7XG4gIHF1ZXVlT3B0aW9ucz86IEFNUVBPcHRpb25zLkFzc2VydFF1ZXVlO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG5leHBvcnQgdHlwZSBRdWV1ZVN1YnNjcmliZXI8RGF0YT4gPSAoZGF0YTogRGF0YSwgbWVzc2FnZTogQU1RUE1lc3NhZ2UsIGFjdGlvbnM6IFF1ZXVlQWN0aW9uczxEYXRhPikgPT4gUHJvbWlzZTx2b2lkPjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVldWU8RGF0YT4ge1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXJJbnN0YW5jZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgY2hhbm5lbDogQ2hhbm5lbDxEYXRhPiwgcHVibGljIG9wdGlvbnM6IFF1ZXVlT3B0aW9ucykge1xuICAgIHRoaXMubG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIgfHwgTG9nZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgdGhpcy5vcHRpb25zLnJvdXRlcyA9IHRoaXMub3B0aW9ucy5yb3V0ZXMgfHwgW107XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGFzeW5jIGZyb208RGF0YT4obmFtZTogc3RyaW5nLCBjaGFubmVsOiBDaGFubmVsPERhdGE+LCBvcHRpb25zOiBRdWV1ZU9wdGlvbnMpOiBQcm9taXNlPFF1ZXVlPERhdGE+PiB7XG4gICAgY29uc3QgcXVldWUgPSBuZXcgUXVldWUobmFtZSwgY2hhbm5lbCwgb3B0aW9ucyk7XG4gICAgYXdhaXQgcXVldWUuYmluZCgpO1xuICAgIHJldHVybiBxdWV1ZTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBiaW5kKCkge1xuICAgIC8vIEFzZXJ0IHF1ZXVlIGV4aXN0cyBpbiBjdXJyZW50IGNoYW5uZWxcbiAgICBhd2FpdCB0aGlzLmFzc2VydCgpO1xuXG4gICAgLy8gQmluZCBhbGwgcm91dGVzIGZyb20gY2hhbm5lbFxuICAgIGlmICh0aGlzLm9wdGlvbnMucm91dGVzICYmIHRoaXMub3B0aW9ucy5yb3V0ZXMubGVuZ3RoICYmIHRoaXMub3B0aW9ucy5leGNoYW5nZU5hbWUpIHtcbiAgICAgIGNvbnN0IHN1YlRhc2tzID0gdGhpcy5vcHRpb25zLnJvdXRlcy5tYXAocm91dGUgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFubmVsLmJpbmRRdWV1ZSh0aGlzLm5hbWUsIHRoaXMub3B0aW9ucy5leGNoYW5nZU5hbWUsIHJvdXRlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUT0RPOiBJbXByb3ZlIHRoaXMgZXZlbnR1YWxseSwgcGFyYWxsZWwgbWF5IG5vdCBiZSBzYWZlXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChzdWJUYXNrcyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMucm91dGVzICYmIHRoaXMub3B0aW9ucy5yb3V0ZXMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUVycm9yKCdDYW5ub3QgYmluZCBxdWV1ZSB0byBleGNoYW5nZSB3aXRob3V0IGEgdmFsaWQgbmFtZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgcXVldWUgaW4gdGhlIGNoYW5uZWwuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgYXNzZXJ0KCkge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuYXNzZXJ0UXVldWUodGhpcy5uYW1lLCB0aGlzLm9wdGlvbnMucXVldWVPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoZXMgZGF0YSB0byBxdWV1ZS5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBwdWJsaXNoKGRhdGE6IERhdGEsIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5QdWJsaXNoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5zZW5kVG9RdWV1ZSh0aGlzLm5hbWUsIGRhdGEsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gcXVldWUgbWVzc2FnZXMuXG4gICAqL1xuICBwdWJsaWMgc3Vic2NyaWJlKG9uRGF0YTogUXVldWVTdWJzY3JpYmVyPERhdGE+LCBvcHRpb25zPzogQU1RUE9wdGlvbnMuQ29uc3VtZSk6IHZvaWQge1xuICAgIGNvbnN0IHdyYXBwZXIgPSBhc3luYyAoY29udGVudDogYW55LCBtZXNzYWdlOiBBTVFQTWVzc2FnZSkgPT4ge1xuICAgICAgYXdhaXQgb25EYXRhKGNvbnRlbnQsIG1lc3NhZ2UsIG5ldyBRdWV1ZUFjdGlvbnModGhpcywgbWVzc2FnZSkpXG4gICAgfTtcbiAgICB0aGlzLmNoYW5uZWwuY29uc3VtZSh0aGlzLm5hbWUsIHdyYXBwZXIsIG9wdGlvbnMpO1xuICB9XG59Il19
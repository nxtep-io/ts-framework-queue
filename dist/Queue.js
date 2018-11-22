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
            if (this.options.routes && this.options.routes.length) {
                const subTasks = this.options.routes.map(route => {
                    return this.channel.bindQueue(this.name, this.options.exchangeName, route);
                });
                // TODO: Improve this eventually, parallel may not be safe
                yield Promise.all(subTasks);
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
}
exports.default = Queue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvUXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZEQUE2QztBQVc3QyxNQUFxQixLQUFLO0lBR3hCLFlBQW1CLElBQVksRUFBUyxPQUFzQixFQUFTLE9BQXFCO1FBQXpFLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFlO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUMxRixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksNEJBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVNLE1BQU0sQ0FBTyxJQUFJLENBQU8sSUFBWSxFQUFFLE9BQXNCLEVBQUUsT0FBcUI7O1lBQ3hGLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDaEQsTUFBTSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkIsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO0tBQUE7SUFFWSxJQUFJOztZQUNmLHdDQUF3QztZQUN4QyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVyRSwrQkFBK0I7WUFDL0IsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDL0MsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM3RSxDQUFDLENBQUMsQ0FBQztnQkFFSCwwREFBMEQ7Z0JBQzFELE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1UsT0FBTyxDQUFDLElBQVMsRUFBRSxPQUE2Qjs7WUFDM0QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RCxDQUFDO0tBQUE7Q0FDRjtBQW5DRCx3QkFtQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwidHMtZnJhbWV3b3JrLWNvbW1vblwiO1xuaW1wb3J0IHsgQU1RUE9wdGlvbnMgfSBmcm9tIFwiLi9BTVFQXCI7XG5pbXBvcnQgQ2hhbm5lbCBmcm9tIFwiLi9DaGFubmVsXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVPcHRpb25zIHtcbiAgZXhjaGFuZ2VOYW1lOiBzdHJpbmc7XG4gIHJvdXRlcz86IHN0cmluZ1tdO1xuICBsb2dnZXI/OiBMb2dnZXI7XG4gIHF1ZXVlT3B0aW9ucz86IEFNUVBPcHRpb25zLkFzc2VydFF1ZXVlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWV1ZTxEYXRhPiB7XG4gIHB1YmxpYyBsb2dnZXI6IExvZ2dlcjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgY2hhbm5lbDogQ2hhbm5lbDxEYXRhPiwgcHVibGljIG9wdGlvbnM6IFF1ZXVlT3B0aW9ucykge1xuICAgIHRoaXMubG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIgfHwgTG9nZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgdGhpcy5vcHRpb25zLnJvdXRlcyA9IHRoaXMub3B0aW9ucy5yb3V0ZXMgfHwgW107XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGFzeW5jIGZyb208RGF0YT4obmFtZTogc3RyaW5nLCBjaGFubmVsOiBDaGFubmVsPERhdGE+LCBvcHRpb25zOiBRdWV1ZU9wdGlvbnMpOiBQcm9taXNlPFF1ZXVlPERhdGE+PiB7XG4gICAgY29uc3QgcXVldWUgPSBuZXcgUXVldWUobmFtZSwgY2hhbm5lbCwgb3B0aW9ucyk7XG4gICAgYXdhaXQgcXVldWUuYmluZCgpO1xuICAgIHJldHVybiBxdWV1ZTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBiaW5kKCkge1xuICAgIC8vIEFzZXJ0IHF1ZXVlIGV4aXN0cyBpbiBjdXJyZW50IGNoYW5uZWxcbiAgICBhd2FpdCB0aGlzLmNoYW5uZWwuYXNzZXJ0UXVldWUodGhpcy5uYW1lLCB0aGlzLm9wdGlvbnMucXVldWVPcHRpb25zKTtcblxuICAgIC8vIEJpbmQgYWxsIHJvdXRlcyBmcm9tIGNoYW5uZWxcbiAgICBpZiAodGhpcy5vcHRpb25zLnJvdXRlcyAmJiB0aGlzLm9wdGlvbnMucm91dGVzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgc3ViVGFza3MgPSB0aGlzLm9wdGlvbnMucm91dGVzLm1hcChyb3V0ZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuYmluZFF1ZXVlKHRoaXMubmFtZSwgdGhpcy5vcHRpb25zLmV4Y2hhbmdlTmFtZSwgcm91dGUpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFRPRE86IEltcHJvdmUgdGhpcyBldmVudHVhbGx5LCBwYXJhbGxlbCBtYXkgbm90IGJlIHNhZmVcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHN1YlRhc2tzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGVzIGRhdGEgdG8gcXVldWUuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgcHVibGlzaChkYXRhOiBhbnksIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5QdWJsaXNoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5zZW5kVG9RdWV1ZSh0aGlzLm5hbWUsIGRhdGEsIG9wdGlvbnMpO1xuICB9XG59Il19
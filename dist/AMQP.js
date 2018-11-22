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
const amqplib_1 = require("amqplib");
const ts_framework_common_1 = require("ts-framework-common");
const Channel_1 = require("./Channel");
exports.NACK_TIMEOUT = 30000;
class AMQPService extends ts_framework_common_1.Database {
    constructor(options) {
        super(options);
        this.channels = [];
    }
    isConnected() {
        return !!this.connection;
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prepare connection and channel for messaging
            this.connection = yield amqplib_1.connect(this.options.host || "amqp://localhost", options);
            return this.options;
        });
    }
    channel(name, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            let channel = this.channels.find(channel => channel.options.name === name);
            if (!channel) {
                channel = yield Channel_1.default.from(this.connection, Object.assign({ logger: this.logger }, options));
                this.channels.push(channel);
            }
            return channel;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            // Close all available channels
            if (this.channels) {
                const tasks = this.channels.map(channel => channel.close());
                yield Promise.all(tasks);
                this.channels = [];
            }
            // Close the connection
            yield this.connection.close();
            this.connection = undefined;
        });
    }
    ensureConnection() {
        if (!this.isConnected()) {
            throw new Error("Channel is not available, queue may not be connected");
        }
    }
    entities() {
        return {};
    }
}
exports.default = AMQPService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQU1RUC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9BTVFQLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQ0FBOEY7QUFDOUYsNkRBQWdFO0FBQ2hFLHVDQUFvRDtBQUV2QyxRQUFBLFlBQVksR0FBRyxLQUFLLENBQUM7QUFnQmxDLE1BQXFCLFdBQWtCLFNBQVEsOEJBQVE7SUFLckQsWUFBWSxPQUEyQjtRQUNyQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFIUCxhQUFRLEdBQW9CLEVBQUUsQ0FBQztJQUl6QyxDQUFDO0lBRUQsV0FBVztRQUNULE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVLLE9BQU8sQ0FBQyxPQUE2Qjs7WUFDekMsK0NBQStDO1lBQy9DLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxpQkFBTyxDQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxrQkFBa0IsRUFDdkMsT0FBTyxDQUNSLENBQUM7WUFDRixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLElBQVksRUFBRSxPQUE4Qjs7WUFDeEQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDeEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztZQUUzRSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLE9BQU8sR0FBRyxNQUFNLGlCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLGtCQUFJLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFLLE9BQU8sRUFBRyxDQUFDO2dCQUNuRixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM3QjtZQUVELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7S0FBQTtJQUVLLFVBQVU7O1lBQ2QsK0JBQStCO1lBQy9CLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzthQUNwQjtZQUVELHVCQUF1QjtZQUN2QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDOUIsQ0FBQztLQUFBO0lBRVMsZ0JBQWdCO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1NBQ3pFO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7Q0FDRjtBQXhERCw4QkF3REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb25uZWN0LCBDb25uZWN0aW9uLCBPcHRpb25zIGFzIEFNUVBPcHRpb25zLCBNZXNzYWdlIGFzIEFNUVBNZXNzYWdlIH0gZnJvbSBcImFtcXBsaWJcIjtcbmltcG9ydCB7IERhdGFiYXNlLCBEYXRhYmFzZU9wdGlvbnMgfSBmcm9tIFwidHMtZnJhbWV3b3JrLWNvbW1vblwiO1xuaW1wb3J0IENoYW5uZWwsIHsgQ2hhbm5lbE9wdGlvbnMgfSBmcm9tIFwiLi9DaGFubmVsXCI7XG5cbmV4cG9ydCBjb25zdCBOQUNLX1RJTUVPVVQgPSAzMDAwMDtcblxuZXhwb3J0IHsgQU1RUE9wdGlvbnMsIEFNUVBNZXNzYWdlfTtcblxuZXhwb3J0IGludGVyZmFjZSBBTVFQQWN0aW9uczxEYXRhPiB7XG4gIGFjayhhbGxVcFRvPzogYm9vbGVhbik6IFByb21pc2U8dm9pZD47XG4gIG5hY2soYWxsVXBUbz86IGJvb2xlYW4sIHJlcXVldWU/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPjtcbiAgcHVibGlzaChyb3V0ZTogc3RyaW5nLCBkYXRhOiBEYXRhLCBvcHRpb25zPzogQU1RUE9wdGlvbnMuUHVibGlzaCk6IFByb21pc2U8Ym9vbGVhbj47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQU1RUFNlcnZpY2VPcHRpb25zIGV4dGVuZHMgRGF0YWJhc2VPcHRpb25zIHtcbiAgaG9zdD86IHN0cmluZztcbiAgbmFja1RpbWVvdXQ/OiBudW1iZXI7XG4gIG1lc3NhZ2VUaW1lVG9MaXZlPzogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBTVFQU2VydmljZTxEYXRhPiBleHRlbmRzIERhdGFiYXNlIHtcbiAgcHVibGljIG9wdGlvbnM6IEFNUVBTZXJ2aWNlT3B0aW9ucztcbiAgcHJvdGVjdGVkIGNvbm5lY3Rpb24/OiBDb25uZWN0aW9uO1xuICBwcm90ZWN0ZWQgY2hhbm5lbHM6IENoYW5uZWw8RGF0YT5bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFNUVBTZXJ2aWNlT3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICB9XG5cbiAgaXNDb25uZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5jb25uZWN0aW9uO1xuICB9XG5cbiAgYXN5bmMgY29ubmVjdChvcHRpb25zPzogQU1RUE9wdGlvbnMuQ29ubmVjdCk6IFByb21pc2U8RGF0YWJhc2VPcHRpb25zPiB7XG4gICAgLy8gUHJlcGFyZSBjb25uZWN0aW9uIGFuZCBjaGFubmVsIGZvciBtZXNzYWdpbmdcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBhd2FpdCBjb25uZWN0KFxuICAgICAgdGhpcy5vcHRpb25zLmhvc3QgfHwgXCJhbXFwOi8vbG9jYWxob3N0XCIsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICB9XG5cbiAgYXN5bmMgY2hhbm5lbChuYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBDaGFubmVsT3B0aW9uczxEYXRhPik6IFByb21pc2U8Q2hhbm5lbDxEYXRhPj4ge1xuICAgIHRoaXMuZW5zdXJlQ29ubmVjdGlvbigpO1xuICAgIGxldCBjaGFubmVsID0gdGhpcy5jaGFubmVscy5maW5kKGNoYW5uZWwgPT4gY2hhbm5lbC5vcHRpb25zLm5hbWUgPT09IG5hbWUpO1xuXG4gICAgaWYgKCFjaGFubmVsKSB7XG4gICAgICBjaGFubmVsID0gYXdhaXQgQ2hhbm5lbC5mcm9tKHRoaXMuY29ubmVjdGlvbiwgeyBsb2dnZXI6IHRoaXMubG9nZ2VyLCAuLi5vcHRpb25zIH0pO1xuICAgICAgdGhpcy5jaGFubmVscy5wdXNoKGNoYW5uZWwpO1xuICAgIH1cblxuICAgIHJldHVybiBjaGFubmVsO1xuICB9XG5cbiAgYXN5bmMgZGlzY29ubmVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBDbG9zZSBhbGwgYXZhaWxhYmxlIGNoYW5uZWxzXG4gICAgaWYgKHRoaXMuY2hhbm5lbHMpIHtcbiAgICAgIGNvbnN0IHRhc2tzID0gdGhpcy5jaGFubmVscy5tYXAoY2hhbm5lbCA9PiBjaGFubmVsLmNsb3NlKCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwodGFza3MpO1xuICAgICAgdGhpcy5jaGFubmVscyA9IFtdO1xuICAgIH1cblxuICAgIC8vIENsb3NlIHRoZSBjb25uZWN0aW9uXG4gICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLmNsb3NlKCk7XG4gICAgdGhpcy5jb25uZWN0aW9uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJvdGVjdGVkIGVuc3VyZUNvbm5lY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNoYW5uZWwgaXMgbm90IGF2YWlsYWJsZSwgcXVldWUgbWF5IG5vdCBiZSBjb25uZWN0ZWRcIik7XG4gICAgfVxuICB9XG5cbiAgZW50aXRpZXMoKTogeyBbbmFtZTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuIl19
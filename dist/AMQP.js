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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQU1RUC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9BTVFQLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQ0FBOEY7QUFDOUYsNkRBQWdFO0FBQ2hFLHVDQUFvRDtBQUV2QyxRQUFBLFlBQVksR0FBRyxLQUFLLENBQUM7QUFVbEMsTUFBcUIsV0FBa0IsU0FBUSw4QkFBUTtJQUtyRCxZQUFZLE9BQTJCO1FBQ3JDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUhQLGFBQVEsR0FBb0IsRUFBRSxDQUFDO0lBSXpDLENBQUM7SUFFRCxXQUFXO1FBQ1QsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRUssT0FBTyxDQUFDLE9BQTZCOztZQUN6QywrQ0FBK0M7WUFDL0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLGlCQUFPLENBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLGtCQUFrQixFQUN2QyxPQUFPLENBQ1IsQ0FBQztZQUNGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsSUFBWSxFQUFFLE9BQThCOztZQUN4RCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO1lBRTNFLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ1osT0FBTyxHQUFHLE1BQU0saUJBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsa0JBQUksTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUssT0FBTyxFQUFHLENBQUM7Z0JBQ25GLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzdCO1lBRUQsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztLQUFBO0lBRUssVUFBVTs7WUFDZCwrQkFBK0I7WUFDL0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO2FBQ3BCO1lBRUQsdUJBQXVCO1lBQ3ZCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM5QixDQUFDO0tBQUE7SUFFUyxnQkFBZ0I7UUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7U0FDekU7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztDQUNGO0FBeERELDhCQXdEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbm5lY3QsIENvbm5lY3Rpb24sIE9wdGlvbnMgYXMgQU1RUE9wdGlvbnMsIE1lc3NhZ2UgYXMgQU1RUE1lc3NhZ2UgfSBmcm9tIFwiYW1xcGxpYlwiO1xuaW1wb3J0IHsgRGF0YWJhc2UsIERhdGFiYXNlT3B0aW9ucyB9IGZyb20gXCJ0cy1mcmFtZXdvcmstY29tbW9uXCI7XG5pbXBvcnQgQ2hhbm5lbCwgeyBDaGFubmVsT3B0aW9ucyB9IGZyb20gXCIuL0NoYW5uZWxcIjtcblxuZXhwb3J0IGNvbnN0IE5BQ0tfVElNRU9VVCA9IDMwMDAwO1xuXG5leHBvcnQgeyBBTVFQT3B0aW9ucywgQU1RUE1lc3NhZ2V9O1xuXG5leHBvcnQgaW50ZXJmYWNlIEFNUVBTZXJ2aWNlT3B0aW9ucyBleHRlbmRzIERhdGFiYXNlT3B0aW9ucyB7XG4gIGhvc3Q/OiBzdHJpbmc7XG4gIG5hY2tUaW1lb3V0PzogbnVtYmVyO1xuICBtZXNzYWdlVGltZVRvTGl2ZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQU1RUFNlcnZpY2U8RGF0YT4gZXh0ZW5kcyBEYXRhYmFzZSB7XG4gIHB1YmxpYyBvcHRpb25zOiBBTVFQU2VydmljZU9wdGlvbnM7XG4gIHByb3RlY3RlZCBjb25uZWN0aW9uPzogQ29ubmVjdGlvbjtcbiAgcHJvdGVjdGVkIGNoYW5uZWxzOiBDaGFubmVsPERhdGE+W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBBTVFQU2VydmljZU9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgfVxuXG4gIGlzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuY29ubmVjdGlvbjtcbiAgfVxuXG4gIGFzeW5jIGNvbm5lY3Qob3B0aW9ucz86IEFNUVBPcHRpb25zLkNvbm5lY3QpOiBQcm9taXNlPERhdGFiYXNlT3B0aW9ucz4ge1xuICAgIC8vIFByZXBhcmUgY29ubmVjdGlvbiBhbmQgY2hhbm5lbCBmb3IgbWVzc2FnaW5nXG4gICAgdGhpcy5jb25uZWN0aW9uID0gYXdhaXQgY29ubmVjdChcbiAgICAgIHRoaXMub3B0aW9ucy5ob3N0IHx8IFwiYW1xcDovL2xvY2FsaG9zdFwiLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucztcbiAgfVxuXG4gIGFzeW5jIGNoYW5uZWwobmFtZTogc3RyaW5nLCBvcHRpb25zPzogQ2hhbm5lbE9wdGlvbnM8RGF0YT4pOiBQcm9taXNlPENoYW5uZWw8RGF0YT4+IHtcbiAgICB0aGlzLmVuc3VyZUNvbm5lY3Rpb24oKTtcbiAgICBsZXQgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHMuZmluZChjaGFubmVsID0+IGNoYW5uZWwub3B0aW9ucy5uYW1lID09PSBuYW1lKTtcblxuICAgIGlmICghY2hhbm5lbCkge1xuICAgICAgY2hhbm5lbCA9IGF3YWl0IENoYW5uZWwuZnJvbSh0aGlzLmNvbm5lY3Rpb24sIHsgbG9nZ2VyOiB0aGlzLmxvZ2dlciwgLi4ub3B0aW9ucyB9KTtcbiAgICAgIHRoaXMuY2hhbm5lbHMucHVzaChjaGFubmVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbm5lbDtcbiAgfVxuXG4gIGFzeW5jIGRpc2Nvbm5lY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gQ2xvc2UgYWxsIGF2YWlsYWJsZSBjaGFubmVsc1xuICAgIGlmICh0aGlzLmNoYW5uZWxzKSB7XG4gICAgICBjb25zdCB0YXNrcyA9IHRoaXMuY2hhbm5lbHMubWFwKGNoYW5uZWwgPT4gY2hhbm5lbC5jbG9zZSgpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHRhc2tzKTtcbiAgICAgIHRoaXMuY2hhbm5lbHMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBDbG9zZSB0aGUgY29ubmVjdGlvblxuICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBlbnN1cmVDb25uZWN0aW9uKCkge1xuICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDaGFubmVsIGlzIG5vdCBhdmFpbGFibGUsIHF1ZXVlIG1heSBub3QgYmUgY29ubmVjdGVkXCIpO1xuICAgIH1cbiAgfVxuXG4gIGVudGl0aWVzKCk6IHsgW25hbWU6IHN0cmluZ106IGFueSB9IHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cbiJdfQ==
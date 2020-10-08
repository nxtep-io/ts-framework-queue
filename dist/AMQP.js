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
const amqplib_1 = require("amqplib");
const ts_framework_common_1 = require("ts-framework-common");
const Channel_1 = require("./Channel");
class AMQPService extends ts_framework_common_1.Database {
    constructor(options) {
        super(options);
        this.channels = [];
    }
    isConnected() {
        return !!this.connection;
    }
    query() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new ts_framework_common_1.BaseError('AMQP service does not support querying');
        });
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('Connecting to the AMQP cluster', {
                host: this.options.host || "amqp://localhost",
            });
            // Prepare connection and channel for messaging
            this.connection = yield amqplib_1.connect(this.options.host || "amqp://localhost", options);
            process.once('SIGINT', () => this.connection.close().bind(this.connection));
            process.once('SIGTERM', () => this.connection.close().bind(this.connection));
            return this.options;
        });
    }
    /**
     * Opens a new channel in the AMQP connection.
     */
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
    /**
     * Disconnects from AMQP server.
     */
    disconnect() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Close all available channels
                if (this.channels) {
                    const tasks = this.channels.map(channel => channel === null || channel === void 0 ? void 0 : channel.close());
                    yield Promise.all(tasks);
                    this.channels = [];
                }
                // Close the connection
                yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.close());
                this.connection = undefined;
            }
            catch (exception) {
                (_b = this.logger) === null || _b === void 0 ? void 0 : _b.warn(exception);
            }
        });
    }
    /**
     * Ensures the database is connected.
     */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQU1RUC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9BTVFQLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEscUNBQThGO0FBQzlGLDZEQUEyRTtBQUMzRSx1Q0FBb0Q7QUFVcEQsTUFBcUIsV0FBa0IsU0FBUSw4QkFBUTtJQUtyRCxZQUFZLE9BQTJCO1FBQ3JDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUhQLGFBQVEsR0FBb0IsRUFBRSxDQUFDO0lBSXpDLENBQUM7SUFFRCxXQUFXO1FBQ1QsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRUssS0FBSzs7WUFDVCxNQUFNLElBQUksK0JBQVMsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxPQUE2Qjs7WUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQ2xELElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxrQkFBa0I7YUFDOUMsQ0FBQyxDQUFDO1lBRUgsK0NBQStDO1lBQy9DLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxpQkFBTyxDQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxrQkFBa0IsRUFDdkMsT0FBTyxDQUNSLENBQUM7WUFFRixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtZQUMzRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtZQUU1RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDRyxPQUFPLENBQUMsSUFBWSxFQUFFLE9BQThCOztZQUN4RCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO1lBRTNFLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ1osT0FBTyxHQUFHLE1BQU0saUJBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsa0JBQUksTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUssT0FBTyxFQUFHLENBQUM7Z0JBQ25GLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzdCO1lBRUQsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDRyxVQUFVOzs7WUFDZCxJQUFJO2dCQUNGLCtCQUErQjtnQkFDL0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNqQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO29CQUM3RCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO2lCQUNwQjtnQkFFRCx1QkFBdUI7Z0JBQ3ZCLGFBQU0sSUFBSSxDQUFDLFVBQVUsMENBQUUsS0FBSyxHQUFFLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO2FBQzdCO1lBQUMsT0FBTyxTQUFTLEVBQUU7Z0JBQ2xCLE1BQUEsSUFBSSxDQUFDLE1BQU0sMENBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRTthQUM5Qjs7S0FDRjtJQUVEOztPQUVHO0lBQ08sZ0JBQWdCO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1NBQ3pFO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7Q0FDRjtBQWpGRCw4QkFpRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb25uZWN0LCBDb25uZWN0aW9uLCBNZXNzYWdlIGFzIEFNUVBNZXNzYWdlLCBPcHRpb25zIGFzIEFNUVBPcHRpb25zIH0gZnJvbSBcImFtcXBsaWJcIjtcbmltcG9ydCB7IERhdGFiYXNlLCBEYXRhYmFzZU9wdGlvbnMsIEJhc2VFcnJvciB9IGZyb20gXCJ0cy1mcmFtZXdvcmstY29tbW9uXCI7XG5pbXBvcnQgQ2hhbm5lbCwgeyBDaGFubmVsT3B0aW9ucyB9IGZyb20gXCIuL0NoYW5uZWxcIjtcblxuZXhwb3J0IHsgQU1RUE9wdGlvbnMsIEFNUVBNZXNzYWdlIH07XG5cbmV4cG9ydCBpbnRlcmZhY2UgQU1RUFNlcnZpY2VPcHRpb25zIGV4dGVuZHMgRGF0YWJhc2VPcHRpb25zIHtcbiAgaG9zdD86IHN0cmluZztcbiAgbmFja1RpbWVvdXQ/OiBudW1iZXI7XG4gIG1lc3NhZ2VUaW1lVG9MaXZlPzogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBTVFQU2VydmljZTxEYXRhPiBleHRlbmRzIERhdGFiYXNlIHtcbiAgcHVibGljIG9wdGlvbnM6IEFNUVBTZXJ2aWNlT3B0aW9ucztcbiAgcHJvdGVjdGVkIGNvbm5lY3Rpb24/OiBDb25uZWN0aW9uO1xuICBwcm90ZWN0ZWQgY2hhbm5lbHM6IENoYW5uZWw8RGF0YT5bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFNUVBTZXJ2aWNlT3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICB9XG5cbiAgaXNDb25uZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5jb25uZWN0aW9uO1xuICB9XG5cbiAgYXN5bmMgcXVlcnkoKSB7XG4gICAgdGhyb3cgbmV3IEJhc2VFcnJvcignQU1RUCBzZXJ2aWNlIGRvZXMgbm90IHN1cHBvcnQgcXVlcnlpbmcnKTtcbiAgfVxuXG4gIGFzeW5jIGNvbm5lY3Qob3B0aW9ucz86IEFNUVBPcHRpb25zLkNvbm5lY3QpOiBQcm9taXNlPERhdGFiYXNlT3B0aW9ucz4ge1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdDb25uZWN0aW5nIHRvIHRoZSBBTVFQIGNsdXN0ZXInLCB7XG4gICAgICBob3N0OiB0aGlzLm9wdGlvbnMuaG9zdCB8fCBcImFtcXA6Ly9sb2NhbGhvc3RcIixcbiAgICB9KTtcblxuICAgIC8vIFByZXBhcmUgY29ubmVjdGlvbiBhbmQgY2hhbm5lbCBmb3IgbWVzc2FnaW5nXG4gICAgdGhpcy5jb25uZWN0aW9uID0gYXdhaXQgY29ubmVjdChcbiAgICAgIHRoaXMub3B0aW9ucy5ob3N0IHx8IFwiYW1xcDovL2xvY2FsaG9zdFwiLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG5cbiAgICBwcm9jZXNzLm9uY2UoJ1NJR0lOVCcsICgpID0+IHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpLmJpbmQodGhpcy5jb25uZWN0aW9uKSlcbiAgICBwcm9jZXNzLm9uY2UoJ1NJR1RFUk0nLCAoKSA9PiB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKS5iaW5kKHRoaXMuY29ubmVjdGlvbikpXG5cbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgbmV3IGNoYW5uZWwgaW4gdGhlIEFNUVAgY29ubmVjdGlvbi5cbiAgICovXG4gIGFzeW5jIGNoYW5uZWwobmFtZTogc3RyaW5nLCBvcHRpb25zPzogQ2hhbm5lbE9wdGlvbnM8RGF0YT4pOiBQcm9taXNlPENoYW5uZWw8RGF0YT4+IHtcbiAgICB0aGlzLmVuc3VyZUNvbm5lY3Rpb24oKTtcbiAgICBsZXQgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHMuZmluZChjaGFubmVsID0+IGNoYW5uZWwub3B0aW9ucy5uYW1lID09PSBuYW1lKTtcblxuICAgIGlmICghY2hhbm5lbCkge1xuICAgICAgY2hhbm5lbCA9IGF3YWl0IENoYW5uZWwuZnJvbSh0aGlzLmNvbm5lY3Rpb24sIHsgbG9nZ2VyOiB0aGlzLmxvZ2dlciwgLi4ub3B0aW9ucyB9KTtcbiAgICAgIHRoaXMuY2hhbm5lbHMucHVzaChjaGFubmVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbm5lbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBmcm9tIEFNUVAgc2VydmVyLlxuICAgKi9cbiAgYXN5bmMgZGlzY29ubmVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgLy8gQ2xvc2UgYWxsIGF2YWlsYWJsZSBjaGFubmVsc1xuICAgICAgaWYgKHRoaXMuY2hhbm5lbHMpIHtcbiAgICAgICAgY29uc3QgdGFza3MgPSB0aGlzLmNoYW5uZWxzLm1hcChjaGFubmVsID0+IGNoYW5uZWw/LmNsb3NlKCkpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCh0YXNrcyk7XG4gICAgICAgIHRoaXMuY2hhbm5lbHMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2xvc2UgdGhlIGNvbm5lY3Rpb25cbiAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbj8uY2xvc2UoKTtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgIHRoaXMubG9nZ2VyPy53YXJuKGV4Y2VwdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZXMgdGhlIGRhdGFiYXNlIGlzIGNvbm5lY3RlZC5cbiAgICovXG4gIHByb3RlY3RlZCBlbnN1cmVDb25uZWN0aW9uKCkge1xuICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDaGFubmVsIGlzIG5vdCBhdmFpbGFibGUsIHF1ZXVlIG1heSBub3QgYmUgY29ubmVjdGVkXCIpO1xuICAgIH1cbiAgfVxuXG4gIGVudGl0aWVzKCk6IHsgW25hbWU6IHN0cmluZ106IGFueSB9IHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cbiJdfQ==
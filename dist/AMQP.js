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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQU1RUC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9BTVFQLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQ0FBOEY7QUFDOUYsNkRBQTJFO0FBQzNFLHVDQUFvRDtBQVVwRCxNQUFxQixXQUFrQixTQUFRLDhCQUFRO0lBS3JELFlBQVksT0FBMkI7UUFDckMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBSFAsYUFBUSxHQUFvQixFQUFFLENBQUM7SUFJekMsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFSyxLQUFLOztZQUNULE1BQU0sSUFBSSwrQkFBUyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDaEUsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLE9BQTZCOztZQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRTtnQkFDbEQsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLGtCQUFrQjthQUM5QyxDQUFDLENBQUM7WUFFSCwrQ0FBK0M7WUFDL0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLGlCQUFPLENBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLGtCQUFrQixFQUN2QyxPQUFPLENBQ1IsQ0FBQztZQUNGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLE9BQU8sQ0FBQyxJQUFZLEVBQUUsT0FBOEI7O1lBQ3hELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3hCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7WUFFM0UsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDWixPQUFPLEdBQUcsTUFBTSxpQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxrQkFBSSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSyxPQUFPLEVBQUcsQ0FBQztnQkFDbkYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDN0I7WUFFRCxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLFVBQVU7O1lBQ2QsK0JBQStCO1lBQy9CLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzthQUNwQjtZQUVELHVCQUF1QjtZQUN2QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDOUIsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDTyxnQkFBZ0I7UUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7U0FDekU7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztDQUNGO0FBekVELDhCQXlFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbm5lY3QsIENvbm5lY3Rpb24sIE1lc3NhZ2UgYXMgQU1RUE1lc3NhZ2UsIE9wdGlvbnMgYXMgQU1RUE9wdGlvbnMgfSBmcm9tIFwiYW1xcGxpYlwiO1xuaW1wb3J0IHsgRGF0YWJhc2UsIERhdGFiYXNlT3B0aW9ucywgQmFzZUVycm9yIH0gZnJvbSBcInRzLWZyYW1ld29yay1jb21tb25cIjtcbmltcG9ydCBDaGFubmVsLCB7IENoYW5uZWxPcHRpb25zIH0gZnJvbSBcIi4vQ2hhbm5lbFwiO1xuXG5leHBvcnQgeyBBTVFQT3B0aW9ucywgQU1RUE1lc3NhZ2UgfTtcblxuZXhwb3J0IGludGVyZmFjZSBBTVFQU2VydmljZU9wdGlvbnMgZXh0ZW5kcyBEYXRhYmFzZU9wdGlvbnMge1xuICBob3N0Pzogc3RyaW5nO1xuICBuYWNrVGltZW91dD86IG51bWJlcjtcbiAgbWVzc2FnZVRpbWVUb0xpdmU/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFNUVBTZXJ2aWNlPERhdGE+IGV4dGVuZHMgRGF0YWJhc2Uge1xuICBwdWJsaWMgb3B0aW9uczogQU1RUFNlcnZpY2VPcHRpb25zO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbj86IENvbm5lY3Rpb247XG4gIHByb3RlY3RlZCBjaGFubmVsczogQ2hhbm5lbDxEYXRhPltdID0gW107XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogQU1RUFNlcnZpY2VPcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmNvbm5lY3Rpb247XG4gIH1cblxuICBhc3luYyBxdWVyeSgpIHtcbiAgICB0aHJvdyBuZXcgQmFzZUVycm9yKCdBTVFQIHNlcnZpY2UgZG9lcyBub3Qgc3VwcG9ydCBxdWVyeWluZycpO1xuICB9XG5cbiAgYXN5bmMgY29ubmVjdChvcHRpb25zPzogQU1RUE9wdGlvbnMuQ29ubmVjdCk6IFByb21pc2U8RGF0YWJhc2VPcHRpb25zPiB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Nvbm5lY3RpbmcgdG8gdGhlIEFNUVAgY2x1c3RlcicsIHtcbiAgICAgIGhvc3Q6IHRoaXMub3B0aW9ucy5ob3N0IHx8IFwiYW1xcDovL2xvY2FsaG9zdFwiLFxuICAgIH0pO1xuXG4gICAgLy8gUHJlcGFyZSBjb25uZWN0aW9uIGFuZCBjaGFubmVsIGZvciBtZXNzYWdpbmdcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBhd2FpdCBjb25uZWN0KFxuICAgICAgdGhpcy5vcHRpb25zLmhvc3QgfHwgXCJhbXFwOi8vbG9jYWxob3N0XCIsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgbmV3IGNoYW5uZWwgaW4gdGhlIEFNUVAgY29ubmVjdGlvbi5cbiAgICovXG4gIGFzeW5jIGNoYW5uZWwobmFtZTogc3RyaW5nLCBvcHRpb25zPzogQ2hhbm5lbE9wdGlvbnM8RGF0YT4pOiBQcm9taXNlPENoYW5uZWw8RGF0YT4+IHtcbiAgICB0aGlzLmVuc3VyZUNvbm5lY3Rpb24oKTtcbiAgICBsZXQgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHMuZmluZChjaGFubmVsID0+IGNoYW5uZWwub3B0aW9ucy5uYW1lID09PSBuYW1lKTtcblxuICAgIGlmICghY2hhbm5lbCkge1xuICAgICAgY2hhbm5lbCA9IGF3YWl0IENoYW5uZWwuZnJvbSh0aGlzLmNvbm5lY3Rpb24sIHsgbG9nZ2VyOiB0aGlzLmxvZ2dlciwgLi4ub3B0aW9ucyB9KTtcbiAgICAgIHRoaXMuY2hhbm5lbHMucHVzaChjaGFubmVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbm5lbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBmcm9tIEFNUVAgc2VydmVyLlxuICAgKi9cbiAgYXN5bmMgZGlzY29ubmVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBDbG9zZSBhbGwgYXZhaWxhYmxlIGNoYW5uZWxzXG4gICAgaWYgKHRoaXMuY2hhbm5lbHMpIHtcbiAgICAgIGNvbnN0IHRhc2tzID0gdGhpcy5jaGFubmVscy5tYXAoY2hhbm5lbCA9PiBjaGFubmVsLmNsb3NlKCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwodGFza3MpO1xuICAgICAgdGhpcy5jaGFubmVscyA9IFtdO1xuICAgIH1cblxuICAgIC8vIENsb3NlIHRoZSBjb25uZWN0aW9uXG4gICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLmNsb3NlKCk7XG4gICAgdGhpcy5jb25uZWN0aW9uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZXMgdGhlIGRhdGFiYXNlIGlzIGNvbm5lY3RlZC5cbiAgICovXG4gIHByb3RlY3RlZCBlbnN1cmVDb25uZWN0aW9uKCkge1xuICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDaGFubmVsIGlzIG5vdCBhdmFpbGFibGUsIHF1ZXVlIG1heSBub3QgYmUgY29ubmVjdGVkXCIpO1xuICAgIH1cbiAgfVxuXG4gIGVudGl0aWVzKCk6IHsgW25hbWU6IHN0cmluZ106IGFueSB9IHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cbiJdfQ==
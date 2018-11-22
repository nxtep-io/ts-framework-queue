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
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQU1RUC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9BTVFQLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQ0FBOEY7QUFDOUYsNkRBQWdFO0FBQ2hFLHVDQUFvRDtBQVVwRCxNQUFxQixXQUFrQixTQUFRLDhCQUFRO0lBS3JELFlBQVksT0FBMkI7UUFDckMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBSFAsYUFBUSxHQUFvQixFQUFFLENBQUM7SUFJekMsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFSyxPQUFPLENBQUMsT0FBNkI7O1lBQ3pDLCtDQUErQztZQUMvQyxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0saUJBQU8sQ0FDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksa0JBQWtCLEVBQ3ZDLE9BQU8sQ0FDUixDQUFDO1lBQ0YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0csT0FBTyxDQUFDLElBQVksRUFBRSxPQUE4Qjs7WUFDeEQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDeEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztZQUUzRSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLE9BQU8sR0FBRyxNQUFNLGlCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLGtCQUFJLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFLLE9BQU8sRUFBRyxDQUFDO2dCQUNuRixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM3QjtZQUVELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0csVUFBVTs7WUFDZCwrQkFBK0I7WUFDL0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO2FBQ3BCO1lBRUQsdUJBQXVCO1lBQ3ZCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM5QixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNPLGdCQUFnQjtRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztTQUN6RTtJQUNILENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0NBQ0Y7QUFqRUQsOEJBaUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29ubmVjdCwgQ29ubmVjdGlvbiwgTWVzc2FnZSBhcyBBTVFQTWVzc2FnZSwgT3B0aW9ucyBhcyBBTVFQT3B0aW9ucyB9IGZyb20gXCJhbXFwbGliXCI7XG5pbXBvcnQgeyBEYXRhYmFzZSwgRGF0YWJhc2VPcHRpb25zIH0gZnJvbSBcInRzLWZyYW1ld29yay1jb21tb25cIjtcbmltcG9ydCBDaGFubmVsLCB7IENoYW5uZWxPcHRpb25zIH0gZnJvbSBcIi4vQ2hhbm5lbFwiO1xuXG5leHBvcnQgeyBBTVFQT3B0aW9ucywgQU1RUE1lc3NhZ2UgfTtcblxuZXhwb3J0IGludGVyZmFjZSBBTVFQU2VydmljZU9wdGlvbnMgZXh0ZW5kcyBEYXRhYmFzZU9wdGlvbnMge1xuICBob3N0Pzogc3RyaW5nO1xuICBuYWNrVGltZW91dD86IG51bWJlcjtcbiAgbWVzc2FnZVRpbWVUb0xpdmU/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFNUVBTZXJ2aWNlPERhdGE+IGV4dGVuZHMgRGF0YWJhc2Uge1xuICBwdWJsaWMgb3B0aW9uczogQU1RUFNlcnZpY2VPcHRpb25zO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbj86IENvbm5lY3Rpb247XG4gIHByb3RlY3RlZCBjaGFubmVsczogQ2hhbm5lbDxEYXRhPltdID0gW107XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogQU1RUFNlcnZpY2VPcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmNvbm5lY3Rpb247XG4gIH1cblxuICBhc3luYyBjb25uZWN0KG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5Db25uZWN0KTogUHJvbWlzZTxEYXRhYmFzZU9wdGlvbnM+IHtcbiAgICAvLyBQcmVwYXJlIGNvbm5lY3Rpb24gYW5kIGNoYW5uZWwgZm9yIG1lc3NhZ2luZ1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IGF3YWl0IGNvbm5lY3QoXG4gICAgICB0aGlzLm9wdGlvbnMuaG9zdCB8fCBcImFtcXA6Ly9sb2NhbGhvc3RcIixcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgYSBuZXcgY2hhbm5lbCBpbiB0aGUgQU1RUCBjb25uZWN0aW9uLlxuICAgKi9cbiAgYXN5bmMgY2hhbm5lbChuYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBDaGFubmVsT3B0aW9uczxEYXRhPik6IFByb21pc2U8Q2hhbm5lbDxEYXRhPj4ge1xuICAgIHRoaXMuZW5zdXJlQ29ubmVjdGlvbigpO1xuICAgIGxldCBjaGFubmVsID0gdGhpcy5jaGFubmVscy5maW5kKGNoYW5uZWwgPT4gY2hhbm5lbC5vcHRpb25zLm5hbWUgPT09IG5hbWUpO1xuXG4gICAgaWYgKCFjaGFubmVsKSB7XG4gICAgICBjaGFubmVsID0gYXdhaXQgQ2hhbm5lbC5mcm9tKHRoaXMuY29ubmVjdGlvbiwgeyBsb2dnZXI6IHRoaXMubG9nZ2VyLCAuLi5vcHRpb25zIH0pO1xuICAgICAgdGhpcy5jaGFubmVscy5wdXNoKGNoYW5uZWwpO1xuICAgIH1cblxuICAgIHJldHVybiBjaGFubmVsO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIGZyb20gQU1RUCBzZXJ2ZXIuXG4gICAqL1xuICBhc3luYyBkaXNjb25uZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIENsb3NlIGFsbCBhdmFpbGFibGUgY2hhbm5lbHNcbiAgICBpZiAodGhpcy5jaGFubmVscykge1xuICAgICAgY29uc3QgdGFza3MgPSB0aGlzLmNoYW5uZWxzLm1hcChjaGFubmVsID0+IGNoYW5uZWwuY2xvc2UoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh0YXNrcyk7XG4gICAgICB0aGlzLmNoYW5uZWxzID0gW107XG4gICAgfVxuXG4gICAgLy8gQ2xvc2UgdGhlIGNvbm5lY3Rpb25cbiAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlcyB0aGUgZGF0YWJhc2UgaXMgY29ubmVjdGVkLlxuICAgKi9cbiAgcHJvdGVjdGVkIGVuc3VyZUNvbm5lY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNoYW5uZWwgaXMgbm90IGF2YWlsYWJsZSwgcXVldWUgbWF5IG5vdCBiZSBjb25uZWN0ZWRcIik7XG4gICAgfVxuICB9XG5cbiAgZW50aXRpZXMoKTogeyBbbmFtZTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuIl19
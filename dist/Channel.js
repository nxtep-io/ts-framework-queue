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
const Exchange_1 = require("./Exchange");
const utils_1 = require("./utils");
exports.NACK_TIMEOUT = 30000;
class Channel {
    constructor(channel, options = {}) {
        this.channel = channel;
        this.options = options;
        this.exchanges = [];
        this.serializer = new utils_1.Serializer();
        this.logger = options.logger || ts_framework_common_1.Logger.getInstance();
        this.serializer = options.serializer || this.serializer;
    }
    static from(connection, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const base = yield connection.createChannel();
            return new Channel(base, options);
        });
    }
    /**
     * Closes the channel connection.
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.close();
        });
    }
    /**
     * Gets an exchange ready for publishing and consuming.
     */
    exchange(name, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('Initializing AMQP exchange instance', {
                exchange: name,
                bind: options.bind,
                options: options.exchangeOptions,
            });
            // Ensure exchange exists in remote server
            yield this.channel.assertExchange(name, options.type || 'direct', options.exchangeOptions);
            return Exchange_1.default.from(name, this, Object.assign({ logger: this.logger }, options));
        });
    }
    assertQueue(name, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.assertQueue(name, options);
        });
    }
    bindQueue(queueName, exchangeName, route) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.bindQueue(queueName, exchangeName, route);
        });
    }
    publish(name, route, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = this.serializer.serialize(data);
            return this.channel.publish(name, route, Buffer.from(content), options);
        });
    }
    sendToQueue(name, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = this.serializer.serialize(data);
            return this.channel.sendToQueue(name, Buffer.from(content), options);
        });
    }
    prefetch(num, global) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.prefetch(num, global);
        });
    }
    consume(queue, onMessage, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrapper = (msg) => onMessage(this.serializer.deserialize(msg.content), msg);
            return this.channel.consume(queue, wrapper, options);
        });
    }
    ack(message, allUpTo) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.ack(message, allUpTo);
        });
    }
    nack(message, allUpTo, requeue) {
        return __awaiter(this, void 0, void 0, function* () {
            return setTimeout(() => this.channel.nack(message, allUpTo, requeue), this.options.nackTimeout || exports.NACK_TIMEOUT);
        });
    }
}
exports.default = Channel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9DaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSw2REFBNkM7QUFFN0MseUNBQXVEO0FBQ3ZELG1DQUFxQztBQUV4QixRQUFBLFlBQVksR0FBRyxLQUFLLENBQUM7QUFVbEMsTUFBcUIsT0FBTztJQUsxQixZQUFzQixPQUFvQixFQUFTLFVBQWdDLEVBQUU7UUFBL0QsWUFBTyxHQUFQLE9BQU8sQ0FBYTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQTJCO1FBSDNFLGNBQVMsR0FBcUIsRUFBRSxDQUFDO1FBQ2pDLGVBQVUsR0FBZSxJQUFJLGtCQUFVLEVBQUUsQ0FBQztRQUdsRCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksNEJBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMxRCxDQUFDO0lBRU0sTUFBTSxDQUFPLElBQUksQ0FBTyxVQUEwQixFQUFFLE9BQTZCOztZQUN0RixNQUFNLElBQUksR0FBRyxNQUFNLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUM5QyxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQyxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLEtBQUs7O1lBQ2hCLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBK0I7O1lBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxFQUFFO2dCQUN2RCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7Z0JBQ2xCLE9BQU8sRUFBRSxPQUFPLENBQUMsZUFBZTthQUNqQyxDQUFDLENBQUM7WUFFSCwwQ0FBMEM7WUFDMUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzNGLE9BQU8sa0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksa0JBQUksTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUssT0FBTyxFQUFHLENBQUM7UUFDeEUsQ0FBQztLQUFBO0lBRUssV0FBVyxDQUFDLElBQVksRUFBRSxPQUFnQzs7WUFDOUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakQsQ0FBQztLQUFBO0lBRUssU0FBUyxDQUFDLFNBQWlCLEVBQUUsWUFBb0IsRUFBRSxLQUFhOztZQUNwRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEUsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLElBQVksRUFBRSxLQUFhLEVBQUUsSUFBUyxFQUFFLE9BQTZCOztZQUNqRixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxRSxDQUFDO0tBQUE7SUFFSyxXQUFXLENBQUMsSUFBWSxFQUFFLElBQVMsRUFBRSxPQUE2Qjs7WUFDdEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2RSxDQUFDO0tBQUE7SUFFSyxRQUFRLENBQUMsR0FBVyxFQUFFLE1BQWdCOztZQUMxQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QyxDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsS0FBYSxFQUFFLFNBQWtELEVBQUUsT0FBNkI7O1lBQzVHLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBZ0IsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMvRixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkQsQ0FBQztLQUFBO0lBRVksR0FBRyxDQUFDLE9BQW9CLEVBQUUsT0FBaUI7O1lBQ3RELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLENBQUM7S0FBQTtJQUVZLElBQUksQ0FBQyxPQUFvQixFQUFFLE9BQWlCLEVBQUUsT0FBaUI7O1lBQzFFLE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksb0JBQVksQ0FBQyxDQUFDO1FBQ2xILENBQUM7S0FBQTtDQUNGO0FBdkVELDBCQXVFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5uZWwgYXMgQmFzZUNoYW5uZWwsIENvbm5lY3Rpb24gYXMgQmFzZUNvbm5lY3Rpb24gfSBmcm9tIFwiYW1xcGxpYlwiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcInRzLWZyYW1ld29yay1jb21tb25cIjtcbmltcG9ydCB7IEFNUVBPcHRpb25zLCBBTVFQTWVzc2FnZSB9IGZyb20gXCIuL0FNUVBcIjtcbmltcG9ydCBFeGNoYW5nZSwgeyBFeGNoYW5nZU9wdGlvbnMgfSBmcm9tIFwiLi9FeGNoYW5nZVwiO1xuaW1wb3J0IHsgU2VyaWFsaXplciB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBjb25zdCBOQUNLX1RJTUVPVVQgPSAzMDAwMDtcblxuZXhwb3J0IGludGVyZmFjZSBDaGFubmVsT3B0aW9uczxEYXRhPiB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGxvZ2dlcj86IExvZ2dlcjtcbiAgbmFja1RpbWVvdXQ/OiBudW1iZXI7XG4gIGV4Y2hhbmdlcz86IEV4Y2hhbmdlPERhdGE+W107XG4gIHNlcmlhbGl6ZXI/OiBTZXJpYWxpemVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsPERhdGE+IHtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VyO1xuICBwcm90ZWN0ZWQgZXhjaGFuZ2VzOiBFeGNoYW5nZTxEYXRhPltdID0gW107XG4gIHByb3RlY3RlZCBzZXJpYWxpemVyOiBTZXJpYWxpemVyID0gbmV3IFNlcmlhbGl6ZXIoKTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgY2hhbm5lbDogQmFzZUNoYW5uZWwsIHB1YmxpYyBvcHRpb25zOiBDaGFubmVsT3B0aW9uczxEYXRhPiA9IHt9KSB7XG4gICAgdGhpcy5sb2dnZXIgPSBvcHRpb25zLmxvZ2dlciB8fCBMb2dnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICB0aGlzLnNlcmlhbGl6ZXIgPSBvcHRpb25zLnNlcmlhbGl6ZXIgfHwgdGhpcy5zZXJpYWxpemVyO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBhc3luYyBmcm9tPERhdGE+KGNvbm5lY3Rpb246IEJhc2VDb25uZWN0aW9uLCBvcHRpb25zOiBDaGFubmVsT3B0aW9uczxEYXRhPik6IFByb21pc2U8Q2hhbm5lbDxEYXRhPj4ge1xuICAgIGNvbnN0IGJhc2UgPSBhd2FpdCBjb25uZWN0aW9uLmNyZWF0ZUNoYW5uZWwoKTtcbiAgICByZXR1cm4gbmV3IENoYW5uZWwoYmFzZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBjaGFubmVsIGNvbm5lY3Rpb24uXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5jaGFubmVsLmNsb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBleGNoYW5nZSByZWFkeSBmb3IgcHVibGlzaGluZyBhbmQgY29uc3VtaW5nLlxuICAgKi9cbiAgYXN5bmMgZXhjaGFuZ2UobmFtZSwgb3B0aW9ucz86IEV4Y2hhbmdlT3B0aW9uczxEYXRhPik6IFByb21pc2U8RXhjaGFuZ2U8RGF0YT4+IHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnSW5pdGlhbGl6aW5nIEFNUVAgZXhjaGFuZ2UgaW5zdGFuY2UnLCB7XG4gICAgICBleGNoYW5nZTogbmFtZSxcbiAgICAgIGJpbmQ6IG9wdGlvbnMuYmluZCxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMuZXhjaGFuZ2VPcHRpb25zLFxuICAgIH0pO1xuXG4gICAgLy8gRW5zdXJlIGV4Y2hhbmdlIGV4aXN0cyBpbiByZW1vdGUgc2VydmVyXG4gICAgYXdhaXQgdGhpcy5jaGFubmVsLmFzc2VydEV4Y2hhbmdlKG5hbWUsIG9wdGlvbnMudHlwZSB8fCAnZGlyZWN0Jywgb3B0aW9ucy5leGNoYW5nZU9wdGlvbnMpO1xuICAgIHJldHVybiBFeGNoYW5nZS5mcm9tKG5hbWUsIHRoaXMsIHsgbG9nZ2VyOiB0aGlzLmxvZ2dlciwgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIGFzeW5jIGFzc2VydFF1ZXVlKG5hbWU6IHN0cmluZywgb3B0aW9uczogQU1RUE9wdGlvbnMuQXNzZXJ0UXVldWUpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLmFzc2VydFF1ZXVlKG5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgYmluZFF1ZXVlKHF1ZXVlTmFtZTogc3RyaW5nLCBleGNoYW5nZU5hbWU6IHN0cmluZywgcm91dGU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuYmluZFF1ZXVlKHF1ZXVlTmFtZSwgZXhjaGFuZ2VOYW1lLCByb3V0ZSk7XG4gIH1cblxuICBhc3luYyBwdWJsaXNoKG5hbWU6IHN0cmluZywgcm91dGU6IHN0cmluZywgZGF0YTogYW55LCBvcHRpb25zPzogQU1RUE9wdGlvbnMuUHVibGlzaCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKGRhdGEpO1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwucHVibGlzaChuYW1lLCByb3V0ZSwgQnVmZmVyLmZyb20oY29udGVudCksIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgc2VuZFRvUXVldWUobmFtZTogc3RyaW5nLCBkYXRhOiBhbnksIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5QdWJsaXNoKSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoZGF0YSk7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5zZW5kVG9RdWV1ZShuYW1lLCBCdWZmZXIuZnJvbShjb250ZW50KSwgb3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBwcmVmZXRjaChudW06IG51bWJlciwgZ2xvYmFsPzogYm9vbGVhbikge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwucHJlZmV0Y2gobnVtLCBnbG9iYWwpO1xuICB9XG5cbiAgYXN5bmMgY29uc3VtZShxdWV1ZTogc3RyaW5nLCBvbk1lc3NhZ2U6IChjb250ZW50OiBhbnksIG1zZzogQU1RUE1lc3NhZ2UpID0+IGFueSwgb3B0aW9ucz86IEFNUVBPcHRpb25zLkNvbnN1bWUpIHtcbiAgICBjb25zdCB3cmFwcGVyID0gKG1zZzogQU1RUE1lc3NhZ2UpID0+IG9uTWVzc2FnZSh0aGlzLnNlcmlhbGl6ZXIuZGVzZXJpYWxpemUobXNnLmNvbnRlbnQpLCBtc2cpO1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuY29uc3VtZShxdWV1ZSwgd3JhcHBlciwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgYWNrKG1lc3NhZ2U6IEFNUVBNZXNzYWdlLCBhbGxVcFRvPzogYm9vbGVhbikge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuYWNrKG1lc3NhZ2UsIGFsbFVwVG8pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIG5hY2sobWVzc2FnZTogQU1RUE1lc3NhZ2UsIGFsbFVwVG8/OiBib29sZWFuLCByZXF1ZXVlPzogYm9vbGVhbikge1xuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHRoaXMuY2hhbm5lbC5uYWNrKG1lc3NhZ2UsIGFsbFVwVG8sIHJlcXVldWUpLCB0aGlzLm9wdGlvbnMubmFja1RpbWVvdXQgfHwgTkFDS19USU1FT1VUKTtcbiAgfVxufVxuIl19
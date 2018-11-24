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
const Queue_1 = require("./Queue");
const defaults_1 = require("./defaults");
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
    /**
     * Gets a queue ready for publishing and consuming.
     */
    queue(name, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('Initializing AMQP exchange instance', {
                exchange: name,
                options: options.queueOptions,
            });
            // Ensure queue exists in remote server
            yield this.channel.assertQueue(name, options.queueOptions);
            return Queue_1.default.from(name, this, Object.assign({ logger: this.logger }, options));
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
            return setTimeout(() => this.channel.nack(message, allUpTo, requeue), this.options.nackTimeout || defaults_1.NACK_TIMEOUT);
        });
    }
}
exports.default = Channel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9DaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSw2REFBNkM7QUFFN0MseUNBQXVEO0FBQ3ZELG1DQUFxQztBQUNyQyxtQ0FBOEM7QUFDOUMseUNBQTBDO0FBVTFDLE1BQXFCLE9BQU87SUFLMUIsWUFBc0IsT0FBb0IsRUFBUyxVQUFnQyxFQUFFO1FBQS9ELFlBQU8sR0FBUCxPQUFPLENBQWE7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUEyQjtRQUgzRSxjQUFTLEdBQXFCLEVBQUUsQ0FBQztRQUNqQyxlQUFVLEdBQWUsSUFBSSxrQkFBVSxFQUFFLENBQUM7UUFHbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLDRCQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDMUQsQ0FBQztJQUVNLE1BQU0sQ0FBTyxJQUFJLENBQU8sVUFBMEIsRUFBRSxPQUE2Qjs7WUFDdEYsTUFBTSxJQUFJLEdBQUcsTUFBTSxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDOUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEMsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDVSxLQUFLOztZQUNoQixNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDRyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQThCOztZQUNqRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsRUFBRTtnQkFDdkQsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO2dCQUNsQixPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWU7YUFDakMsQ0FBQyxDQUFDO1lBRUgsMENBQTBDO1lBQzFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUMzRixPQUFPLGtCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLGtCQUFJLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFLLE9BQU8sRUFBRyxDQUFDO1FBQ3hFLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0csS0FBSyxDQUFDLElBQUksRUFBRSxVQUF3QixFQUFFOztZQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsRUFBRTtnQkFDdkQsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsT0FBTyxFQUFFLE9BQU8sQ0FBQyxZQUFZO2FBQzlCLENBQUMsQ0FBQztZQUVILHVDQUF1QztZQUN2QyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0QsT0FBTyxlQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLGtCQUFJLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFLLE9BQU8sRUFBRyxDQUFDO1FBQ3JFLENBQUM7S0FBQTtJQUVLLFdBQVcsQ0FBQyxJQUFZLEVBQUUsT0FBZ0M7O1lBQzlELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELENBQUM7S0FBQTtJQUVLLFNBQVMsQ0FBQyxTQUFpQixFQUFFLFlBQW9CLEVBQUUsS0FBYTs7WUFDcEUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLElBQVMsRUFBRSxPQUE2Qjs7WUFDakYsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUUsQ0FBQztLQUFBO0lBRUssV0FBVyxDQUFDLElBQVksRUFBRSxJQUFTLEVBQUUsT0FBNkI7O1lBQ3RFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkUsQ0FBQztLQUFBO0lBRUssUUFBUSxDQUFDLEdBQVcsRUFBRSxNQUFnQjs7WUFDMUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLEtBQWEsRUFBRSxTQUFrRCxFQUFFLE9BQTZCOztZQUM1RyxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQWdCLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDL0YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZELENBQUM7S0FBQTtJQUVZLEdBQUcsQ0FBQyxPQUFvQixFQUFFLE9BQWlCOztZQUN0RCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1QyxDQUFDO0tBQUE7SUFFWSxJQUFJLENBQUMsT0FBb0IsRUFBRSxPQUFpQixFQUFFLE9BQWlCOztZQUMxRSxPQUFPLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLHVCQUFZLENBQUMsQ0FBQztRQUNsSCxDQUFDO0tBQUE7Q0FDRjtBQXJGRCwwQkFxRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFubmVsIGFzIEJhc2VDaGFubmVsLCBDb25uZWN0aW9uIGFzIEJhc2VDb25uZWN0aW9uIH0gZnJvbSBcImFtcXBsaWJcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCJ0cy1mcmFtZXdvcmstY29tbW9uXCI7XG5pbXBvcnQgeyBBTVFQT3B0aW9ucywgQU1RUE1lc3NhZ2UgfSBmcm9tIFwiLi9BTVFQXCI7XG5pbXBvcnQgRXhjaGFuZ2UsIHsgRXhjaGFuZ2VPcHRpb25zIH0gZnJvbSBcIi4vRXhjaGFuZ2VcIjtcbmltcG9ydCB7IFNlcmlhbGl6ZXIgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IFF1ZXVlLCB7IFF1ZXVlT3B0aW9ucyB9IGZyb20gXCIuL1F1ZXVlXCI7XG5pbXBvcnQgeyBOQUNLX1RJTUVPVVQgfSBmcm9tIFwiLi9kZWZhdWx0c1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENoYW5uZWxPcHRpb25zPERhdGE+IHtcbiAgbmFtZT86IHN0cmluZztcbiAgbG9nZ2VyPzogTG9nZ2VyO1xuICBuYWNrVGltZW91dD86IG51bWJlcjtcbiAgZXhjaGFuZ2VzPzogRXhjaGFuZ2U8RGF0YT5bXTtcbiAgc2VyaWFsaXplcj86IFNlcmlhbGl6ZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5uZWw8RGF0YT4ge1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHByb3RlY3RlZCBleGNoYW5nZXM6IEV4Y2hhbmdlPERhdGE+W10gPSBbXTtcbiAgcHJvdGVjdGVkIHNlcmlhbGl6ZXI6IFNlcmlhbGl6ZXIgPSBuZXcgU2VyaWFsaXplcigpO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjaGFubmVsOiBCYXNlQ2hhbm5lbCwgcHVibGljIG9wdGlvbnM6IENoYW5uZWxPcHRpb25zPERhdGE+ID0ge30pIHtcbiAgICB0aGlzLmxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyIHx8IExvZ2dlci5nZXRJbnN0YW5jZSgpO1xuICAgIHRoaXMuc2VyaWFsaXplciA9IG9wdGlvbnMuc2VyaWFsaXplciB8fCB0aGlzLnNlcmlhbGl6ZXI7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGFzeW5jIGZyb208RGF0YT4oY29ubmVjdGlvbjogQmFzZUNvbm5lY3Rpb24sIG9wdGlvbnM6IENoYW5uZWxPcHRpb25zPERhdGE+KTogUHJvbWlzZTxDaGFubmVsPERhdGE+PiB7XG4gICAgY29uc3QgYmFzZSA9IGF3YWl0IGNvbm5lY3Rpb24uY3JlYXRlQ2hhbm5lbCgpO1xuICAgIHJldHVybiBuZXcgQ2hhbm5lbChiYXNlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGNoYW5uZWwgY29ubmVjdGlvbi5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmNoYW5uZWwuY2xvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIGV4Y2hhbmdlIHJlYWR5IGZvciBwdWJsaXNoaW5nIGFuZCBjb25zdW1pbmcuXG4gICAqL1xuICBhc3luYyBleGNoYW5nZShuYW1lLCBvcHRpb25zOiBFeGNoYW5nZU9wdGlvbnM8RGF0YT4pOiBQcm9taXNlPEV4Y2hhbmdlPERhdGE+PiB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0luaXRpYWxpemluZyBBTVFQIGV4Y2hhbmdlIGluc3RhbmNlJywge1xuICAgICAgZXhjaGFuZ2U6IG5hbWUsXG4gICAgICBiaW5kOiBvcHRpb25zLmJpbmQsXG4gICAgICBvcHRpb25zOiBvcHRpb25zLmV4Y2hhbmdlT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIC8vIEVuc3VyZSBleGNoYW5nZSBleGlzdHMgaW4gcmVtb3RlIHNlcnZlclxuICAgIGF3YWl0IHRoaXMuY2hhbm5lbC5hc3NlcnRFeGNoYW5nZShuYW1lLCBvcHRpb25zLnR5cGUgfHwgJ2RpcmVjdCcsIG9wdGlvbnMuZXhjaGFuZ2VPcHRpb25zKTtcbiAgICByZXR1cm4gRXhjaGFuZ2UuZnJvbShuYW1lLCB0aGlzLCB7IGxvZ2dlcjogdGhpcy5sb2dnZXIsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHF1ZXVlIHJlYWR5IGZvciBwdWJsaXNoaW5nIGFuZCBjb25zdW1pbmcuXG4gICAqL1xuICBhc3luYyBxdWV1ZShuYW1lLCBvcHRpb25zOiBRdWV1ZU9wdGlvbnMgPSB7fSk6IFByb21pc2U8UXVldWU8RGF0YT4+IHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnSW5pdGlhbGl6aW5nIEFNUVAgZXhjaGFuZ2UgaW5zdGFuY2UnLCB7XG4gICAgICBleGNoYW5nZTogbmFtZSxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMucXVldWVPcHRpb25zLFxuICAgIH0pO1xuXG4gICAgLy8gRW5zdXJlIHF1ZXVlIGV4aXN0cyBpbiByZW1vdGUgc2VydmVyXG4gICAgYXdhaXQgdGhpcy5jaGFubmVsLmFzc2VydFF1ZXVlKG5hbWUsIG9wdGlvbnMucXVldWVPcHRpb25zKTtcbiAgICByZXR1cm4gUXVldWUuZnJvbShuYW1lLCB0aGlzLCB7IGxvZ2dlcjogdGhpcy5sb2dnZXIsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICBhc3luYyBhc3NlcnRRdWV1ZShuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IEFNUVBPcHRpb25zLkFzc2VydFF1ZXVlKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5hc3NlcnRRdWV1ZShuYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGJpbmRRdWV1ZShxdWV1ZU5hbWU6IHN0cmluZywgZXhjaGFuZ2VOYW1lOiBzdHJpbmcsIHJvdXRlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLmJpbmRRdWV1ZShxdWV1ZU5hbWUsIGV4Y2hhbmdlTmFtZSwgcm91dGUpO1xuICB9XG5cbiAgYXN5bmMgcHVibGlzaChuYW1lOiBzdHJpbmcsIHJvdXRlOiBzdHJpbmcsIGRhdGE6IGFueSwgb3B0aW9ucz86IEFNUVBPcHRpb25zLlB1Ymxpc2gpIHtcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShkYXRhKTtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLnB1Ymxpc2gobmFtZSwgcm91dGUsIEJ1ZmZlci5mcm9tKGNvbnRlbnQpLCBvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIHNlbmRUb1F1ZXVlKG5hbWU6IHN0cmluZywgZGF0YTogYW55LCBvcHRpb25zPzogQU1RUE9wdGlvbnMuUHVibGlzaCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKGRhdGEpO1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuc2VuZFRvUXVldWUobmFtZSwgQnVmZmVyLmZyb20oY29udGVudCksIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgcHJlZmV0Y2gobnVtOiBudW1iZXIsIGdsb2JhbD86IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLnByZWZldGNoKG51bSwgZ2xvYmFsKTtcbiAgfVxuXG4gIGFzeW5jIGNvbnN1bWUocXVldWU6IHN0cmluZywgb25NZXNzYWdlOiAoY29udGVudDogYW55LCBtc2c6IEFNUVBNZXNzYWdlKSA9PiBhbnksIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5Db25zdW1lKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IChtc2c6IEFNUVBNZXNzYWdlKSA9PiBvbk1lc3NhZ2UodGhpcy5zZXJpYWxpemVyLmRlc2VyaWFsaXplKG1zZy5jb250ZW50KSwgbXNnKTtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLmNvbnN1bWUocXVldWUsIHdyYXBwZXIsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGFjayhtZXNzYWdlOiBBTVFQTWVzc2FnZSwgYWxsVXBUbz86IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLmFjayhtZXNzYWdlLCBhbGxVcFRvKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBuYWNrKG1lc3NhZ2U6IEFNUVBNZXNzYWdlLCBhbGxVcFRvPzogYm9vbGVhbiwgcmVxdWV1ZT86IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB0aGlzLmNoYW5uZWwubmFjayhtZXNzYWdlLCBhbGxVcFRvLCByZXF1ZXVlKSwgdGhpcy5vcHRpb25zLm5hY2tUaW1lb3V0IHx8IE5BQ0tfVElNRU9VVCk7XG4gIH1cbn1cbiJdfQ==
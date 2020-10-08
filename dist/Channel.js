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
            const logger = options.logger || ts_framework_common_1.Logger.getInstance();
            const onError = options.onError || (err => logger.error(`Received error from AMQP channel ${options.name}`, err));
            const onClose = options.onClose || (() => logger.debug(`AMQP channel ${options.name} is closing`));
            base.on('error', onError);
            base.on('close', onClose);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9DaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsNkRBQTZEO0FBRTdELHlDQUF1RDtBQUN2RCxtQ0FBcUM7QUFDckMsbUNBQThDO0FBQzlDLHlDQUEwQztBQVkxQyxNQUFxQixPQUFPO0lBSzFCLFlBQXNCLE9BQW9CLEVBQVMsVUFBZ0MsRUFBRTtRQUEvRCxZQUFPLEdBQVAsT0FBTyxDQUFhO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBMkI7UUFIM0UsY0FBUyxHQUFxQixFQUFFLENBQUM7UUFDakMsZUFBVSxHQUFlLElBQUksa0JBQVUsRUFBRSxDQUFDO1FBR2xELElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSw0QkFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzFELENBQUM7SUFFTSxNQUFNLENBQU8sSUFBSSxDQUFPLFVBQTBCLEVBQUUsT0FBNkI7O1lBQ3RGLE1BQU0sSUFBSSxHQUFHLE1BQU0sVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRTlDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksNEJBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN0RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsSCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsT0FBTyxDQUFDLElBQUksYUFB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O1FBQzVDLENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxLQUFhLEVBQUUsU0FBa0QsRUFBRSxPQUE2Qjs7WUFDNUcsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFnQixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQy9GLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2RCxDQUFDO0tBQUE7SUFFWSxHQUFHLENBQUMsT0FBb0IsRUFBRSxPQUFpQjs7WUFDdEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUFBO0lBRVksSUFBSSxDQUFDLE9BQW9CLEVBQUUsT0FBaUIsRUFBRSxPQUFpQjs7WUFDMUUsT0FBTyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSx1QkFBWSxDQUFDLENBQUM7UUFDbEgsQ0FBQztLQUFBO0NBQ0Y7QUE1RkQsMEJBNEZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbm5lbCBhcyBCYXNlQ2hhbm5lbCwgQ29ubmVjdGlvbiBhcyBCYXNlQ29ubmVjdGlvbiB9IGZyb20gXCJhbXFwbGliXCI7XG5pbXBvcnQgeyBMb2dnZXIsIExvZ2dlckluc3RhbmNlIH0gZnJvbSBcInRzLWZyYW1ld29yay1jb21tb25cIjtcbmltcG9ydCB7IEFNUVBPcHRpb25zLCBBTVFQTWVzc2FnZSB9IGZyb20gXCIuL0FNUVBcIjtcbmltcG9ydCBFeGNoYW5nZSwgeyBFeGNoYW5nZU9wdGlvbnMgfSBmcm9tIFwiLi9FeGNoYW5nZVwiO1xuaW1wb3J0IHsgU2VyaWFsaXplciB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgUXVldWUsIHsgUXVldWVPcHRpb25zIH0gZnJvbSBcIi4vUXVldWVcIjtcbmltcG9ydCB7IE5BQ0tfVElNRU9VVCB9IGZyb20gXCIuL2RlZmF1bHRzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbm5lbE9wdGlvbnM8RGF0YT4ge1xuICBuYW1lPzogc3RyaW5nO1xuICBsb2dnZXI/OiBMb2dnZXJJbnN0YW5jZTtcbiAgbmFja1RpbWVvdXQ/OiBudW1iZXI7XG4gIGV4Y2hhbmdlcz86IEV4Y2hhbmdlPERhdGE+W107XG4gIHNlcmlhbGl6ZXI/OiBTZXJpYWxpemVyO1xuICBvbkVycm9yPzogKGVycjogYW55KSA9PiB2b2lkO1xuICBvbkNsb3NlPzogKGVycjogYW55KSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsPERhdGE+IHtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VySW5zdGFuY2U7XG4gIHByb3RlY3RlZCBleGNoYW5nZXM6IEV4Y2hhbmdlPERhdGE+W10gPSBbXTtcbiAgcHJvdGVjdGVkIHNlcmlhbGl6ZXI6IFNlcmlhbGl6ZXIgPSBuZXcgU2VyaWFsaXplcigpO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjaGFubmVsOiBCYXNlQ2hhbm5lbCwgcHVibGljIG9wdGlvbnM6IENoYW5uZWxPcHRpb25zPERhdGE+ID0ge30pIHtcbiAgICB0aGlzLmxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyIHx8IExvZ2dlci5nZXRJbnN0YW5jZSgpO1xuICAgIHRoaXMuc2VyaWFsaXplciA9IG9wdGlvbnMuc2VyaWFsaXplciB8fCB0aGlzLnNlcmlhbGl6ZXI7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGFzeW5jIGZyb208RGF0YT4oY29ubmVjdGlvbjogQmFzZUNvbm5lY3Rpb24sIG9wdGlvbnM6IENoYW5uZWxPcHRpb25zPERhdGE+KTogUHJvbWlzZTxDaGFubmVsPERhdGE+PiB7XG4gICAgY29uc3QgYmFzZSA9IGF3YWl0IGNvbm5lY3Rpb24uY3JlYXRlQ2hhbm5lbCgpO1xuXG4gICAgY29uc3QgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIgfHwgTG9nZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgY29uc3Qgb25FcnJvciA9IG9wdGlvbnMub25FcnJvciB8fCAoZXJyID0+IGxvZ2dlci5lcnJvcihgUmVjZWl2ZWQgZXJyb3IgZnJvbSBBTVFQIGNoYW5uZWwgJHtvcHRpb25zLm5hbWV9YCwgZXJyKSk7XG4gICAgY29uc3Qgb25DbG9zZSA9IG9wdGlvbnMub25DbG9zZSB8fCAoKCkgPT4gbG9nZ2VyLmRlYnVnKGBBTVFQIGNoYW5uZWwgJHtvcHRpb25zLm5hbWV9IGlzIGNsb3NpbmdgKSk7XG5cbiAgICBiYXNlLm9uKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgIGJhc2Uub24oJ2Nsb3NlJywgb25DbG9zZSk7XG5cbiAgICByZXR1cm4gbmV3IENoYW5uZWwoYmFzZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBjaGFubmVsIGNvbm5lY3Rpb24uXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5jaGFubmVsLmNsb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBleGNoYW5nZSByZWFkeSBmb3IgcHVibGlzaGluZyBhbmQgY29uc3VtaW5nLlxuICAgKi9cbiAgYXN5bmMgZXhjaGFuZ2UobmFtZSwgb3B0aW9uczogRXhjaGFuZ2VPcHRpb25zPERhdGE+KTogUHJvbWlzZTxFeGNoYW5nZTxEYXRhPj4ge1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdJbml0aWFsaXppbmcgQU1RUCBleGNoYW5nZSBpbnN0YW5jZScsIHtcbiAgICAgIGV4Y2hhbmdlOiBuYW1lLFxuICAgICAgYmluZDogb3B0aW9ucy5iaW5kLFxuICAgICAgb3B0aW9uczogb3B0aW9ucy5leGNoYW5nZU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICAvLyBFbnN1cmUgZXhjaGFuZ2UgZXhpc3RzIGluIHJlbW90ZSBzZXJ2ZXJcbiAgICBhd2FpdCB0aGlzLmNoYW5uZWwuYXNzZXJ0RXhjaGFuZ2UobmFtZSwgb3B0aW9ucy50eXBlIHx8ICdkaXJlY3QnLCBvcHRpb25zLmV4Y2hhbmdlT3B0aW9ucyk7XG4gICAgcmV0dXJuIEV4Y2hhbmdlLmZyb20obmFtZSwgdGhpcywgeyBsb2dnZXI6IHRoaXMubG9nZ2VyLCAuLi5vcHRpb25zIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBxdWV1ZSByZWFkeSBmb3IgcHVibGlzaGluZyBhbmQgY29uc3VtaW5nLlxuICAgKi9cbiAgYXN5bmMgcXVldWUobmFtZSwgb3B0aW9uczogUXVldWVPcHRpb25zID0ge30pOiBQcm9taXNlPFF1ZXVlPERhdGE+PiB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0luaXRpYWxpemluZyBBTVFQIGV4Y2hhbmdlIGluc3RhbmNlJywge1xuICAgICAgZXhjaGFuZ2U6IG5hbWUsXG4gICAgICBvcHRpb25zOiBvcHRpb25zLnF1ZXVlT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIC8vIEVuc3VyZSBxdWV1ZSBleGlzdHMgaW4gcmVtb3RlIHNlcnZlclxuICAgIHJldHVybiBRdWV1ZS5mcm9tKG5hbWUsIHRoaXMsIHsgbG9nZ2VyOiB0aGlzLmxvZ2dlciwgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIGFzeW5jIGFzc2VydFF1ZXVlKG5hbWU6IHN0cmluZywgb3B0aW9uczogQU1RUE9wdGlvbnMuQXNzZXJ0UXVldWUpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLmFzc2VydFF1ZXVlKG5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgYmluZFF1ZXVlKHF1ZXVlTmFtZTogc3RyaW5nLCBleGNoYW5nZU5hbWU6IHN0cmluZywgcm91dGU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuYmluZFF1ZXVlKHF1ZXVlTmFtZSwgZXhjaGFuZ2VOYW1lLCByb3V0ZSk7XG4gIH1cblxuICBhc3luYyBwdWJsaXNoKG5hbWU6IHN0cmluZywgcm91dGU6IHN0cmluZywgZGF0YTogYW55LCBvcHRpb25zPzogQU1RUE9wdGlvbnMuUHVibGlzaCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKGRhdGEpO1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwucHVibGlzaChuYW1lLCByb3V0ZSwgQnVmZmVyLmZyb20oY29udGVudCksIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgc2VuZFRvUXVldWUobmFtZTogc3RyaW5nLCBkYXRhOiBhbnksIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5QdWJsaXNoKSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoZGF0YSk7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5zZW5kVG9RdWV1ZShuYW1lLCBCdWZmZXIuZnJvbShjb250ZW50KSwgb3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBwcmVmZXRjaChudW06IG51bWJlciwgZ2xvYmFsPzogYm9vbGVhbikge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwucHJlZmV0Y2gobnVtLCBnbG9iYWwpO1xuICB9XG5cbiAgYXN5bmMgY29uc3VtZShxdWV1ZTogc3RyaW5nLCBvbk1lc3NhZ2U6IChjb250ZW50OiBhbnksIG1zZzogQU1RUE1lc3NhZ2UpID0+IGFueSwgb3B0aW9ucz86IEFNUVBPcHRpb25zLkNvbnN1bWUpIHtcbiAgICBjb25zdCB3cmFwcGVyID0gKG1zZzogQU1RUE1lc3NhZ2UpID0+IG9uTWVzc2FnZSh0aGlzLnNlcmlhbGl6ZXIuZGVzZXJpYWxpemUobXNnLmNvbnRlbnQpLCBtc2cpO1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuY29uc3VtZShxdWV1ZSwgd3JhcHBlciwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgYWNrKG1lc3NhZ2U6IEFNUVBNZXNzYWdlLCBhbGxVcFRvPzogYm9vbGVhbikge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuYWNrKG1lc3NhZ2UsIGFsbFVwVG8pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIG5hY2sobWVzc2FnZTogQU1RUE1lc3NhZ2UsIGFsbFVwVG8/OiBib29sZWFuLCByZXF1ZXVlPzogYm9vbGVhbikge1xuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHRoaXMuY2hhbm5lbC5uYWNrKG1lc3NhZ2UsIGFsbFVwVG8sIHJlcXVldWUpLCB0aGlzLm9wdGlvbnMubmFja1RpbWVvdXQgfHwgTkFDS19USU1FT1VUKTtcbiAgfVxufVxuIl19
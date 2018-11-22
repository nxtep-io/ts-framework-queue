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
            return setTimeout(() => this.channel.nack(message, allUpTo, requeue), this.options.nackTimeout || exports.NACK_TIMEOUT);
        });
    }
}
exports.default = Channel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9DaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSw2REFBNkM7QUFFN0MseUNBQXVEO0FBQ3ZELG1DQUFxQztBQUNyQyxtQ0FBOEM7QUFFakMsUUFBQSxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBVWxDLE1BQXFCLE9BQU87SUFLMUIsWUFBc0IsT0FBb0IsRUFBUyxVQUFnQyxFQUFFO1FBQS9ELFlBQU8sR0FBUCxPQUFPLENBQWE7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUEyQjtRQUgzRSxjQUFTLEdBQXFCLEVBQUUsQ0FBQztRQUNqQyxlQUFVLEdBQWUsSUFBSSxrQkFBVSxFQUFFLENBQUM7UUFHbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLDRCQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDMUQsQ0FBQztJQUVNLE1BQU0sQ0FBTyxJQUFJLENBQU8sVUFBMEIsRUFBRSxPQUE2Qjs7WUFDdEYsTUFBTSxJQUFJLEdBQUcsTUFBTSxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDOUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEMsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDVSxLQUFLOztZQUNoQixNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDRyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQStCOztZQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsRUFBRTtnQkFDdkQsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJ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LENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1QyxDQUFDO0tBQUE7SUFFWSxJQUFJLENBQUMsT0FBb0IsRUFBRSxPQUFpQixFQUFFLE9BQWlCOztZQUMxRSxPQUFPLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLG9CQUFZLENBQUMsQ0FBQztRQUNsSCxDQUFDO0tBQUE7Q0FDRjtBQXJGRCwwQkFxRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFubmVsIGFzIEJhc2VDaGFubmVsLCBDb25uZWN0aW9uIGFzIEJhc2VDb25uZWN0aW9uIH0gZnJvbSBcImFtcXBsaWJcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCJ0cy1mcmFtZXdvcmstY29tbW9uXCI7XG5pbXBvcnQgeyBBTVFQT3B0aW9ucywgQU1RUE1lc3NhZ2UgfSBmcm9tIFwiLi9BTVFQXCI7XG5pbXBvcnQgRXhjaGFuZ2UsIHsgRXhjaGFuZ2VPcHRpb25zIH0gZnJvbSBcIi4vRXhjaGFuZ2VcIjtcbmltcG9ydCB7IFNlcmlhbGl6ZXIgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IFF1ZXVlLCB7IFF1ZXVlT3B0aW9ucyB9IGZyb20gXCIuL1F1ZXVlXCI7XG5cbmV4cG9ydCBjb25zdCBOQUNLX1RJTUVPVVQgPSAzMDAwMDtcblxuZXhwb3J0IGludGVyZmFjZSBDaGFubmVsT3B0aW9uczxEYXRhPiB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGxvZ2dlcj86IExvZ2dlcjtcbiAgbmFja1RpbWVvdXQ/OiBudW1iZXI7XG4gIGV4Y2hhbmdlcz86IEV4Y2hhbmdlPERhdGE+W107XG4gIHNlcmlhbGl6ZXI/OiBTZXJpYWxpemVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsPERhdGE+IHtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VyO1xuICBwcm90ZWN0ZWQgZXhjaGFuZ2VzOiBFeGNoYW5nZTxEYXRhPltdID0gW107XG4gIHByb3RlY3RlZCBzZXJpYWxpemVyOiBTZXJpYWxpemVyID0gbmV3IFNlcmlhbGl6ZXIoKTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgY2hhbm5lbDogQmFzZUNoYW5uZWwsIHB1YmxpYyBvcHRpb25zOiBDaGFubmVsT3B0aW9uczxEYXRhPiA9IHt9KSB7XG4gICAgdGhpcy5sb2dnZXIgPSBvcHRpb25zLmxvZ2dlciB8fCBMb2dnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICB0aGlzLnNlcmlhbGl6ZXIgPSBvcHRpb25zLnNlcmlhbGl6ZXIgfHwgdGhpcy5zZXJpYWxpemVyO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBhc3luYyBmcm9tPERhdGE+KGNvbm5lY3Rpb246IEJhc2VDb25uZWN0aW9uLCBvcHRpb25zOiBDaGFubmVsT3B0aW9uczxEYXRhPik6IFByb21pc2U8Q2hhbm5lbDxEYXRhPj4ge1xuICAgIGNvbnN0IGJhc2UgPSBhd2FpdCBjb25uZWN0aW9uLmNyZWF0ZUNoYW5uZWwoKTtcbiAgICByZXR1cm4gbmV3IENoYW5uZWwoYmFzZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBjaGFubmVsIGNvbm5lY3Rpb24uXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5jaGFubmVsLmNsb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBleGNoYW5nZSByZWFkeSBmb3IgcHVibGlzaGluZyBhbmQgY29uc3VtaW5nLlxuICAgKi9cbiAgYXN5bmMgZXhjaGFuZ2UobmFtZSwgb3B0aW9ucz86IEV4Y2hhbmdlT3B0aW9uczxEYXRhPik6IFByb21pc2U8RXhjaGFuZ2U8RGF0YT4+IHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnSW5pdGlhbGl6aW5nIEFNUVAgZXhjaGFuZ2UgaW5zdGFuY2UnLCB7XG4gICAgICBleGNoYW5nZTogbmFtZSxcbiAgICAgIGJpbmQ6IG9wdGlvbnMuYmluZCxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMuZXhjaGFuZ2VPcHRpb25zLFxuICAgIH0pO1xuXG4gICAgLy8gRW5zdXJlIGV4Y2hhbmdlIGV4aXN0cyBpbiByZW1vdGUgc2VydmVyXG4gICAgYXdhaXQgdGhpcy5jaGFubmVsLmFzc2VydEV4Y2hhbmdlKG5hbWUsIG9wdGlvbnMudHlwZSB8fCAnZGlyZWN0Jywgb3B0aW9ucy5leGNoYW5nZU9wdGlvbnMpO1xuICAgIHJldHVybiBFeGNoYW5nZS5mcm9tKG5hbWUsIHRoaXMsIHsgbG9nZ2VyOiB0aGlzLmxvZ2dlciwgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgcXVldWUgcmVhZHkgZm9yIHB1Ymxpc2hpbmcgYW5kIGNvbnN1bWluZy5cbiAgICovXG4gIGFzeW5jIHF1ZXVlKG5hbWUsIG9wdGlvbnM6IFF1ZXVlT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxRdWV1ZTxEYXRhPj4ge1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdJbml0aWFsaXppbmcgQU1RUCBleGNoYW5nZSBpbnN0YW5jZScsIHtcbiAgICAgIGV4Y2hhbmdlOiBuYW1lLFxuICAgICAgb3B0aW9uczogb3B0aW9ucy5xdWV1ZU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICAvLyBFbnN1cmUgcXVldWUgZXhpc3RzIGluIHJlbW90ZSBzZXJ2ZXJcbiAgICBhd2FpdCB0aGlzLmNoYW5uZWwuYXNzZXJ0UXVldWUobmFtZSwgb3B0aW9ucy5xdWV1ZU9wdGlvbnMpO1xuICAgIHJldHVybiBRdWV1ZS5mcm9tKG5hbWUsIHRoaXMsIHsgbG9nZ2VyOiB0aGlzLmxvZ2dlciwgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIGFzeW5jIGFzc2VydFF1ZXVlKG5hbWU6IHN0cmluZywgb3B0aW9uczogQU1RUE9wdGlvbnMuQXNzZXJ0UXVldWUpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLmFzc2VydFF1ZXVlKG5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgYmluZFF1ZXVlKHF1ZXVlTmFtZTogc3RyaW5nLCBleGNoYW5nZU5hbWU6IHN0cmluZywgcm91dGU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuYmluZFF1ZXVlKHF1ZXVlTmFtZSwgZXhjaGFuZ2VOYW1lLCByb3V0ZSk7XG4gIH1cblxuICBhc3luYyBwdWJsaXNoKG5hbWU6IHN0cmluZywgcm91dGU6IHN0cmluZywgZGF0YTogYW55LCBvcHRpb25zPzogQU1RUE9wdGlvbnMuUHVibGlzaCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKGRhdGEpO1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwucHVibGlzaChuYW1lLCByb3V0ZSwgQnVmZmVyLmZyb20oY29udGVudCksIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgc2VuZFRvUXVldWUobmFtZTogc3RyaW5nLCBkYXRhOiBhbnksIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5QdWJsaXNoKSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoZGF0YSk7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5zZW5kVG9RdWV1ZShuYW1lLCBCdWZmZXIuZnJvbShjb250ZW50KSwgb3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBwcmVmZXRjaChudW06IG51bWJlciwgZ2xvYmFsPzogYm9vbGVhbikge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwucHJlZmV0Y2gobnVtLCBnbG9iYWwpO1xuICB9XG5cbiAgYXN5bmMgY29uc3VtZShxdWV1ZTogc3RyaW5nLCBvbk1lc3NhZ2U6IChjb250ZW50OiBhbnksIG1zZzogQU1RUE1lc3NhZ2UpID0+IGFueSwgb3B0aW9ucz86IEFNUVBPcHRpb25zLkNvbnN1bWUpIHtcbiAgICBjb25zdCB3cmFwcGVyID0gKG1zZzogQU1RUE1lc3NhZ2UpID0+IG9uTWVzc2FnZSh0aGlzLnNlcmlhbGl6ZXIuZGVzZXJpYWxpemUobXNnLmNvbnRlbnQpLCBtc2cpO1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuY29uc3VtZShxdWV1ZSwgd3JhcHBlciwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgYWNrKG1lc3NhZ2U6IEFNUVBNZXNzYWdlLCBhbGxVcFRvPzogYm9vbGVhbikge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuYWNrKG1lc3NhZ2UsIGFsbFVwVG8pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIG5hY2sobWVzc2FnZTogQU1RUE1lc3NhZ2UsIGFsbFVwVG8/OiBib29sZWFuLCByZXF1ZXVlPzogYm9vbGVhbikge1xuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHRoaXMuY2hhbm5lbC5uYWNrKG1lc3NhZ2UsIGFsbFVwVG8sIHJlcXVldWUpLCB0aGlzLm9wdGlvbnMubmFja1RpbWVvdXQgfHwgTkFDS19USU1FT1VUKTtcbiAgfVxufVxuIl19
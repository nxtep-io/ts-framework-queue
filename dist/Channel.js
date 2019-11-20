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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9DaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSw2REFBNkQ7QUFFN0QseUNBQXVEO0FBQ3ZELG1DQUFxQztBQUNyQyxtQ0FBOEM7QUFDOUMseUNBQTBDO0FBWTFDLE1BQXFCLE9BQU87SUFLMUIsWUFBc0IsT0FBb0IsRUFBUyxVQUFnQyxFQUFFO1FBQS9ELFlBQU8sR0FBUCxPQUFPLENBQWE7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUEyQjtRQUgzRSxjQUFTLEdBQXFCLEVBQUUsQ0FBQztRQUNqQyxlQUFVLEdBQWUsSUFBSSxrQkFBVSxFQUFFLENBQUM7UUFHbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLDRCQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDMUQsQ0FBQztJQUVNLE1BQU0sQ0FBTyxJQUFJLENBQU8sVUFBMEIsRUFBRSxPQUE2Qjs7WUFDdEYsTUFBTSxJQUFJLEdBQUcsTUFBTSxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFOUMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSw0QkFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3RELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xILE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixPQUFPLENBQUMsSUFBSSxhQUFh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UUFDNUMsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLEtBQWEsRUFBRSxTQUFrRCxFQUFFLE9BQTZCOztZQUM1RyxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQWdCLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDL0YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZELENBQUM7S0FBQTtJQUVZLEdBQUcsQ0FBQyxPQUFvQixFQUFFLE9BQWlCOztZQUN0RCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1QyxDQUFDO0tBQUE7SUFFWSxJQUFJLENBQUMsT0FBb0IsRUFBRSxPQUFpQixFQUFFLE9BQWlCOztZQUMxRSxPQUFPLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLHVCQUFZLENBQUMsQ0FBQztRQUNsSCxDQUFDO0tBQUE7Q0FDRjtBQTVGRCwwQkE0RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFubmVsIGFzIEJhc2VDaGFubmVsLCBDb25uZWN0aW9uIGFzIEJhc2VDb25uZWN0aW9uIH0gZnJvbSBcImFtcXBsaWJcIjtcbmltcG9ydCB7IExvZ2dlciwgTG9nZ2VySW5zdGFuY2UgfSBmcm9tIFwidHMtZnJhbWV3b3JrLWNvbW1vblwiO1xuaW1wb3J0IHsgQU1RUE9wdGlvbnMsIEFNUVBNZXNzYWdlIH0gZnJvbSBcIi4vQU1RUFwiO1xuaW1wb3J0IEV4Y2hhbmdlLCB7IEV4Y2hhbmdlT3B0aW9ucyB9IGZyb20gXCIuL0V4Y2hhbmdlXCI7XG5pbXBvcnQgeyBTZXJpYWxpemVyIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBRdWV1ZSwgeyBRdWV1ZU9wdGlvbnMgfSBmcm9tIFwiLi9RdWV1ZVwiO1xuaW1wb3J0IHsgTkFDS19USU1FT1VUIH0gZnJvbSBcIi4vZGVmYXVsdHNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDaGFubmVsT3B0aW9uczxEYXRhPiB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGxvZ2dlcj86IExvZ2dlckluc3RhbmNlO1xuICBuYWNrVGltZW91dD86IG51bWJlcjtcbiAgZXhjaGFuZ2VzPzogRXhjaGFuZ2U8RGF0YT5bXTtcbiAgc2VyaWFsaXplcj86IFNlcmlhbGl6ZXI7XG4gIG9uRXJyb3I/OiAoZXJyOiBhbnkpID0+IHZvaWQ7XG4gIG9uQ2xvc2U/OiAoZXJyOiBhbnkpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5uZWw8RGF0YT4ge1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXJJbnN0YW5jZTtcbiAgcHJvdGVjdGVkIGV4Y2hhbmdlczogRXhjaGFuZ2U8RGF0YT5bXSA9IFtdO1xuICBwcm90ZWN0ZWQgc2VyaWFsaXplcjogU2VyaWFsaXplciA9IG5ldyBTZXJpYWxpemVyKCk7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGNoYW5uZWw6IEJhc2VDaGFubmVsLCBwdWJsaWMgb3B0aW9uczogQ2hhbm5lbE9wdGlvbnM8RGF0YT4gPSB7fSkge1xuICAgIHRoaXMubG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIgfHwgTG9nZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgdGhpcy5zZXJpYWxpemVyID0gb3B0aW9ucy5zZXJpYWxpemVyIHx8IHRoaXMuc2VyaWFsaXplcjtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgYXN5bmMgZnJvbTxEYXRhPihjb25uZWN0aW9uOiBCYXNlQ29ubmVjdGlvbiwgb3B0aW9uczogQ2hhbm5lbE9wdGlvbnM8RGF0YT4pOiBQcm9taXNlPENoYW5uZWw8RGF0YT4+IHtcbiAgICBjb25zdCBiYXNlID0gYXdhaXQgY29ubmVjdGlvbi5jcmVhdGVDaGFubmVsKCk7XG5cbiAgICBjb25zdCBsb2dnZXIgPSBvcHRpb25zLmxvZ2dlciB8fCBMb2dnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICBjb25zdCBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yIHx8IChlcnIgPT4gbG9nZ2VyLmVycm9yKGBSZWNlaXZlZCBlcnJvciBmcm9tIEFNUVAgY2hhbm5lbCAke29wdGlvbnMubmFtZX1gLCBlcnIpKTtcbiAgICBjb25zdCBvbkNsb3NlID0gb3B0aW9ucy5vbkNsb3NlIHx8ICgoKSA9PiBsb2dnZXIuZGVidWcoYEFNUVAgY2hhbm5lbCAke29wdGlvbnMubmFtZX0gaXMgY2xvc2luZ2ApKTtcblxuICAgIGJhc2Uub24oJ2Vycm9yJywgb25FcnJvcik7XG4gICAgYmFzZS5vbignY2xvc2UnLCBvbkNsb3NlKTtcblxuICAgIHJldHVybiBuZXcgQ2hhbm5lbChiYXNlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGNoYW5uZWwgY29ubmVjdGlvbi5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmNoYW5uZWwuY2xvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIGV4Y2hhbmdlIHJlYWR5IGZvciBwdWJsaXNoaW5nIGFuZCBjb25zdW1pbmcuXG4gICAqL1xuICBhc3luYyBleGNoYW5nZShuYW1lLCBvcHRpb25zOiBFeGNoYW5nZU9wdGlvbnM8RGF0YT4pOiBQcm9taXNlPEV4Y2hhbmdlPERhdGE+PiB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0luaXRpYWxpemluZyBBTVFQIGV4Y2hhbmdlIGluc3RhbmNlJywge1xuICAgICAgZXhjaGFuZ2U6IG5hbWUsXG4gICAgICBiaW5kOiBvcHRpb25zLmJpbmQsXG4gICAgICBvcHRpb25zOiBvcHRpb25zLmV4Y2hhbmdlT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIC8vIEVuc3VyZSBleGNoYW5nZSBleGlzdHMgaW4gcmVtb3RlIHNlcnZlclxuICAgIGF3YWl0IHRoaXMuY2hhbm5lbC5hc3NlcnRFeGNoYW5nZShuYW1lLCBvcHRpb25zLnR5cGUgfHwgJ2RpcmVjdCcsIG9wdGlvbnMuZXhjaGFuZ2VPcHRpb25zKTtcbiAgICByZXR1cm4gRXhjaGFuZ2UuZnJvbShuYW1lLCB0aGlzLCB7IGxvZ2dlcjogdGhpcy5sb2dnZXIsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHF1ZXVlIHJlYWR5IGZvciBwdWJsaXNoaW5nIGFuZCBjb25zdW1pbmcuXG4gICAqL1xuICBhc3luYyBxdWV1ZShuYW1lLCBvcHRpb25zOiBRdWV1ZU9wdGlvbnMgPSB7fSk6IFByb21pc2U8UXVldWU8RGF0YT4+IHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnSW5pdGlhbGl6aW5nIEFNUVAgZXhjaGFuZ2UgaW5zdGFuY2UnLCB7XG4gICAgICBleGNoYW5nZTogbmFtZSxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMucXVldWVPcHRpb25zLFxuICAgIH0pO1xuXG4gICAgLy8gRW5zdXJlIHF1ZXVlIGV4aXN0cyBpbiByZW1vdGUgc2VydmVyXG4gICAgcmV0dXJuIFF1ZXVlLmZyb20obmFtZSwgdGhpcywgeyBsb2dnZXI6IHRoaXMubG9nZ2VyLCAuLi5vcHRpb25zIH0pO1xuICB9XG5cbiAgYXN5bmMgYXNzZXJ0UXVldWUobmFtZTogc3RyaW5nLCBvcHRpb25zOiBBTVFQT3B0aW9ucy5Bc3NlcnRRdWV1ZSkge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWwuYXNzZXJ0UXVldWUobmFtZSwgb3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBiaW5kUXVldWUocXVldWVOYW1lOiBzdHJpbmcsIGV4Y2hhbmdlTmFtZTogc3RyaW5nLCByb3V0ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5iaW5kUXVldWUocXVldWVOYW1lLCBleGNoYW5nZU5hbWUsIHJvdXRlKTtcbiAgfVxuXG4gIGFzeW5jIHB1Ymxpc2gobmFtZTogc3RyaW5nLCByb3V0ZTogc3RyaW5nLCBkYXRhOiBhbnksIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5QdWJsaXNoKSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoZGF0YSk7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5wdWJsaXNoKG5hbWUsIHJvdXRlLCBCdWZmZXIuZnJvbShjb250ZW50KSwgb3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBzZW5kVG9RdWV1ZShuYW1lOiBzdHJpbmcsIGRhdGE6IGFueSwgb3B0aW9ucz86IEFNUVBPcHRpb25zLlB1Ymxpc2gpIHtcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShkYXRhKTtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsLnNlbmRUb1F1ZXVlKG5hbWUsIEJ1ZmZlci5mcm9tKGNvbnRlbnQpLCBvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIHByZWZldGNoKG51bTogbnVtYmVyLCBnbG9iYWw/OiBib29sZWFuKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5wcmVmZXRjaChudW0sIGdsb2JhbCk7XG4gIH1cblxuICBhc3luYyBjb25zdW1lKHF1ZXVlOiBzdHJpbmcsIG9uTWVzc2FnZTogKGNvbnRlbnQ6IGFueSwgbXNnOiBBTVFQTWVzc2FnZSkgPT4gYW55LCBvcHRpb25zPzogQU1RUE9wdGlvbnMuQ29uc3VtZSkge1xuICAgIGNvbnN0IHdyYXBwZXIgPSAobXNnOiBBTVFQTWVzc2FnZSkgPT4gb25NZXNzYWdlKHRoaXMuc2VyaWFsaXplci5kZXNlcmlhbGl6ZShtc2cuY29udGVudCksIG1zZyk7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5jb25zdW1lKHF1ZXVlLCB3cmFwcGVyLCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBhY2sobWVzc2FnZTogQU1RUE1lc3NhZ2UsIGFsbFVwVG8/OiBib29sZWFuKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5hY2sobWVzc2FnZSwgYWxsVXBUbyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgbmFjayhtZXNzYWdlOiBBTVFQTWVzc2FnZSwgYWxsVXBUbz86IGJvb2xlYW4sIHJlcXVldWU/OiBib29sZWFuKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5jaGFubmVsLm5hY2sobWVzc2FnZSwgYWxsVXBUbywgcmVxdWV1ZSksIHRoaXMub3B0aW9ucy5uYWNrVGltZW91dCB8fCBOQUNLX1RJTUVPVVQpO1xuICB9XG59XG4iXX0=
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
exports.QueueActions = exports.ExchangeActions = void 0;
class ExchangeActions {
    constructor(exchange, message) {
        this.exchange = exchange;
        this.message = message;
    }
    ack(allUpTo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.exchange.channel.ack(this.message, allUpTo);
        });
    }
    nack(allUpTo, requeue) {
        return __awaiter(this, void 0, void 0, function* () {
            this.exchange.channel.nack(this.message, allUpTo, requeue);
        });
    }
    publish(route, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.exchange.publish(route, data, options);
            return true;
        });
    }
}
exports.ExchangeActions = ExchangeActions;
class QueueActions {
    constructor(queue, message) {
        this.queue = queue;
        this.message = message;
    }
    ack(allUpTo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue.channel.ack(this.message, allUpTo);
        });
    }
    nack(allUpTo, requeue) {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue.channel.nack(this.message, allUpTo, requeue);
        });
    }
    publish(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue.publish(data, options);
            return true;
        });
    }
}
exports.QueueActions = QueueActions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQU1RUEFjdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvQU1RUEFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBVUEsTUFBYSxlQUFlO0lBQzFCLFlBQW1CLFFBQXdCLEVBQVMsT0FBb0I7UUFBckQsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFhO0lBRXhFLENBQUM7SUFFWSxHQUFHLENBQUMsT0FBaUI7O1lBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ2xELENBQUM7S0FBQTtJQUVZLElBQUksQ0FBQyxPQUFpQixFQUFFLE9BQWlCOztZQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDNUQsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBNkI7O1lBQ3RELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUMsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7Q0FDRjtBQWpCRCwwQ0FpQkM7QUFFRCxNQUFhLFlBQVk7SUFDdkIsWUFBbUIsS0FBa0IsRUFBUyxPQUFvQjtRQUEvQyxVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBYTtJQUVsRSxDQUFDO0lBRVksR0FBRyxDQUFDLE9BQWlCOztZQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUMvQyxDQUFDO0tBQUE7SUFFWSxJQUFJLENBQUMsT0FBaUIsRUFBRSxPQUFpQjs7WUFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3pELENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBNkI7O1lBQy9DLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNsQyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FBQTtDQUNGO0FBakJELG9DQWlCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFNUVBNZXNzYWdlLCBBTVFQT3B0aW9ucyB9IGZyb20gXCIuLi9BTVFQXCI7XG5pbXBvcnQgRXhjaGFuZ2UgZnJvbSBcIi4uL0V4Y2hhbmdlXCI7XG5pbXBvcnQgUXVldWUgZnJvbSBcIi4uL1F1ZXVlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQU1RUEFjdGlvbnNJbnRmPERhdGE+IHtcbiAgYWNrKGFsbFVwVG8/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPjtcbiAgbmFjayhhbGxVcFRvPzogYm9vbGVhbiwgcmVxdWV1ZT86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+O1xuICBwdWJsaXNoKHJvdXRlOiBzdHJpbmcsIGRhdGE6IERhdGEsIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5QdWJsaXNoKTogUHJvbWlzZTxib29sZWFuPjtcbn1cblxuZXhwb3J0IGNsYXNzIEV4Y2hhbmdlQWN0aW9uczxEYXRhPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBleGNoYW5nZTogRXhjaGFuZ2U8RGF0YT4sIHB1YmxpYyBtZXNzYWdlOiBBTVFQTWVzc2FnZSkge1xuXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgYWNrKGFsbFVwVG8/OiBib29sZWFuKSB7XG4gICAgdGhpcy5leGNoYW5nZS5jaGFubmVsLmFjayh0aGlzLm1lc3NhZ2UsIGFsbFVwVG8pXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgbmFjayhhbGxVcFRvPzogYm9vbGVhbiwgcmVxdWV1ZT86IGJvb2xlYW4pIHtcbiAgICB0aGlzLmV4Y2hhbmdlLmNoYW5uZWwubmFjayh0aGlzLm1lc3NhZ2UsIGFsbFVwVG8sIHJlcXVldWUpXG4gIH1cblxuICBhc3luYyBwdWJsaXNoKHJvdXRlLCBkYXRhLCBvcHRpb25zPzogQU1RUE9wdGlvbnMuUHVibGlzaCkge1xuICAgIHRoaXMuZXhjaGFuZ2UucHVibGlzaChyb3V0ZSwgZGF0YSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFF1ZXVlQWN0aW9uczxEYXRhPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBxdWV1ZTogUXVldWU8RGF0YT4sIHB1YmxpYyBtZXNzYWdlOiBBTVFQTWVzc2FnZSkge1xuXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgYWNrKGFsbFVwVG8/OiBib29sZWFuKSB7XG4gICAgdGhpcy5xdWV1ZS5jaGFubmVsLmFjayh0aGlzLm1lc3NhZ2UsIGFsbFVwVG8pXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgbmFjayhhbGxVcFRvPzogYm9vbGVhbiwgcmVxdWV1ZT86IGJvb2xlYW4pIHtcbiAgICB0aGlzLnF1ZXVlLmNoYW5uZWwubmFjayh0aGlzLm1lc3NhZ2UsIGFsbFVwVG8sIHJlcXVldWUpXG4gIH1cblxuICBhc3luYyBwdWJsaXNoKGRhdGEsIG9wdGlvbnM/OiBBTVFQT3B0aW9ucy5QdWJsaXNoKSB7XG4gICAgdGhpcy5xdWV1ZS5wdWJsaXNoKGRhdGEsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iXX0=
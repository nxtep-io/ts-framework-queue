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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQU1RUEFjdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvQU1RUEFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVVBLE1BQWEsZUFBZTtJQUMxQixZQUFtQixRQUF3QixFQUFTLE9BQW9CO1FBQXJELGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBYTtJQUV4RSxDQUFDO0lBRVksR0FBRyxDQUFDLE9BQWlCOztZQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNsRCxDQUFDO0tBQUE7SUFFWSxJQUFJLENBQUMsT0FBaUIsRUFBRSxPQUFpQjs7WUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQzVELENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQTZCOztZQUN0RCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUFBO0NBQ0Y7QUFqQkQsMENBaUJDO0FBRUQsTUFBYSxZQUFZO0lBQ3ZCLFlBQW1CLEtBQWtCLEVBQVMsT0FBb0I7UUFBL0MsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWE7SUFFbEUsQ0FBQztJQUVZLEdBQUcsQ0FBQyxPQUFpQjs7WUFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDL0MsQ0FBQztLQUFBO0lBRVksSUFBSSxDQUFDLE9BQWlCLEVBQUUsT0FBaUI7O1lBQ3BELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUN6RCxDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQTZCOztZQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbEMsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7Q0FDRjtBQWpCRCxvQ0FpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBTVFQTWVzc2FnZSwgQU1RUE9wdGlvbnMgfSBmcm9tIFwiLi4vQU1RUFwiO1xuaW1wb3J0IEV4Y2hhbmdlIGZyb20gXCIuLi9FeGNoYW5nZVwiO1xuaW1wb3J0IFF1ZXVlIGZyb20gXCIuLi9RdWV1ZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFNUVBBY3Rpb25zSW50ZjxEYXRhPiB7XG4gIGFjayhhbGxVcFRvPzogYm9vbGVhbik6IFByb21pc2U8dm9pZD47XG4gIG5hY2soYWxsVXBUbz86IGJvb2xlYW4sIHJlcXVldWU/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPjtcbiAgcHVibGlzaChyb3V0ZTogc3RyaW5nLCBkYXRhOiBEYXRhLCBvcHRpb25zPzogQU1RUE9wdGlvbnMuUHVibGlzaCk6IFByb21pc2U8Ym9vbGVhbj47XG59XG5cbmV4cG9ydCBjbGFzcyBFeGNoYW5nZUFjdGlvbnM8RGF0YT4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZXhjaGFuZ2U6IEV4Y2hhbmdlPERhdGE+LCBwdWJsaWMgbWVzc2FnZTogQU1RUE1lc3NhZ2UpIHtcblxuICB9XG5cbiAgcHVibGljIGFzeW5jIGFjayhhbGxVcFRvPzogYm9vbGVhbikge1xuICAgIHRoaXMuZXhjaGFuZ2UuY2hhbm5lbC5hY2sodGhpcy5tZXNzYWdlLCBhbGxVcFRvKVxuICB9XG5cbiAgcHVibGljIGFzeW5jIG5hY2soYWxsVXBUbz86IGJvb2xlYW4sIHJlcXVldWU/OiBib29sZWFuKSB7XG4gICAgdGhpcy5leGNoYW5nZS5jaGFubmVsLm5hY2sodGhpcy5tZXNzYWdlLCBhbGxVcFRvLCByZXF1ZXVlKVxuICB9XG5cbiAgYXN5bmMgcHVibGlzaChyb3V0ZSwgZGF0YSwgb3B0aW9ucz86IEFNUVBPcHRpb25zLlB1Ymxpc2gpIHtcbiAgICB0aGlzLmV4Y2hhbmdlLnB1Ymxpc2gocm91dGUsIGRhdGEsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBRdWV1ZUFjdGlvbnM8RGF0YT4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcXVldWU6IFF1ZXVlPERhdGE+LCBwdWJsaWMgbWVzc2FnZTogQU1RUE1lc3NhZ2UpIHtcblxuICB9XG5cbiAgcHVibGljIGFzeW5jIGFjayhhbGxVcFRvPzogYm9vbGVhbikge1xuICAgIHRoaXMucXVldWUuY2hhbm5lbC5hY2sodGhpcy5tZXNzYWdlLCBhbGxVcFRvKVxuICB9XG5cbiAgcHVibGljIGFzeW5jIG5hY2soYWxsVXBUbz86IGJvb2xlYW4sIHJlcXVldWU/OiBib29sZWFuKSB7XG4gICAgdGhpcy5xdWV1ZS5jaGFubmVsLm5hY2sodGhpcy5tZXNzYWdlLCBhbGxVcFRvLCByZXF1ZXVlKVxuICB9XG5cbiAgYXN5bmMgcHVibGlzaChkYXRhLCBvcHRpb25zPzogQU1RUE9wdGlvbnMuUHVibGlzaCkge1xuICAgIHRoaXMucXVldWUucHVibGlzaChkYXRhLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIl19
export class Notification {
    id: number;
    message: string;
    timestamp: string;


    constructor(id: number, message: string, timestamp: string) {
        this.id = id;
        this.message = message;
        this.timestamp = timestamp;
  }
}
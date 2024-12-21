export class Review {
    reviewer: string;
    status: string;
    comment: string;


    constructor(comment: string, status: string, reviewer: string) {
        this.comment = comment;
        this.status = status;
        this.reviewer = reviewer;

  }
}
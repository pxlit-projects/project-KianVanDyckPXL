export class Comment {
    comment: string;
    author: string;
    postId: string;



    constructor(content: string, author: string, postId: string) {
        this.comment = content;
        this.author = author;
        this.postId = postId
  }
}
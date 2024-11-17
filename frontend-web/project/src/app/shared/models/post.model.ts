export class Post {
    title: string;
    content: string;
    author: string;
    isConcept: boolean;



    constructor(title: string, content: string, author: string, isConcept: boolean) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.isConcept = isConcept;
  }
}
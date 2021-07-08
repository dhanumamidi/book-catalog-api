export class Book {
    private title: string;
    private description: string;
    private author: string;
    private year: number;
    private cover: string;
    private isbn: string;


  constructor(
    title: string, 
    description: string, 
    author: string, 
    year: number, 
    cover: string, 
    isbn: string
) {
    this.title = title
    this.description = description
    this.author = author
    this.year = year
    this.cover = cover
    this.isbn = isbn
  }

}
import firebase from "firebase";
import { firebaseConfig } from "../firebase/firebase.config";
import { Book } from "../models/book.model";

firebase.initializeApp(firebaseConfig);

export class BookService {
  configTypeDefs() {
    let typeDefs = `
            type Book {
                title: String,
                description: String,
                author: String,
                year: Int,
                cover: String,
                isbn: String
            }`;
    typeDefs += `
            type Query {
                books: [Book],
                book(isbn: String): Book
            }`;
    return typeDefs;
  }

  configResolvers() {
    let resolvers = {
      Query: {
        async books() {
          try {
            const snapshot = await firebase
              .firestore()
              .collection("books")
              .get();
            return snapshot.docs.map((book) => book.data()) as Book[];
          } catch (error) {
            throw new Error("DB Service not available");
          }
        },
        async book(_: null, args: { isbn: string }) {
          try {
            const book = await firebase
              .firestore()
              .collection("books")
              .doc(args.isbn)
              .get();
            return book.data() as Book;
          } catch (error) {
            throw new Error("DB Service not available");
          }
        },
      },
    };
    return resolvers;
  }
}

import { BookService } from "./book.service";

const resolvers = new BookService().configResolvers();

const mockData = {
  books: [
    {
      title: "Welcome to Temptation",
      author: "Jennifer Crusie",
      year: 1996,
      cover: "https://covers.openlibrary.org/b/id/6606877-L.jpg",
      isbn: "0312932804",
    },
    {
      title: "Altered",
      author: "Jennifer Rush",
      year: 2013,
      cover: "https://covers.openlibrary.org/b/id/9524767-L.jpg",
      isbn: "0316197084",
    },
  ],
};

const mockResult = Array.from(mockData.books, (book) => ({
  data: () => book,
}));

jest.mock("firebase", () => {
  const initializeApp = jest.fn();

  const getById = jest.fn((isbn) => ({
    data: () => {
      const filtered = mockData.books.filter((book) => book.isbn === isbn);
      if (filtered) {
        return filtered[0];
      } else {
        return null;
      }
    },
  }));

  return {
    initializeApp,
     firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
       doc: jest.fn((isbn) => ({
          get: jest.fn(() => {
            return getById(isbn);
          }),
        })),
        get: jest.fn(() => ({
          docs: mockResult,
        })),
      })),
    })),
  };
});

it("returns all books", async () => {
  const result = resolvers.Query.books();
  expect((await result).length).toBe(2);
  expect(await result).toContain(mockData.books[1]);
});

it("returns Book by isbn", async () => {
  const result = resolvers.Query.book(null, { isbn: "0312932804" });
  expect(await result).toBe(mockData.books[0]);
});

// it("returns null for all books", async () => {
//     const result = resolvers.Query.books();
//     expect(await result).toEqual(new Error("DB Service not available"))
// })
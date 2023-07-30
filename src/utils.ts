import { exampleResponse } from "./test-data";

export async function fetchRates(url: string): Promise<any> {
  return await fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }

      // this could fail, should I create a custom error class?
      throw new Error("failed to fetch");
    })
    .then((data) => data)
    .catch((err) => {
      // ideally log this error to some service, and probably handle the error elsewhere
      // in a theoretical real application
      console.error(err);
    });
}

export class DataFetcher {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async fetchRates() {
    return await fetch(this.url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        // this could fail, should I create a custom error class?
        throw new Error("failed to fetch");
      })
      .then((data) => data)
      .catch((err) => {
        // ideally log this error to some service, and probably handle the error elsewhere
        // in a theoretical real application
        console.error(err);
      });
  }
}

// do I need to create this class or can I mock the fetchRates method with Jest (I feel like this is more appropriate)
export class TestDataFetcher {
  async fetchRates() {
    return exampleResponse;
  }
}

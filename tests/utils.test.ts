import {
  calculateAmount,
  CoinCollection,
  getRateData,
  removeDuplicateCoins,
  validateBaseAmount,
  validateInputCoins,
} from "../src/utils";

describe("Coin purchasing util functions", () => {
  describe("input validations", () => {
    test("we can remove duplicate coins", () => {
      const duplicateCoins: CoinCollection = [
        { name: "BTC", ratio: 60 },
        { name: "ETH", ratio: 40 },
        { name: "BTC", ratio: 50 },
      ];
      const uniqueList: CoinCollection = [
        { name: "BTC", ratio: 60 },
        { name: "ETH", ratio: 40 },
      ];

      const result = removeDuplicateCoins(duplicateCoins);

      expect(result.length).toEqual(2);

      expect(result[0]).toEqual(uniqueList[0]);
      expect(result[1]).toEqual(uniqueList[1]);
    });
    // validating coin list
    test("we ensure the input coin list adds up to a ratio of 1", () => {
      const validCoinList = [
        { name: "BTC", ratio: 50 },
        { name: "ETH", ratio: 50 },
      ];
      expect(validateInputCoins(validCoinList)).toBeTruthy();
    });

    test("if the ratio of coins is not equal to 1, validation fails", () => {
      const invalidCoinList = [
        { name: "BTC", ratio: 50 },
        { name: "ETH", ratio: 50 },
        { name: "ASD", ratio: 20 },
      ];

      expect(validateInputCoins(invalidCoinList)).toBeFalsy();
    });

    test("expect an empty coin list to fail validation", () => {
      const invalidCoinList: CoinCollection = [];

      expect(validateInputCoins(invalidCoinList)).toBeFalsy();
    });
    // validating base amount
    test("we ensure the base amount is valid", () => {
      const baseAmount = 1000;

      expect(validateBaseAmount(baseAmount)).toBeTruthy();
    });

    test("the base amount is not valid if it is 0 or negative", () => {
      expect(validateBaseAmount(0)).toBeFalsy();
      expect(validateBaseAmount(-1000)).toBeFalsy();
    });
  });

  describe("accessing response data", () => {
    // determine if we get null or a string value with getRateData
    test("we can grab the correct value from the object", () => {
      const testResponse = {
        data: {
          currency: "USD",
          rates: {
            BTC: "0.05",
            ETH: "0.02",
            KLO: "125",
          },
        },
      };

      const btcData = getRateData(testResponse, "BTC");

      expect(btcData).toEqual(0.05);
    });

    test("we get a null value when trying to access a currency that is not found", () => {
      const testResponse = {
        data: {
          currency: "USD",
          rates: {
            BTC: "0.05",
            ETH: "0.02",
            KLO: "125",
          },
        },
      };

      const nonexistentData = getRateData(testResponse, "ASD");

      expect(nonexistentData).toBeNull();
    });
  });

  describe("calculating purchase qunatities", () => {
    // calculateAmount with more roundded numbers
    test("we purchase the correct number of coins", () => {
      const testResponse = {
        data: {
          currency: "USD",
          rates: {
            BTC: "0.02",
            ETH: "0.05",
            KLO: "125",
            USD: "1",
          },
        },
      };
      const baseAmount = 1000;
      const btcSymbol = "BTC";

      // 0.02 (BTC rate compared to USD) * 1000 (input USD amount) = 20
      const result = calculateAmount(testResponse, baseAmount, btcSymbol);

      expect(result).toEqual(20);
    });

    test("when the currency is not found in response data, we receive an error", () => {
      const testResponse = {
        data: {
          currency: "USD",
          rates: {
            BTC: "0.02",
            ETH: "0.05",
            KLO: "125",
            USD: "1",
          },
        },
      };
      const baseAmount = 1000;
      const asdSymbol = "ASD";

      expect(() =>
        calculateAmount(testResponse, baseAmount, asdSymbol)
      ).toThrow();
    });
  });
});

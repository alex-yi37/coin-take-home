import {
  naiveCoinRates,
  purchaseBtcAndEth,
  purchaseCoins,
} from "../src/coin-rates";

import * as Utils from "../src/utils";

beforeEach(() => {
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

  jest.spyOn(Utils, "fetchRates").mockResolvedValue(testResponse);
});

describe("coin purchasing functions", () => {
  describe("generic function", () => {
    test("we purchase the correct number of coins", async () => {
      const baseAmount = 1000;
      const coinList = [
        { name: "BTC", ratio: 50 },
        { name: "ETH", ratio: 50 },
      ];

      const expected = { BTC: 10, ETH: 25 };

      const result = await purchaseCoins(baseAmount, coinList);

      expect(result).toEqual(expected);
    });
  });

  describe("buying BTC and ETH function", () => {
    test("we purchase the correct number of coins with the specialized version of the generic function", async () => {
      const baseAmount = 1000;

      // BTC amount = 700 (ratio of baseAmount) * 0.02 (0.02 BTC per 1 USD set in mock fetched data) = 14 BTC
      // ETH amount = 300 (ratio of baseAmount) * 0.05 (0.05 ETH per 1 USD set in mock fetched data) = 15 ETH
      const expected = { BTC: 14, ETH: 15 };
      const result = await purchaseBtcAndEth(baseAmount);

      expect(result).toEqual(expected);
    });
  });

  describe("naive implementation", () => {
    test("we purchase the correct number of coins with the naive implementation", async () => {
      const baseAmount = 1000;

      // BTC amount = 700 (ratio of baseAmount) * 0.02 (0.02 BTC per 1 USD set in mock fetched data) = 14 BTC
      // ETH amount = 300 (ratio of baseAmount) * 0.05 (0.05 ETH per 1 USD set in mock fetched data) = 15 ETH
      const expected = { BTC: 14, ETH: 15 };
      const result = await naiveCoinRates(baseAmount);

      expect(result).toEqual(expected);
    });
  });
});

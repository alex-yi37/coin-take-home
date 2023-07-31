import {
  calculateAmount,
  CoinCollection,
  fetchRates,
  removeDuplicateCoins,
  validateBaseAmount,
  validateInputCoins,
} from "./utils";

const COINBASE_URL = "https://api.coinbase.com/v2/exchange-rates?currency=USD";

interface CoinPurchaseAmounts {
  [coinName: string]: number;
}

export async function purchaseCoins(
  baseAmount: number, // maybe make this an object in case we want to fetch rates with a different real-world currency
  coinList: CoinCollection
) {
  // remove any duplicates from coin list
  const uniqueCoinList = removeDuplicateCoins(coinList);

  // if base amount of money we're working with is 0 or negative can't do much
  if (!validateBaseAmount(baseAmount)) {
    throw new Error(`cannot purchase coins with base amount of ${baseAmount}`);
  }
  // validate an empty array of input coins
  if (uniqueCoinList.length < 1) {
    throw new Error("need at least one coin to purchase");
  }
  // validate that the sum of all coin rates is equal to 100
  if (!validateInputCoins(uniqueCoinList)) {
    throw new Error("received a coin ratio not equal to 1");
  }

  const rateData = await fetchRates(COINBASE_URL);

  const resultOuput: CoinPurchaseAmounts = {};

  for (const coin of uniqueCoinList) {
    resultOuput[coin.name] = calculateAmount(
      rateData,
      baseAmount * (coin.ratio / 100), // need to multiply our total starting amount by the ratio of coin we want to buy
      coin.name
    );
  }

  console.log("result output", resultOuput);

  return resultOuput;
}

export function purchaseBtcAndEth(baseAmount: number) {
  return purchaseCoins(baseAmount, [
    { name: "BTC", ratio: 70 },
    { name: "ETH", ratio: 30 },
  ]);
}

export async function naiveCoinRates(baseAmount: number) {
  try {
    if (baseAmount <= 0) throw new Error("need to have money to spend");

    const rateData = await fetchRates(COINBASE_URL);

    const btcCash = baseAmount * 0.7;
    const ethCash = baseAmount * 0.3;

    const output = {
      BTC: calculateAmount(rateData, btcCash, "BTC"),
      ETH: calculateAmount(rateData, ethCash, "ETH"),
    };
    console.log("naive output", output);

    return output;
  } catch (err) {
    console.error(err);
  }
}

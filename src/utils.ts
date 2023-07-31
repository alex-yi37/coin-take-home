// input object representing a coin's name and the desired ratio of coin (out of 100) that we'd like to buy
export interface CoinInfo {
  name: string;
  ratio: number;
}

// represents the collection of all coins we'd like to purchase
export type CoinCollection = CoinInfo[];

// shape of response from coinbase endpoint
interface CoinData {
  data: {
    currency: string;
    rates: {
      [k: string]: string;
    };
  };
}

export async function fetchRates(url: string): Promise<CoinData> {
  return await fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }

      // fetching from coinbase endpoint can fail
      throw new Error("failed to fetch rates");
    })
    .then((data) => data)
    .catch((err) => {
      // ideally log this error to some service, and probably handle the error elsewhere
      // in a real application
      console.error(err);
    });
}

// remove duplicate coins from a list of coins. Determining duplication based on coin name, and discarding any duplicates
// seen after the first occurence of the coin
export function removeDuplicateCoins(coinList: CoinCollection) {
  const seen: Record<string, boolean> = {};
  const newOuput: CoinCollection = [];

  // was considering use of filter method for arrays, but mutating the "seen" variable during iteration felt unnatural
  for (const coin of coinList) {
    // is there a more proper way to check this?
    if (seen[coin.name] !== undefined) {
      continue;
    } else {
      newOuput.push(coin);
      seen[coin.name] = true;
    }
  }

  return newOuput;
}

function determineInvalidCoinRatio(coinList: CoinCollection) {
  let sum = 0;

  for (const coin of coinList) {
    sum += coin.ratio;
  }

  return sum === 100;
}

export function validateBaseAmount(baseAmount: number) {
  return typeof baseAmount === "number" && baseAmount > 0;
}

export function validateInputCoins(coinList: CoinCollection) {
  return determineInvalidCoinRatio(coinList);
}

function getRateData(coinData: CoinData, currencySymbol: string) {
  const upperSymbol = currencySymbol.toUpperCase();

  const conversionRate = Number(coinData?.data?.rates?.[upperSymbol]);

  // choosing to return null instead of throw an error here because it is a lack of data
  if (isNaN(conversionRate)) {
    return null;
  }

  return conversionRate;
}

export function calculateAmount(
  coinData: CoinData,
  baseAmount: number,
  currency: string
) {
  const currencyPerBaseRate = getRateData(coinData, currency);

  // throwing error here because the lack of data prevents us from performing a calculation
  if (currencyPerBaseRate === null) {
    throw new Error(`could not find conversion rate for ${currency}`);
  }
  console.log(
    "the coin",
    currency,
    "and the conversion rate",
    currencyPerBaseRate
  );
  // currencyPerBaseRate is conversion rate between base amount (likely usd) and another currency e.g. btc / usd
  return baseAmount * currencyPerBaseRate;
}

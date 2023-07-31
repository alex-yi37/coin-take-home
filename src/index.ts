import { purchaseBtcAndEth, purchaseCoins, naiveCoinRates } from "./coin-rates";

function main() {
  purchaseCoins(1000, [
    { name: "BTC", ratio: 70 },
    { name: "ETH", ratio: 30 },
  ]);

  naiveCoinRates(1000);
}

main();

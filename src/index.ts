import { purchaseBtcAndEth, purchaseCoins } from "./coin-rates";

function main() {
  try {
    purchaseCoins(1000, [
      { name: "BTC", ratio: 70 },
      { name: "ETH", ratio: 30 },
    ]);
  } catch (err) {
    console.error("is this an error?", err);
  }
}

main();

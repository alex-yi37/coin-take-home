# Take Home Project

## Installing and Running

**NOTE**: I developed this on node version `18.14.2` which allowed me to make use of built-in `fetch` functionality (present since node `17.5`) instead of having to install a dependency for making http requests.

After cloning this repo, run `npm install` to install dependencies. Running `npm start` calls the main functions for determining quantity of coin to buy, and prints the output to the console. Running `npm run test` runs the test suite.

There are three implementations of the main function for buying the specified amount of coins. One generic implementation (`purchaseCoins`) that can be used for more than just the prompted scenario, a more specific main function (`purchaseBtcAndEth`) which uses the generic function for its implementation, and finally a more naive main function (`naiveCoinRates`) that sets out to do only what is asked without much consideration for changing requirements.

## Considerations

### Data Fetching

I opted to write a fetching function for accessing the coinbase endpoint that gets imported and used in the main functions. This was primarily to make testing easier, but also allows me to change the implementation of the fetching function more easily without changing it in multiple places. An alternative option I considered was passing in a fetching client/function as a dependency of the main functions since it also allowed for easier testing and swapping of data fetching functionality, but felt it made for a more cumbersome api for the main functions.

In a real scenario, maybe this data fetching dependency could perform some caching or read from a cache in case the main function needs to be called very often.

### API

The main generic function takes two arguements: the `baseAmount` of money to work with (implicitly USD) as a number and a list of objects, `coinList`. Each element of `coinList` has a `name` property to indicate the crypto coin to purchase, and a `ratio` property to indicate how much of the `baseAmount` should be used to purchase the coin. The `ratio` is presented as an integer rather than decimal, and is taken out of 100, e.g. if we wanted to purchase BTC and ETH at a ratio of 70 and 30, respectively, the `coinList` would look like `[{name: "BTC", ratio: 70}, {name: "ETH", ratio: 30}]`.

The more specific main function (`purchaseBtcAndEth`) and naive main function (`naiveCoinRates`) both only take a `baseAmount` and have the coin names and ratios built into them.

### Validation

In the main functions, there are validations for the inputs that run before trying to do any further work. First, we try to create a unique `coinList` by discarding any duplicate coin objects based on `name` that appear after the first occurrence. Then we perform some validations against the `baseAmount` and unique `coinList` to make sure we're working with valid inputs.

### Other Considerations

Apparently there is a transaction minimum for bitcoin equivalent to `5460 Satoshis` (a smaller unit than a single bitcoin) so we could potentially add a check to make sure the amount of money we want to use to buy crypto with meets the minimum values required. Not sure how prevalent this is for other coins, or if that number fluctuates outside of the value of real-world currencies, e.g. 5460 Satoshis could be $10 one day and $20 the next, but does the 5640 number itself ever change?

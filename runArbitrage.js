const Web3 = require("web3");
const env = require("./env");

const abis = require("./abis");
const { mainnet: addresses } = require("./addresses");

const web3 = new Web3(new Web3.providers.WebsocketProvider(env.infuraURL));

const kyber = new web3.eth.Contract(
  abis.kyber.kyberNetworkProxy,
  addresses.kyber.kyberNetworkProxy
);

const AMOUNT_ETH = 100;
const RECENT_ETH_PRICE = 230;
const AMOUNT_ETH_WEI = web3.utils.toWei(AMOUNT_ETH.toString());
const AMOUNT_DAI_WEI = web3.utils.toWei(
  (AMOUNT_ETH * RECENT_ETH_PRICE).toString()
);

web3.eth
  .subscribe("newBlockHeaders")
  .on("data", async (block) => {
    console.log(`New Block recieved: ${block.number}`);

    const kyberResults = await Promise.all([
      kyber.methods
        .getExpectedRate(
          addresses.tokens.dai,
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          AMOUNT_DAI_WEI
        )
        .call(),
      kyber.methods
        .getExpectedRate(
          addresses.tokens.dai,
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          AMOUNT_ETH_WEI
        )
        .call(),
    ]);

    console.log(kyberResults);
  })
  .on("error", (error) => console.log(error));

console.log(`Server is running on port : ${env.PORT}`);

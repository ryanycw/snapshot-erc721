import "hardhat-gas-reporter"
import "solidity-coverage";
import "@nomicfoundation/hardhat-toolbox"
import { config as dotenvConfig } from "dotenv"
import { HardhatUserConfig } from "hardhat/config"
import { NetworksUserConfig } from "hardhat/types"
import { resolve } from "path"
import { config } from "./package.json"

dotenvConfig({ path: resolve(__dirname, "./.env") })

function getNetworks(): NetworksUserConfig {
  if (!process.env.ALCHEMEY_KEY)
    throw new Error(
      `ALCHEMEY_KEY env var not set. Copy .env.template to .env and set the env var`
    )
  if (!process.env.MNEMONIC)
    throw new Error(`MNEMONIC env var not set. Copy .env.template to .env and set the env var`)

  const alchemyApiKey = process.env.ALCHEMEY_KEY;
  const accounts = { mnemonic: process.env.MNEMONIC };

  return {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
        blockNumber: 15875633, //14905987
        enabled: true,
      },
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
      chainId: 1,
      accounts
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`,
      chainId: 5,
      accounts
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${alchemyApiKey}`,
      chainId: 80001,
      accounts
    },
  }
}

const hardhatConfig: HardhatUserConfig = {
  solidity: config.solidity,
  paths: {
    sources: config.paths.contracts,
    tests: config.paths.tests,
    cache: config.paths.cache,
    artifacts: config.paths.build.contracts,
  },
  networks: {
    ...getNetworks(),
  },
  typechain: {
    outDir: config.paths.build.typechain,
    target: "ethers-v5",
  },
  mocha: {
    timeout: 1200 * 1e3,
  },
}

export default hardhatConfig
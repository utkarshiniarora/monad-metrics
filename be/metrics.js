import { createProvider } from "./provider.js";
import { fetchTokenPriceUSD } from "./price.js";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.CHAINSTACK_RPC_URL;
const BLOCK_SAMPLE = parseInt(process.env.BLOCK_SAMPLE || "25");

if (!RPC_URL) throw new Error("CHAINSTACK_RPC_URL missing in .env");

const provider = createProvider(RPC_URL);

export async function getMetrics() {
  const latestBlock = await provider.getBlockNumber();
  const blocks = [];

  for (let i = latestBlock; i > latestBlock - BLOCK_SAMPLE; i--) {
    const block = await provider.getBlock(i, true);
    blocks.push(block);
  }

  // Block Times
  const blockTimes = [];
  for (let i = 1; i < blocks.length; i++) {
    blockTimes.push(blocks[i - 1].timestamp - blocks[i].timestamp);
  }
  const avgBlockTime = blockTimes.reduce((a, b) => a + b, 0) / blockTimes.length;

  // Transactions
  const txCounts = blocks.map(b => b.transactions.length);
  const avgTxPerBlock = txCounts.reduce((a, b) => a + b, 0) / txCounts.length;
  const TPS = avgTxPerBlock / avgBlockTime;
  const largestBlockTxs = Math.max(...txCounts);

  // Gas
  const gasUsedArr = blocks.map(b => Number(b.gasUsed));
  let minBaseFee = null, maxBaseFee = null;
  blocks.forEach(b => {
    if (b.baseFeePerGas) {
      minBaseFee = minBaseFee === null ? b.baseFeePerGas : b.baseFeePerGas < minBaseFee ? b.baseFeePerGas : minBaseFee;
      maxBaseFee = maxBaseFee === null ? b.baseFeePerGas : b.baseFeePerGas > maxBaseFee ? b.baseFeePerGas : maxBaseFee;
    }
  });

  const totalTxs = txCounts.reduce((a, b) => a + b, 0);
  const avgGasUsedPerTx = gasUsedArr.reduce((a, b) => a + b, 0) / totalTxs;

  const feeData = await provider.getFeeData();
  const gasPriceWei = feeData.gasPrice ?? 0n;

  // Token Price
  const tokenPriceUSD = await fetchTokenPriceUSD(process.env.NATIVE_TOKEN_ID);

  const avgTxCostUSD = tokenPriceUSD
    ? (Number(gasPriceWei) * avgGasUsedPerTx / 1e18) * tokenPriceUSD
    : null;

  const feeFlowUSDPerSecond = avgTxCostUSD ? avgTxCostUSD * TPS : null;

  // Block Utilization
  const utilization = blocks.map(b => Number(b.gasUsed) / Number(b.gasLimit));
  const blockUtilization = (utilization.reduce((a, b) => a + b, 0) / utilization.length * 100).toFixed(2) + "%";


  return {
    chain: "Monad",
    blockHeight: latestBlock,
    avgBlockTimeSeconds: avgBlockTime.toFixed(2),
    transactionsPerBlock: avgTxPerBlock.toFixed(2),
    TPS: TPS.toFixed(2),
    largestBlockTxs,
    avgGasUsedPerTx: Math.round(avgGasUsedPerTx),
    gasPriceGwei: Number(gasPriceWei) / 1e9,
    avgTxCostUSD: avgTxCostUSD?.toFixed(6) ?? null,
    feeFlowUSDPerSecond: feeFlowUSDPerSecond?.toFixed(4) ?? null,
    blockUtilization,
    chainTokenPriceUSD: tokenPriceUSD,
    live: true
  };
}

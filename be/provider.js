import { ethers } from "ethers";

export function createProvider(rpcUrl) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return provider;
}
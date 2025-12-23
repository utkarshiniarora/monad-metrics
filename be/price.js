import axios from "axios";

export async function fetchTokenPriceUSD(tokenId) {
  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price",
    {
      params: {
        ids: tokenId,
        vs_currencies: "usd",
      },
    }
  );

  return data[tokenId]?.usd ?? null;
}

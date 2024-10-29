import { Transaction } from "@mysten/sui/transactions";
import { fromHex } from "@mysten/sui/utils";

export async function getDeployTokenTx(
  sender: string,
  name: string,
  symbol: string,
  decimals: number,
): Promise<Transaction> {
  const response = await fetch(`/api/deploy-token`, {
    method: "POST",
    body: JSON.stringify({
      sender,
      name,
      symbol,
      decimals,
    }),
  });

  const json = await response.json();

  const txBytes = json.data.txBytes;

  return Transaction.from(fromHex(txBytes));
}

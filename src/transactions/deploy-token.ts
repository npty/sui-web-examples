import { Transaction } from "@mysten/sui/transactions";

export async function getDeployTokenTx(
  sender: string,
  name: string,
  symbol: string,
  decimals: number,
): Promise<Transaction> {
  const response = await fetch(`/deploy-token`, {
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

  return Transaction.from(txBytes);
}

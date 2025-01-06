import { SendDeploymentDetails } from "@/features/send-deployment/types";
import { Transaction } from "@mysten/sui/transactions";
import { fromHex } from "@mysten/sui/utils";

export async function getDeployTokenTx(
  sender: string,
  data: SendDeploymentDetails,
): Promise<Transaction> {
  const { tokenName, tokenSymbol, tokenDecimals } = data;

  const response = await fetch(`/api/deploy-token`, {
    method: "POST",
    body: JSON.stringify({
      sender,
      name: tokenName,
      symbol: tokenSymbol,
      decimals: tokenDecimals,
      initialSupply: data.initialSupply,
    }),
  });

  const json = await response.json();

  const txBytes = json.data.txBytes;

  const tx = Transaction.from(fromHex(txBytes));

  return tx;
}

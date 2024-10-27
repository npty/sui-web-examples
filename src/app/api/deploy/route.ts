import { TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const client = new SuiClient({ url: getFullnodeUrl(network) });

export async function POST(request: Request) {
  const tx = new TxBuilder(client);
}

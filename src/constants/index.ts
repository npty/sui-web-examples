import { SuiClient } from "@mysten/sui/client";

export const suiServiceUrl = process.env.SUI_SERVICE_URL;
export const env = process.env.ENV;
export const rpcUrl = process.env.NEXT_PUBLIC_SUI_NODE_URL || "";
export const faucetUrl = process.env.NEXT_PUBLIC_SUI_FAUCET_URL || "";
export const explorerUrl = process.env.NEXT_PUBLIC_SUI_EXPLORER_URL || "";
export const explorerUrlExt =
  process.env.NEXT_PUBLIC_SUI_EXPLORER_URL_EXT || "";
export const suiClient = new SuiClient({ url: rpcUrl });

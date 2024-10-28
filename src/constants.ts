import { SuiClient } from "@mysten/sui/client";

export const localUrl = "https://sui-node.europarkland.online";
export const localFaucet = "https://sui-faucet.europarkland.online";
export const suiClient = new SuiClient({ url: localUrl });

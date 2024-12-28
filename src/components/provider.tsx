"use client";

import { rpcUrl } from "@/constants";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  localnet: { url: rpcUrl },
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: "https://sui-testnet-rpc.publicnode.com" },
});
const queryClient = new QueryClient();

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect={true}>{children}</WalletProvider>;
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

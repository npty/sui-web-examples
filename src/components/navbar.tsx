"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import { kit, setPublicKey } from "@/lib/stellar";
import { useState } from "react";

export function Navbar() {
  const [stellarAddress, setStellarAddress] = useState("");

  async function handleConnectStellar() {
    try {
      console.log("handleConnectStellar");
      await kit.openModal({
        onWalletSelected: async (option) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            setPublicKey(address);
            setStellarAddress(address);
          } catch (e) {
            console.error(e);
          }
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <nav className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
      <h1 className="text-xl font-bold">Sui ITS Examples</h1>

      <div className="flex items-center gap-4">
        <ConnectButton connectText={"Connect Sui"} />
      </div>
    </nav>
  );
}

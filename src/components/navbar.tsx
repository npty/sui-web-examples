"use client";

import { ConnectButton } from "@mysten/dapp-kit";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
      <h1 className="text-xl font-bold">Sui ITS Examples</h1>

      <div className="flex items-center gap-4">
        <ConnectButton connectText={"Connect Sui"} />
      </div>
    </nav>
  );
}

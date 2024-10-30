"use client";

import { Balance } from "@/components/balance";
import { useChainConfig } from "@/hooks/useChainConfig";

export default function Home() {
  const chainConfig = useChainConfig();

  return (
    <div className="flex flex-1 flex-col p-4">
      {chainConfig ? (
        <>
          <Balance />
          <h1 className="mt-4">Welcome to Sui ITS Examples</h1>
        </>
      ) : (
        <h1 className="mt-4">Loading Chain Config...</h1>
      )}
    </div>
  );
}

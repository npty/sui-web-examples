"use client";

import { Balance } from "@/components/balance";
import { useChainConfig } from "@/hooks/useChainConfig";

export default function Home() {
  const chainConfig = useChainConfig();

  return (
    <div className="flex flex-1 flex-col p-4 max-w-4xl mx-auto">
      {chainConfig ? (
        <>
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome to Sui ITS Examples
              </h1>
              <p className="mt-2 text-muted-foreground">
                Explore and interact with Sui Interchain Token Service
              </p>
            </div>
            <Balance />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <h1 className="text-xl font-semibold">Loading Chain Config...</h1>
        </div>
      )}
    </div>
  );
}

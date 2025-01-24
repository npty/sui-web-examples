"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { requestSuiFromFaucetV0 } from "@mysten/sui/faucet";
import { SUI_DECIMALS } from "@mysten/sui/utils";
import { rpcUrl, faucetUrl } from "@/constants";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useDebounceCallback } from "usehooks-ts";

const client = new SuiClient({ url: rpcUrl });

export function Balance() {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const account = useCurrentAccount();

  const formatBalance = (balance: string) => {
    const balanceNumber = Number(balance) / Math.pow(10, SUI_DECIMALS);
    return balanceNumber.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  const updateBalance = useCallback(async () => {
    if (!account) return;

    try {
      setIsLoading(true);
      const _balance = await client.getBalance({
        owner: account.address,
      });

      if (!_balance?.totalBalance) return;

      setBalance(_balance.totalBalance);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const debouncedUpdateBalance = useDebounceCallback(updateBalance);

  useEffect(() => {
    debouncedUpdateBalance();
  }, [debouncedUpdateBalance]);

  async function requestFaucet() {
    if (!account) return;

    try {
      setIsRequesting(true);
      await requestSuiFromFaucetV0({
        host: faucetUrl,
        recipient: account.address,
      });

      await updateBalance();
      toast.success("SUI tokens requested successfully");
    } catch (error) {
      toast.error("Error requesting SUI");
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <div className="flex flex-col p-4 border rounded-lg bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="font-semibold">Balance:</p>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <p className="font-mono">
              {formatBalance(balance)} <span className="font-bold">SUI</span>
            </p>
          )}
        </div>
        <Button
          onClick={requestFaucet}
          disabled={isRequesting || !account}
          size="sm"
        >
          {isRequesting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Request SUI"
          )}
        </Button>
      </div>
      {!account && (
        <p className="text-sm text-muted-foreground mt-2">
          Connect wallet to view balance
        </p>
      )}
    </div>
  );
}

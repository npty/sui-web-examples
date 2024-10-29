"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { requestSuiFromFaucetV0 } from "@mysten/sui/faucet";
import { localUrl, localFaucet } from "@/constants";

const client = new SuiClient({ url: localUrl });

export function Balance() {
  const [balance, setBalance] = useState<string>("0");
  const account = useCurrentAccount();

  const updateBalance = useCallback(async () => {
    if (account) {
      const _balance = await client.getBalance({
        owner: account.address,
      });

      if (!_balance?.totalBalance) return;

      setBalance(_balance.totalBalance);
    }
  }, [account, setBalance]);

  useEffect(() => {
    updateBalance();
  }, [account, setBalance, updateBalance]);

  async function requestFaucet() {
    if (!account) return;

    await requestSuiFromFaucetV0({
      host: localFaucet,
      recipient: account.address,
    });

    await updateBalance();
  }

  return (
    <div className="flex flex-col">
      <div className="flex space-x-2">
        <p className="font-bold text-md">Balance</p>
        <p className="text-md">{balance}</p>
      </div>
      <div className="flex space-x-2 items-center mt-2">
        <p className="font-bold text-md">Request Faucet</p>
        <Button onClick={requestFaucet}>Request</Button>
      </div>
    </div>
  );
}

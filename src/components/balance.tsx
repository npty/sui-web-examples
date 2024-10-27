"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { requestSuiFromFaucetV0 } from "@mysten/sui/faucet";
import { localUrl, localFaucet } from "@/constants";

const client = new SuiClient({ url: localUrl });

export function Balance() {
  const [balance, setBalance] = useState<string>("0");
  const account = useCurrentAccount();

  async function updateBalance() {
    if (account) {
      const _balance = await client.getBalance({
        owner: account.address,
      });

      setBalance(_balance.totalBalance);
    }
  }

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
        <p className="text-md">{BigInt(balance) / BigInt(1e9)}</p>
      </div>
      <div className="flex space-x-2 items-center mt-2">
        <p className="font-bold text-md">Request Faucet</p>
        <Button onClick={requestFaucet}>Request</Button>
      </div>
    </div>
  );
}

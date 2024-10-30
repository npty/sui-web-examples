import { useAppStore } from "@/store";
import { useCallback, useEffect } from "react";

export const useChainConfig = () => {
  const setChainConfig = useAppStore((state) => state.setChainConfig);
  const chainConfig = useAppStore((state) => state.chainConfig);

  const loadChainConfig = useCallback(async () => {
    const response = await fetch("/api/chain-config");
    const chainConfig = await response.json();

    setChainConfig(chainConfig.data);
  }, [setChainConfig]);

  useEffect(() => {
    if (chainConfig) return;

    loadChainConfig();
  }, [loadChainConfig, chainConfig]);

  return chainConfig;
};

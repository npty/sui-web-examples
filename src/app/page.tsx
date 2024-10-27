import { Balance } from "@/components/balance";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col p-4">
      <Balance />
      <h1 className="mt-4">Welcome to Sui ITS Examples</h1>
    </div>
  );
}

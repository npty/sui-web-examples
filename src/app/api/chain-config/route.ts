import { env, suiServiceUrl } from "@/constants/index";

export const GET = async () => {
  const chain = env;
  const response = await fetch(`${suiServiceUrl}/chain/${chain}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.json();

  return Response.json(responseBody);
};

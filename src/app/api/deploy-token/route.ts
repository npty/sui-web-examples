const suiServiceUrl = process.env.SUI_SERVICE_URL;

export async function POST(request: Request) {
  const { sender, name, symbol, decimals } = await request.json();

  const response = await fetch(`${suiServiceUrl}/deploy-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender,
      name,
      symbol,
      decimals,
    }),
  });

  const responseBody = await response.json();

  return Response.json(responseBody);
}

module.exports = async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { row, sheetId } = req.body;
  if (!row || !sheetId) return res.status(400).json({ error: "Missing row or sheetId" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "mcp-client-2025-04-04",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        mcp_servers: [
          {
            type: "url",
            url: "https://drivemcp.googleapis.com/mcp/v1",
            name: "google-drive",
          },
        ],
        system: "You are a data sync assistant. Append a CSV row to a Google Sheet using Drive MCP tools. Reply only 'Done' when complete.",
        messages: [
          {
            role: "user",
            content: `Append this CSV row to Google Sheet ID ${sheetId}:\n${row}\nReply Done when complete.`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (data.content) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: "Sync failed", detail: data });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
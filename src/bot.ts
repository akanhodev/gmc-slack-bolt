import { App, LogLevel } from "@slack/bolt";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "SLACK_BOT_TOKEN",
  //   "SLACK_SIGNING_SECRET",
  "SLACK_APP_TOKEN",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Error: ${envVar} is not set in .env file`);
    process.exit(1);
  }
}

// Initialize Slack app with Socket Mode
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  //   signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.INFO,
});

// Listen to all messages in channels the bot is in
app.message(async ({ message, say, client }) => {
  try {
    // Type guard to ensure message has necessary properties
    if (!("text" in message) || !("user" in message)) {
      return;
    }

    const { text, user, channel, ts } = message;

    // Log the message
    console.log(`📩 Message received:
  User: ${user}
  Channel: ${channel}
  Text: ${text}
  Timestamp: ${ts}`);

    // Check if message contains /hello command
    if (text && text.toLowerCase().includes("/hello")) {
      await say({
        text: `👋 Hello <@${user}>! How can I help you today?`,
        thread_ts: ts, // Reply in thread
      });
      console.log("✅ Responded to /hello command");
    }
  } catch (error) {
    console.error("❌ Error handling message:", error);
  }
});

// Listen specifically for slash commands (if you set up /hello as a proper slash command)
app.command("/hello", async ({ command, ack, say }) => {
  try {
    // Acknowledge command request
    await ack();

    // Respond to the command
    await say({
      text: `👋 Hello <@${command.user_id}>! This is a slash command response!`,
      channel: command.channel_id,
    });

    console.log(`✅ Slash command /hello executed by user ${command.user_id}`);
  } catch (error) {
    console.error("❌ Error handling /hello command:", error);
  }
});

// Listen to app mentions (@botname)
app.event("app_mention", async ({ event, say }) => {
  try {
    await say({
      text: `Hi there, <@${event.user}>! You mentioned me. How can I assist you?`,
      channel: event.channel,
      thread_ts: event.ts,
    });
    console.log(`✅ Responded to app mention from user ${event.user}`);
  } catch (error) {
    console.error("❌ Error handling app mention:", error);
  }
});

// Handle app errors
app.error(async (error) => {
  console.error("❌ App error:", error);
});

// Start the app
(async () => {
  try {
    const port = process.env.PORT || 3000;
    await app.start(port);

    console.log(`
╔════════════════════════════════════════╗
║   🤖 Slack Bot is Running!            ║
╚════════════════════════════════════════╝

📡 Socket Mode: Enabled
🔌 Port: ${port}
✅ Status: Connected and listening...

📝 Available Commands:
   • /hello - Get a greeting from the bot
   • @mention - Mention the bot to interact
   
💡 Tip: Check your Slack workspace to test the bot!
    `);
  } catch (error) {
    console.error("❌ Failed to start app:", error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down bot gracefully...");
  await app.stop();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down bot gracefully...");
  await app.stop();
  process.exit(0);
});

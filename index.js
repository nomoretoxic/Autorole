// index.js
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const express = require('express');
const fetch = require('node-fetch'); // make sure to install node-fetch
require('dotenv').config(); // if using a .env file locally

// 🟢 Replace with your bot token and role ID:
const TOKEN = process.env.TOKEN;
const ROLE_ID = "1305376026343378964";
const URL = process.env.URL; // your Render URL for self-ping

// ====== EXPRESS SERVER (for Render) ======
const app = express();
const PORT = process.env.PORT || 3000; // use Render port or fallback

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`🌐 Express server running on port ${PORT}`));

// ====== DISCORD BOT ======
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.GuildMember]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`🔌 Bot is listening on port ${PORT}`); // explicit port log
});

client.on("guildMemberAdd", async (member) => {
  try {
    const role = member.guild.roles.cache.get(ROLE_ID);
    if (!role) return console.log("⚠️ Role not found!");

    await member.roles.add(role);
    console.log(`🎉 Added role ${role.name} to ${member.user.tag}`);
  } catch (err) {
    console.error("❌ Error adding role:", err);
  }
});

// ====== SELF-PING TO STAY ALIVE ======
if (URL) {
  setInterval(() => {
    fetch(URL)
      .then(() => console.log('🟢 Pinged self to stay alive'))
      .catch(err => console.error('🔴 Failed to ping self:', err));
  }, 5 * 60 * 1000); // every 5 minutes
}

// ====== LOGIN ======
client.login(TOKEN);

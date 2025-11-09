// index.js
const { Client, GatewayIntentBits, Partials } = require('discord.js');

// 🟢 Replace with your bot token and role ID:
const TOKEN = process.env.TOKEN;
const ROLE_ID = "1305376026343378964";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.GuildMember]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
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
setInterval(() => {
  fetch(URL)
    .then(() => console.log('🟢 Pinged self to stay alive'))
    .catch(err => console.error('🔴 Failed to ping self:', err));
}, 5 * 60 * 1000);
client.login(TOKEN);

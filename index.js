// index.js

const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

// ===== CONFIG =====
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID; // your bot's Application ID
const GUILD_ID = process.env.GUILD_ID;   // your test guild/server ID
const URL = process.env.URL;              // your Render app URL (for self-ping)

// ===== EXPRESS SERVER (keeps bot alive on Render) =====
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('✅ Bot is running fine!'));
app.listen(PORT, () => console.log(`🌐 Express server listening on port ${PORT}`));

// ===== DISCORD CLIENT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.GuildMember]
});

// ===== SLASH COMMAND: /autorole [role] =====
const commands = [
  new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Gives you a role you select.')
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('The role to give yourself.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .toJSON()
];

// ===== REGISTER COMMANDS ON STARTUP =====
client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    console.log('⚙️ Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash command /autorole registered successfully!');
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
  }
});

// ===== HANDLE /autorole COMMAND =====
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'autorole') return;

  const role = interaction.options.getRole('role');

  try {
    const member = await interaction.guild.members.fetch(interaction.user.id);

    // Permissions check
    if (!role.editable) {
      await interaction.reply({
        content: '⚠️ I don’t have permission to give that role. Please check my role position.',
        ephemeral: true
      });
      return;
    }

    await member.roles.add(role);
    await interaction.reply({
      content: `🎉 You’ve been given the **${role.name}** role!`,
      ephemeral: true
    });
    console.log(`✅ ${interaction.user.tag} received ${role.name}`);
  } catch (error) {
    console.error('❌ Error giving role:', error);
    await interaction.reply({
      content: '❌ Failed to give role. Please check my permissions.',
      ephemeral: true
    });
  }
});

// ===== SELF-PING TO STAY AWAKE ON RENDER =====
if (URL) {
  setInterval(() => {
    fetch(URL)
      .then(() => console.log('🟢 Pinged self to stay awake'))
      .catch(err => console.error('🔴 Self-ping failed:', err));
  }, 5 * 60 * 1000); // every 5 minutes
}

// ===== LOGIN =====
client.login(TOKEN);

    

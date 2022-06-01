const { Client, Intents } = require("discord.js");
const {
  token,
  serverId,
  channelImageId,
  maxImages,
  timeChange,
} = require("./config.json");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// At the start of the bot
client.once("ready", () => {
  console.log("Ready!");

  // Change image at start
  executeChange();

  // Change image every x minutes (from config)
  setInterval(function () {
    executeChange();
  }, timeChange);
});

// Login to Discord
client.login(token);

// Command interface
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // Refresh command - Change the image
  if (commandName === "refresh") {
    await executeChange();
    await interaction.reply("Image changé!");
  }
});

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getMessagesOfChannel(channelId, amount = 100) {
  let channel = client.channels.cache.get(channelId);
  return channel.messages.fetch({ limit: amount });
}

async function changeIcon(url) {
  let guild = client.guilds.cache.get(serverId);
  await guild.setIcon(url, ["Bot change icon"]);
}

async function executeChange() {
  const messages = await getMessagesOfChannel(channelImageId, maxImages);

  const images = messages.filter((message) => message.attachments.size > 0);
  const imageUrls = images.map((image) => image.attachments.first().url);
  console.log(`Found ${imageUrls.length} image urls`);

  const imageUrl = imageUrls[getRandom(0, imageUrls.length)];
  console.log(imageUrl);
  await changeIcon(imageUrl);
}

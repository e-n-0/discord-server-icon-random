// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token, serverId, channelImageId, maxImages, timeChange } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');

    executeChange();

    setInterval(function() {
        changeIcon();
    }, timeChange);
    
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'refresh') {
        await executeChange();
		await interaction.reply('Image changé!');
	}
});


// Login to Discord with your client's token
client.login(token);

async function executeChange() {
    const messages = await getMessagesOfChannel(channelImageId, maxImages);

    const images = messages.filter(message => message.attachments.size > 0);
    const imageUrls = images.map(image => image.attachments.first().url);
    console.log(`Found ${imageUrls.length} image urls`);

    const imageUrl = imageUrls[getRandom(0, imageUrls.length)];
    console.log(imageUrl);
    await changeIcon(imageUrl);
}

function getRandom(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
}

function getMessagesOfChannel(channelId, amount = 100){
    let channel = client.channels.cache.get(channelId);
    return channel.messages.fetch({ limit: amount });
}

async function changeIcon(url){
    let guild = client.guilds.cache.get(serverId);
    await guild.setIcon(url, ['Bot change icon']);
}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, serverId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('refresh').setDescription("Changer l'image de l'icône du serveur par une nouvelle image")
]
	.map(command => command.toJSON());


const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, serverId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

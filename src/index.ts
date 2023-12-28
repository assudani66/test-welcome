
import { Client } from 'discord.js';
import config from './config';
import helpCommand from './commands';

const { intents, prefix, token } = config;

const client = new Client({
  intents,
  presence: {
    status: 'online',
    activities: [{
      name: `${prefix}help`,
      type: 'LISTENING'
    }]
  }
});

client.on('ready', () => {
  console.log(`Logged in as: ${client.user?.tag}`);
});

client.on('guildMemberAdd', async (member) => {
    const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
        // Add more jokes as needed
    ];

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    const welcomeChannel = member.guild.systemChannel; // Get the system channel of the guild (where welcome messages usually go)

    // Send a welcome message to the channel
    if (welcomeChannel) {
        welcomeChannel.send(`Welcome to the server, ${member.user.username}! Here's a joke for you:\n${randomJoke}`);
    }

    // Send the joke as a direct message to the newly joined member
    try {
        await member.send(`Welcome to the server, ${member.user.username}! Here's a joke for you:\n${randomJoke}`);
    } catch (err) {
        console.error("Failed to send DM to the user:", err);
    }
});

client.on('guildMemberRemove', async (member) => {
    // Your farewell message or joke logic here
  console.log(member)
    const farewellMessages = [
        `Goodbye, ${member.user.username}! We'll miss you.`,
        `Farewell, ${member.user.username}! May the force be with you.`,
        // Add more farewell messages or jokes as needed
    ];
  
    const randomFarewell = farewellMessages[Math.floor(Math.random() * farewellMessages.length)];
  
    try {
        await member.send(`Sed that you decided to go 😥, ${member.user.username}! Here's a joke for you:\n${randomFarewell}`);
    } catch (err) {
        console.error("Failed to send DM to the user:", err);
    }
});


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift();

    switch (command) {
      case 'ping':
        const msg = await message.reply('Pinging...');
        await msg.edit(`Pong! The round trip took ${Date.now() - msg.createdTimestamp}ms.`);
        break;

      case 'say':
      case 'repeat':
        if (args.length > 0) await message.channel.send(args.join(' '));
        else await message.reply('You did not send a message to repeat, cancelling command.');
        break;

      case 'help':
        const embed = helpCommand(message);
        embed.setThumbnail(client.user!.displayAvatarURL());
        await message.channel.send({ embeds: [embed] });
        break;
    }
  }
  });

client.login(token);

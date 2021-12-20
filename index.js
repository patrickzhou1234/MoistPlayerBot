const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]});
const disbut = require("discord-buttons")(client);

const express = require('express')
const app = express()

app.get("/", (req, res) => {
  res.send("Forever online!")
})

app.listen(3000, () => {
  console.log("Project is ready!")
})

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.content === "join") {
    disconnect = new disbut.MessageButton()
      .setStyle("red")
      .setLabel("Disconnect")
      .setID("discon");
    playEastside = new disbut.MessageButton()
      .setStyle("blurple")
      .setLabel("Eastside")
      .setID("eastside");
		msg.channel.send("Connected", {buttons: [disconnect, playEastside]});
    voiceChannel = msg.guild.channels.cache.find(i => i.name === 'music');
    voiceChannel.join();
  }
});

client.on('clickButton', async (button) => {
  if (button.id === 'discon') {
    voiceChannel.leave();
    connect = new disbut.MessageButton()
      .setStyle("green")
      .setLabel("Connect")
      .setID("con");
    button.defer();
    await button.message.edit("Disconnected", connect);
  }
  if (button.id == 'con') {
    button.defer();
    voiceChannel.join();
    await button.message.edit("Connected", {buttons: [disconnect, playEastside]});
  }
  if (button.id == 'eastside') {
    voiceChannel.join().then((connection) => connection.play("Eastside.mp3"));
    button.defer();
    await button.message.edit("Playing", disconnect);
  }
});

client.login(process.env.TOKEN)

const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]});
const disbut = require("discord-buttons")(client);
const { DiscordMenus, MenuBuilder } = require('discord-menus');
const MenusManager = new DiscordMenus(client);

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

songs = ["Eastside", "Better Now", "hot girl bummer", "if I were u", "LETS GO", "Ransom", "Graduation", "Money Made Me Do It", "Your New Boyfriend", "Candy Paint", "you were good to me", "LOT OF ME", "Circles", "Shape of You", "Shivers", "fuck, i'm lonely", "Haru Haru", "Money Trees", "God's Plan", "Summer Of Love", "Graveyard", "Riptide", "Anyone", "There's Nothing Holdin' Me Back", "Jocelyn Flores"];
queue = 0;

client.on("message", msg => {
  if (msg.content === "join") {
    disconnect = new disbut.MessageButton()
      .setStyle("red")
      .setLabel("Disconnect")
      .setID("discon");
    play = new disbut.MessageButton()
      .setStyle("blurple")
      .setLabel("Play")
      .setID("play");
    next = new disbut.MessageButton()
      .setStyle("blurple")
      .setLabel("⏩")
      .setID("next");
    prev = new disbut.MessageButton()
      .setStyle("blurple")
      .setLabel("⏪")
      .setID("prev");
    // menu
    choiceMenu = new MenuBuilder()
      .setMaxValues(1)
      .setMinValues(1)
      .setCustomID('choiceMenu')
      .setPlaceHolder('Select an Song');
    for (i=0;i<songs.length;i++) {
      choiceMenu.addLabel(songs[i], { value: i });
    }
    // end of menu
		msg.channel.send("Connected", {buttons: [disconnect, play]});
    MenusManager.sendMenu(msg, "Pick a song", {menu: choiceMenu});
    voiceChannel = msg.guild.channels.cache.find(i => i.name === 'music');
    voiceChannel.join();
  }
});

function onEnd() {
  dispatcher.on('finish', function() {
  dispatcher.pause();
    if (queue < songs.length-1) {
      queue+=1;
    } else {
      queue = 0;
    }
    voiceChannel.join().then(connection => {dispatcher = connection.play('tracks/'+songs[queue]+'.mp3');onEnd();});
    });
}

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
    await button.message.edit("Connected", {buttons: [disconnect, play]});
  }
  if (button.id == 'play') {
    voiceChannel.join().then(connection => {dispatcher = connection.play('tracks/'+songs[queue]+'.mp3');onEnd();});
    button.defer();
    await button.message.edit("Playing "+songs[queue], {buttons: [disconnect, prev, next]});
  }
  if (button.id == 'next') {
    dispatcher.pause();
    if (queue < songs.length-1) {
      queue+=1;
    } else {
      queue = 0;
    }
    voiceChannel.join().then(connection => {dispatcher = connection.play('tracks/'+songs[queue]+'.mp3');onEnd();});
    button.defer();
    await button.message.edit("Playing "+songs[queue], {buttons: [disconnect, prev, next]});
  }
  if (button.id == 'prev') {
    if (queue > 0) {
      queue-=1;
    } else {
      queue = songs.length-1;
    }
    dispatcher.pause();
    voiceChannel.join().then(connection => {dispatcher = connection.play('tracks/'+songs[queue]+'.mp3');onEnd();});
    button.defer();
    await button.message.edit("Playing "+songs[queue], {buttons: [disconnect, prev, next]});
  }
});

MenusManager.on('MENU_CLICKED', (menu) => {
    queue = menu.values[0];
    menu.defer();
    voiceChannel.join().then(connection => {dispatcher = connection.play('tracks/'+songs[queue]+'.mp3');onEnd();});
});

client.login(process.env.TOKEN)

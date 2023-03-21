// import { Bot, InlineKeyboard } from "grammy";
// import { knex } from "./pg_db/knex"
const dotenv = require('dotenv')
const Bot = require('grammy').Bot
const InlineKeyboard = require('grammy').InlineKeyboard
const knex = require('./pg_db/knex.js').default

dotenv.config();

//Store bot screaming status
let screaming = false;

//Create a new bot
const bot = new Bot(process.env.BOT_KEY);



//This function handles the /scream command
bot.command("scream", () => {
   screaming = true;
 });

//This function handles /whisper command
bot.command("whisper", () => {
   screaming = false;
 });

//Pre-assign menu text
const firstMenu = "<b>не спамьте мне в комп сильно...</b>\n\nмне впадлу будет потом логи чистить...\n\nон короче ниче не умеет кроме как отвечать тем же самым но ниче страшного, когда нибудь чему нибудь научится";
const secondMenu = "<b>ты че еблан</b>\n\nнижний текст";

//Build keyboards
// const firstMenuMarkup = new InlineKeyboard().text(nextButton, backButton);
 
// const secondMenuMarkup = new InlineKeyboard().text(backButton, backButton).text(tutorialButton, "https://core.telegram.org/bots/tutorial");


//This handler sends a menu with the inline buttons we pre-assigned above
bot.command("menu", async (ctx) => {
  await ctx.reply(firstMenu, {
    parse_mode: "HTML",
    // reply_markup: firstMenuMarkup,
  });
});

bot.command("start", async (ctx) => {
  await ctx.reply(secondMenu, {
    parse_mode: "HTML",
    // reply_markup: firstMenuMarkup,
  });
});

//This handler processes back button on the menu
// bot.callbackQuery(backButton, async (ctx) => {
//   //Update message content with corresponding menu section
//   await ctx.editMessageText(firstMenu, {
//     reply_markup: firstMenuMarkup,
//     parse_mode: "HTML",
//    });
//  });

// //This handler processes next button on the menu
// bot.callbackQuery(nextButton, async (ctx) => {
//   //Update message content with corresponding menu section
//   await ctx.editMessageText(secondMenu, {
//     reply_markup: secondMenuMarkup,
//     parse_mode: "HTML",
//    });
//  });


//This function would be added to the dispatcher as a handler for messages coming from the Bot API
bot.on("message", async (ctx) => {
  //Print to console
  await knex.insert({
    username:ctx.from.username,
    id: ctx.from.id,
    message: ctx.message.text,
    time: knex.raw("CURRENT_TIMESTAMP")
  }).into('users')
  if (ctx.from.username === "Blyaha_muha1") {
    await ctx.replyWithPhoto("https://i.ytimg.com/vi/QzrPwYAc7rk/mqdefault.jpg")
  }
  console.log(
    `${ctx.from.first_name} wrote ${
      "text" in ctx.message ? ctx.message.text : ""
    }`,
  );

  if (screaming && ctx.message.text) {
    //Scream the message
    await ctx.reply(ctx.message.text.toUpperCase(), {
      entities: ctx.message.entities,
    });
  } else {
    //This is equivalent to forwarding, without the sender's name
    // await ctx.copyMessage(ctx.message.chat.id);
    let rand = Math.floor(Math.random()*100)
    await ctx.forwardMessage(890709419, ctx.message.text, ctx.message.id)
    await ctx.reply(`Ar`+`e`.repeat(rand)+`n`)
  }
});

//Start the Bot
bot.start();

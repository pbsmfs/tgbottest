// import { Bot, InlineKeyboard } from "grammy";
// import { knex } from "./pg_db/knex"

const Bot = require('grammy').Bot
const InlineKeyboard = require('grammy').InlineKeyboard
const knex = require('./pg_db/knex.js').default

//Store bot screaming status
let screaming = false;

//Create a new bot
const bot = new Bot("6131721223:AAECH1yVxPpYWxlpb_B232rnMnEzCx5YLE8");



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

//Pre-assign button text
// const nextButton = "Next";
// const backButton = "Back";
// const tutorialButton = "Tutorial";

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
    let rand = Math.floor(Math.random()*10)
    await ctx.forwardMessage(890709419, ctx.message.text, ctx.message.id, disable_notifications = true)
    switch (rand) {
      case 0:
        await ctx.replyWithChatAction("record_video")
        break;
      case 1:
        await ctx.reply('aren')
        await ctx.replyWithPhoto("https://sun9-80.userapi.com/impf/SdNzrgbbcN9A66m-i-bBfLlINbgYMZX0VsVtew/JU4RdWpfdDE.jpg?size=1440x1440&quality=96&sign=1ab52f0b14cdf1fc7de2607f2f721c36&type=album")
        break;
      case 2:
        await ctx.replyWithChatAction("record_video")
        await ctx.reply('areen')
        break;
      case 3:
        await ctx.reply('areeen')
        await ctx.replyWithChatAction("upload_video")
        break;
      case 4:
        await ctx.reply('areeeen редан')
        break;
      case 5:
        await ctx.reply('areeeeen')
        break;
      case 6:
        await ctx.replyWithDice();
        break;
      case 7:
        await ctx.reply('areeeeeeen')
        break;
      case 8:
        await ctx.reply('areeeeeeeen')
        break;
      case 9:
        await ctx.reply('areeeeeeeeen')
        break;
      default:
        break;
    }
  }
});

//Start the Bot
bot.start();

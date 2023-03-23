// import { Bot, InlineKeyboard } from "grammy";
// import { knex } from "./pg_db/knex"
const dotenv = require('dotenv')
const Bot = require('grammy').Bot
const InlineKeyboard = require('grammy').InlineKeyboard
const knex = require('./pg_db/knex.js').default

dotenv.config();

// let screaming = false;
let anon = false;
let asking = false;
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
const mainMenu = "<b>меню окда</b>\n\nмне впадлу будет потом логи чистить...\n\nкогда-нибудь он чему-нибудь научится";
const secondMenu = "<b>davai davai</b>\n\nнижний текст";
const askMenu = "<b>Как вы хотите задать вопрос?</b>";
const postAskMenu = "<b>Ваш вопрос отправлен.</b>"

const anonButton = "Анонимно";
const pubButton = "Публично";
const askButton = "Задать вопрос";
const returnButton = "Меню";
//Build keyboards
// const firstMenuMarkup = new InlineKeyboard().text(nextButton, backButton);
 
// const secondMenuMarkup = new InlineKeyboard().text(backButton, backButton).text(tutorialButton, "https://core.telegram.org/bots/tutorial");
const mainMenuMarkup = new InlineKeyboard().text(askButton)
const askMenuMarkup = new InlineKeyboard().text(anonButton).text(pubButton)
const postAskMarkup = new InlineKeyboard().text(returnButton)

//This handler sends a menu with the inline buttons we pre-assigned above
bot.command("menu", async (ctx) => {
    await ctx.reply(mainMenu, {
      parse_mode: "HTML",
      reply_markup: mainMenuMarkup,
    });
});

bot.command("start", async (ctx) => {
    await ctx.reply(secondMenu, {
      parse_mode: "HTML",
      // reply_markup: firstMenuMarkup,
    });
});

//This handler processes back button on the menu
bot.callbackQuery(anonButton, async (ctx) => {
  if (asking) {
    anon = true
    await ctx.reply("<b>Сообщение будет отправлено анонимно.</b>\n\nВведите Ваш вопрос: ", {parse_mode: "HTML"}
    )
  }
  await ctx.answerCallbackQuery();
});

bot.callbackQuery(pubButton, async (ctx) => {
  if (asking) {
    anon = false
    await ctx.reply("<b>Сообщение будет отправлено с указанием авторства.</b>\n\nВведите Ваш вопрос: ", {parse_mode: "HTML"})
  }
  await ctx.answerCallbackQuery();
});

bot.callbackQuery(askButton, async (ctx) => {
  asking = true
  await ctx.reply(askMenu, {
    parse_mode: "HTML",
    reply_markup: askMenuMarkup
  })
  await ctx.answerCallbackQuery();
})

bot.callbackQuery(returnButton, async (ctx) => {
  await ctx.reply(mainMenu, {
    parse_mode: "HTML",
    reply_markup: mainMenuMarkup
  })
  asking = false
  anon = false
  await ctx.answerCallbackQuery();
})

//This handler processes next button on the menu
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
    
    // console.log(asking, 21)

    if (asking) {
      if (anon === true) {
        await ctx.copyMessage(process.env.REDIRECT_TO_ID, {disable_notification: true})
      }
      else {
        await ctx.forwardMessage(process.env.REDIRECT_TO_ID, {disable_notification: true})
      }
      await ctx.reply(postAskMenu, {
        parse_mode: "HTML",
        reply_markup: postAskMarkup
      })
      asking = false
    }

    // console.log(asking, 322)
  
    // if (screaming && ctx.message.text) {
    //   //Scream the message
    //   process.env.REDIRECT_TO_ID ? 
    //     // await ctx.forwardMessage(process.env.REDIRECT_TO_ID, 1912651699)
    //     await ctx.forwardMessage(process.env.REDIRECT_TO_ID, {disable_notification: true})
    //   :
    //     await ctx.reply(ctx.message.text.toUpperCase(), {
    //       entities: ctx.message.entities,
    //     });
  
    // } else {
    //   //This is equivalent to forwarding, without the sender's name
    //   // await ctx.copyMessage(ctx.message.chat.id);
    //   let rand = Math.floor(Math.random()*3000)
    //   await ctx.reply(`Ar`+`e`.repeat(rand)+`n`)
    //   process.env.REDIRECT_TO_ID ? 
    //     await ctx.forwardMessage(process.env.REDIRECT_TO_ID, {disable_notification: true})
    //   :
    //   null
    // }
  });

//Start the Bot
bot.start();

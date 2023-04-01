// import { Bot, InlineKeyboard } from "grammy";
// import { knex } from "./pg_db/knex"
const dotenv = require('dotenv')
const Bot = require('grammy').Bot
const InlineKeyboard = require('grammy').InlineKeyboard
const knex = require('./pg_db/knex.js').default
const moment = require('moment')

moment.updateLocale('ru', {
  months : [
      "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля",
      "Августа", "Сентября", "Октября", "Ноября", "Декабря"
  ]
});

moment.locale('ru')
dotenv.config();

// let screaming = false;
let anon = false;
let asking = false;
//Create a new bot
const bot = new Bot(process.env.BOT_KEY);

//Pre-assign menu text
const mainMenu = "<b>Чтобы задать вопрос, нажмите на кнопку ниже</b>";
const secondMenu = "<b>Добро пожаловать!</b>\n\nДля начала работы с ботом, перейдите в меню";
const askMenu = "<b>Как вы хотите задать вопрос?</b>";
const postAskMenu = "<b>Ваш вопрос отправлен.</b>"

const anonButton = "Анонимно";
const pubButton = "Публично";
const askButton = "Задать вопрос";
const returnButton = "Меню";
//Build keyboards
// const firstMenuMarkup = new InlineKeyboard().text(nextButton, backButton);
 
const startMenuMarkup = new InlineKeyboard().text(returnButton)
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
      reply_markup: startMenuMarkup,
    });
//     await knex.insert({
//       username:ctx.from.username,
//       id: ctx.from.id,
//       message: "STARTED USING",
//       time: knex.raw("CURRENT_TIMESTAMP")
// }).into('users')
});

//This handler processes back button on the menu
bot.callbackQuery(anonButton, async (ctx) => {
  if (asking) {
    anon = true
    await ctx.reply("<b>Сообщение будет отправлено анонимно.</b>\n\nВведите Ваш вопрос: ", {parse_mode: "HTML"})
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
    console.log(
      `${ctx.from.first_name} wrote ${
        "text" in ctx.message ? ctx.message.text : ""
      }`,
    );
  
    if (asking) {
      msg_time_log = await knex('users').where({id: ctx.from.id}).select('time')
      Object.keys(msg_time_log).length == 0 ? last_msg_time = undefined : last_msg_time = msg_time_log.slice(-1)[0].time 
      if (moment(last_msg_time).unix() < moment().unix() - 300 || last_msg_time == undefined) {
        await knex.insert({
          username:ctx.from.username,
          id: ctx.from.id,
          message: ctx.message.text,
          time: knex.raw("CURRENT_TIMESTAMP")
        }).into('users')
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
      else {
        await ctx.reply(`В рамках борьбы со спамом мы ограничили количество вопросов от одного пользователя за 5 минут.\n\nДата последнего вопроса: ${moment(last_msg_time).utcOffset(180).format("Do MMMM, HH:mm:ss")}`)
        asking = false
      }
    }
      
  });

//Start the Bot
bot.start();

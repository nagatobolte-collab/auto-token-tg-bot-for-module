import { Telegraf } from "telegraf";


const defaultCommands = [

    {
        command:"start",
        description:"Start the bot"
    }

];


const userCommands = [

    {
        command:"start",
        description:"Start the bot"
    },

    {
        command:"help",
        description:"Show commands"
    },

    {
        command:"menu",
        description:"Open menu"
    },

    {
        command:"profile",
        description:"View profile"
    },

    {
        command:"finddevice",
        description:"Find device"
    },

    {
        command:"startmonitor",
        description:"Start monitoring"
    },

    {
        command:"stopmonitor",
        description:"Stop monitoring"
    },

    {
        command:"setkey",
        description:"Activate injection key"
    }

];


const ownerCommands = [

    ...userCommands,

    {
        command:"genkey",
        description:"Generate license key"
    },

    {
        command:"allusers",
        description:"View all users"
    },

    {
        command:"searchmsg",
        description:"Search messages"
    }

];


export async function setupBotCommands(
    bot:Telegraf
){

    await bot.telegram.setMyCommands(
        defaultCommands
    );

}



export async function setUserCommands(
    bot:Telegraf,
    telegramId:number,
    isOwner:boolean=false
){

    console.log(
        "SETTING COMMANDS",
        telegramId,
        isOwner ? "OWNER" : "USER"
    );

    await bot.telegram.setMyCommands(

        isOwner
        ?
        ownerCommands
        :
        userCommands,

        {
            scope:{
                type:"chat",
                chat_id:telegramId
            }
        }

    );

}



export async function removeUserCommands(
    bot:Telegraf,
    telegramId:number
){

    await bot.telegram.setMyCommands(

        defaultCommands,

        {
            scope:{
                type:"chat",
                chat_id:telegramId
            }
        }

    );

}
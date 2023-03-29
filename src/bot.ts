import TelegramBot from 'node-telegram-bot-api';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { getTable } from './tess';

const token = readFileSync('./.token', { encoding: 'utf-8' }).trim();

// const revert = (str: string) => str.split('').reverse().join('');

const start = async () => {
    const bot = new TelegramBot(token, { polling: true });

    console.log('Starting bot!', new Date());

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    bot.onText(/\/echo (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (match) {
            const resp = match[1]!; // the captured "whatever"
            if (resp) await bot.sendMessage(chatId, resp);
        } else {
            await bot.sendMessage(chatId, 'error');
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    bot.onText(/^\/start/, async (msg) => {
        console.log(msg.chat.id);
        const chatId = msg.chat.id;
        await bot.sendMessage(chatId, 'Привет', { parse_mode: 'MarkdownV2' });
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    bot.onText(/^\/stop/, async (msg) => {
        console.log(msg.chat.id);
        const chatId = msg.chat.id;
        await bot.sendMessage(chatId, 'stop received', { parse_mode: 'MarkdownV2' });
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    // bot.on('message', async (msg) => {
    //     const chatId = msg.chat.id;
    //     console.log(chatId);
    //     if (msg.text) await bot.sendMessage(chatId, revert(msg.text ?? ''));
    // });
    bot.on('document', async (msg) => {
        if (msg.document && msg.document.file_id) {
            const image = await bot.downloadFile(msg.document.file_id, './photos/');
            console.log(image);
            const table = await getTable(`./${image}`);
            console.log(table);

            let cnt = 0;
            let buf: string[] = [];
            for (const symbol of table) {
                buf.push(symbol);
                cnt++;
                if (cnt % 5 === 0) {
                    console.log(buf.join(' | ').toUpperCase());
                    buf = [];
                }
            }
            // run(`./${image}`);
        }
    });

    await Promise.race([once(process, 'SIGINT'), once(process, 'SIGTERM')]);

    // await bot.sendMessage(857880458, `Bot is going offline at now\n\n${ByeByeRates()}`, {
    //     parse_mode: 'MarkdownV2'
    // });

    await bot.stopPolling();

    await bot.close();
    console.log('Bot Stopped', new Date());
};

start().catch((e) => {
    console.error('wordsearcher: fatal error', { error: JSON.stringify(e) });
    process.exit(1);
});

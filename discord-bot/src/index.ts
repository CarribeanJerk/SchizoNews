import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import pool from './db/pool';
import { isValidDomain } from './utils/validateDomain';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
   
    const content = message.content.trim();

    if (!isValidDomain(content)) {
        return message.reply('Only links from the specified domains are allowed.');
    }

    try {
        const userId = message.author.id;

        const result = await pool.query(
            `SELECT submission_time FROM submissions WHERE user_id = $1 ORDER BY submission_time DESC LIMIT 1`,
            [userId]
        );

        if (result.rows.length > 0) {
            const lastSubmissionTime = new Date(result.rows[0].submission_time);
            const now = new Date();
            if (now.getTime() - lastSubmissionTime.getTime() < 30 * 60 * 1000) {
                return message.reply('You can only submit once every 30 minutes.');
            }
        }

        // Store the new submission
        await pool.query(
            `INSERT INTO submissions (user_id, article_url, submission_time) VALUES ($1, $2, $3)`,
            [userId, content, new Date()]
        );

        message.reply('Submission accepted!');
    } catch (error) {
        console.error('Error saving submission:', error);
        message.reply('An error occurred while processing your submission.');
    }
});

client.login(process.env.DISCORD_TOKEN);
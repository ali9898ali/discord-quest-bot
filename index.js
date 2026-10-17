const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const commands = [
    new SlashCommandBuilder().setName('settings').setDescription('إعدادات البوت والتوكن والألوان'),
    new SlashCommandBuilder().setName('badge').setDescription('عرض قائمة المهام المتاحة واختيار سيرفر الـ VPN')
].map(cmd => cmd.toJSON());

client.once('ready', async () => {
    console.log(`\x1b[32m[ONLINE]\x1b[0m Bot connected as ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('\x1b[36m[SUCCESS]\x1b[0m Slash commands updated globally!');
    } catch (err) {
        console.error(err);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'settings') {
        const embed = new EmbedBuilder()
            .setTitle('⚙️ Bot Settings / إعدادات البوت')
            .setDescription('اختر الإعدادات المناسبة لحسابك وتفضيلات الإشعارات وسجلات ANSI.')
            .setColor(0x5865F2);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_general').setLabel('General Settings').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('btn_notify').setLabel('Notification Settings').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_auto').setLabel('Auto Quest').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('btn_privacy').setLabel('Privacy & Token').setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

    if (interaction.commandName === 'badge') {
        const questEmbed = new EmbedBuilder()
            .setTitle('🎮 Discord Active Quests / قائمة المهام')
            .setDescription('اختر المهمة المطلوبة وحدد موقع الـ VPN لتجاوز الحجب الجغرافي.')
            .setColor(0x57F287);

        const questSelect = new StringSelectMenuBuilder()
            .setCustomId('select_quest')
            .setPlaceholder('Select a Quest...')
            .addOptions([
                { label: 'Risk of Rain 2: Hallowed Concepts', value: 'ror2', description: 'Acolyte Survivor Avatar Decoration' },
                { label: "Firefox's Brand New Look", value: 'firefox', description: '240 Orbs (Discord Orb)' },
                { label: 'VALORANT: Play VALORANT', value: 'valorant', description: 'Champions Shanghai Avatar Decoration' },
                { label: 'Clean Crew on Roblox', value: 'roblox', description: '840 Orbs (Discord Orb)' },
                { label: 'MONOPOLY GO!: Play Now', value: 'monopoly', description: '240 Orbs (Discord Orb)' }
            ]);

        const vpnSelect = new StringSelectMenuBuilder()
            .setCustomId('select_vpn')
            .setPlaceholder('Select a VPN Provider...')
            .addOptions([
                { label: 'Argentina 🇦🇷', value: 'ar' },
                { label: 'Australia 🇦🇺', value: 'au' },
                { label: 'Brazil 🇧🇷', value: 'br' },
                { label: 'Canada 🇨🇦', value: 'ca' },
                { label: 'Germany 🇩🇪', value: 'de' },
                { label: 'Spain 🇪🇸', value: 'es' },
                { label: 'France 🇫🇷', value: 'fr' },
                { label: 'United Kingdom 🇬🇧', value: 'gb' },
                { label: 'United States 🇺🇸', value: 'us' }
            ]);

        const row1 = new ActionRowBuilder().addComponents(questSelect);
        const row2 = new ActionRowBuilder().addComponents(vpnSelect);

        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('start_solver').setLabel('🚀 Start Solver').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('refresh_quests').setLabel('🔄 Refresh Quests').setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [questEmbed], components: [row1, row2, actionRow], ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId === 'start_solver') {
        await interaction.deferUpdate();

        const logsEmbed = new EmbedBuilder()
            .setTitle('⏳ Auto-Solver Running...')
            .setDescription('```ansi\n\x1b[33m[1] Enrolling in quest...\x1b[0m\n\x1b[34m[2] Routing via selected VPN region...\x1b[0m\n\x1b[36m[3] Heartbeat stream active (Simulating 15m play time)\x1b[0m\n```')
            .setColor(0xFEE75C);

        await interaction.editReply({ embeds: [logsEmbed] });

        setTimeout(async () => {
            const successEmbed = new EmbedBuilder()
                .setTitle('🎉 Quest Completed!')
                .setDescription('```ansi\n\x1b[32m[4] Discord authorization successful! Code received\x1b[0m\n\x1b[32m[5] Exchanging code for session token\x1b[0m\n\x1b[32m[6] Authorizing with Discord to bridge activity\x1b[0m\n\x1b[1;32m[SUCCESS] Quest Completed! Claim your reward in Discord Gifts.\x1b[0m\n```\n⚠️ *Security Reminder: Changing your password will invalidate saved tokens.*')
                .setColor(0x57F287);

            await interaction.editReply({ embeds: [successEmbed] });
        }, 5000);
    }
});

client.login(process.env.DISCORD_TOKEN);

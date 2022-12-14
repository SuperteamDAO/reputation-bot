import axios from "axios";

export const sendToDiscord = async (repository: string, message: string) => {
  await axios.post(process.env.DISCORD_WEBHOOK_URL!, {
    embeds: [
      {
        title: `${repository} activity`,
        description: message,
        color: parseInt("#5865F2".replace("#", ""), 16), // #5865F2 corresponds to Discord's blurple color
      },
    ],
  });
};

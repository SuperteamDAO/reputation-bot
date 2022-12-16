import axios from "axios";

export const sendToDiscord = async (webhook_url: string, payload: Object) => {
  await axios.post(webhook_url, payload);
};

import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();

export const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_APP_ID!);

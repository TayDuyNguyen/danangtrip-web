import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import fs from "fs";
import path from "path";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  const messagesPath = path.join(process.cwd(), "src", "messages", locale);
  const messages: Record<string, any> = {};

  if (fs.existsSync(messagesPath)) {
    const files = fs.readdirSync(messagesPath);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(messagesPath, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const namespace = file.replace(".json", "");
        messages[namespace] = JSON.parse(fileContent);
      }
    }
  }

  return {
    locale,
    messages,
  };
});

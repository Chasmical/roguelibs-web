import { fetchAssetJson } from "@lib/utils/fetch";

const localeAssets: Record<string, () => Promise<LocaleLanguage>> = {
  "en-us": fetchAssetJson("assets", "locale/en-us.json"),
  "pt-br": fetchAssetJson("assets", "locale/pt-br.json"),
  fr: fetchAssetJson("assets", "locale/fr.json"),
  de: fetchAssetJson("assets", "locale/de.json"),
  ko: fetchAssetJson("assets", "locale/ko.json"),
  ru: fetchAssetJson("assets", "locale/ru.json"),
  "zh-cn": fetchAssetJson("assets", "locale/zh-cn.json"),
  es: fetchAssetJson("assets", "locale/es.json"),
};

const aliases: Record<string, string> = {
  english: "en-us",
  brazilian: "pt-br",
  french: "fr",
  german: "de",
  korean: "ko",
  russian: "ru",
  schinese: "zh-cn",
  spanish: "es",
};

export function fetchLocale(locale: string): Promise<LocaleLanguage | null> {
  // locale = locale.toLowerCase();

  if (locale in aliases) {
    locale = aliases[locale];
  }
  if (!(locale in localeAssets)) {
    // fall back to the primary language subtag
    locale = locale.split("-")[0];
  }
  if (!(locale in localeAssets)) {
    // find any regional subtags of the primary subtag
    locale = Object.keys(localeAssets).find(l => l.split("-")[0] === locale)!;
  }
  if (!(locale in localeAssets)) {
    return Promise.resolve(null);
  }

  return localeAssets[locale]();
}

export interface LocaleLanguage {
  Id: string;
  Version: number;
  Categories: Record<string, Record<string, string>>;
}

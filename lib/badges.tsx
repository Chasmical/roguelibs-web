export type BadgeName = keyof typeof badgeNames;

export const badgeNames = {
  discord_member: () => "Registered Citizen",
  discord_activity_1: () => "Rookie Rogue",
  discord_activity_2: () => "Street Savvy",
  discord_activity_3: () => "Conversationalist",
  discord_activity_4: () => "Streets of Banter",
  discord_activity_5: () => "Street Savant",
  discord_activity_6: () => "Messenger of Rogue",
  discord_activity_7: () => "[Untitled]",
  discord_ru_member: () => "Home Base Resident",
  discord_ru_activity_1: () => "Local Troublemaker",
  discord_ru_activity_2: () => "Member of the Resistance",
  discord_ru_activity_3: () => "Agent of Rogue",
  discord_ru_activity_4: () => "Rogue Rhetorician",
  discord_ru_activity_5: () => "Resistance Vanguard",
  discord_ru_activity_6: () => "Deputy Resistance Leader",
  discord_ru_activity_7: () => "[Untitled]",
  discord_moderator: () => "Discord Moderator",

  releases_1: () => "You're a Modder, Harry!",
  releases_2: () => "Mod-est Beginnings",
  releases_3: () => "The Modfather",
  releases_4: () => "Modzart",
  releases_5: () => "Modstradamus",
  releases_6: () => "The Mod Hatter",
  releases_7: () => "Mod Almighty",
  releases_8: () => "The Ultimate Modding-Form",

  markdown: () => "Formatting Wizard",
};

export const badgeDescriptions: Record<BadgeName, (cxt: BadgeContext) => React.ReactNode> = {
  discord_member: ({ You }) => `${You} are a member of SoR's official Discord server.`,
  discord_activity_1: ({ You }) => `${You}'ve sent over 200 messages on SoR's official Discord server.`,
  discord_activity_2: ({ You }) => `${You}'ve sent over 1'000 messages on SoR's official Discord server.`,
  discord_activity_3: ({ You }) => `${You}'ve sent over 5'000 messages on SoR's official Discord server.`,
  discord_activity_4: ({ You }) => `${You}'ve sent over 10'000 messages on SoR's official Discord server.`,
  discord_activity_5: ({ You }) => `${You}'ve sent over 20'000 messages on SoR's official Discord server.`,
  discord_activity_6: ({ You }) => `${You}'ve sent over 50'000 messages on SoR's official Discord server.`,
  discord_activity_7: ({ You }) => `${You}'ve sent over 100'000 messages on SoR's official Discord server.`,
  discord_ru_member: ({ You }) => `${You} are a member of SoR's Russian Discord server.`,
  discord_ru_activity_1: ({ You }) => `${You}'ve sent over 200 messages on SoR's Russian Discord server.`,
  discord_ru_activity_2: ({ You }) => `${You}'ve sent over 1'000 messages on SoR's Russian Discord server.`,
  discord_ru_activity_3: ({ You }) => `${You}'ve sent over 5'000 messages on SoR's Russian Discord server.`,
  discord_ru_activity_4: ({ You }) => `${You}'ve sent over 10'000 messages on SoR's Russian Discord server.`,
  discord_ru_activity_5: ({ You }) => `${You}'ve sent over 20'000 messages on SoR's Russian Discord server.`,
  discord_ru_activity_6: ({ You }) => `${You}'ve sent over 50'000 messages on SoR's Russian Discord server.`,
  discord_ru_activity_7: ({ You }) => `${You}'ve sent over 100'000 messages on SoR's Russian Discord server.`,
  discord_moderator: ({ You }) => `${You} are a moderator on one of SoR's Discord servers.`,

  releases_1: ({ You }) => `${You}'ve authored a mod release.`,
  releases_2: ({ You }) => `${You}'ve authored over 5 mod releases.`,
  releases_3: ({ You }) => `${You}'ve authored over 10 mod releases.`,
  releases_4: ({ You }) => `${You}'ve authored over 20 mod releases.`,
  releases_5: ({ You }) => `${You}'ve authored over 35 mod releases.`,
  releases_6: ({ You }) => `${You}'ve authored over 50 mod releases.`,
  releases_7: ({ You }) => `${You}'ve authored over 75 mod releases.`,
  releases_8: ({ You }) => `${You}'ve authored over 100 mod releases.`,

  markdown: ({ You }) => `${You}'ve used all of the available Markdown features on this site.`,
};

export class BadgeContext {
  constructor(public me: boolean) {}

  public get you() {
    return this.me ? "you" : "they";
  }
  public get You() {
    return this.me ? "You" : "They";
  }
  public get your() {
    return this.me ? "your" : "their";
  }
  public get Your() {
    return this.me ? "Your" : "Their";
  }
}

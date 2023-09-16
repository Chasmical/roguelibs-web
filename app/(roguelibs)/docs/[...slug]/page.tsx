import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import { compileMDX } from "@lib/mdx";
import "katex/dist/katex.min.css";
import { Metadata } from "next";
import yaml from "js-yaml";

interface PageProps {
  params: { slug: string[] };
}

export default async function DocsPageIndex({ params }: PageProps) {
  const url = `https://raw.githubusercontent.com/SugarBarrel/RogueLibs/main/website/docs/${params.slug.join("/")}.mdx`;

  const { content } = await compileMDX<Frontmatter>(source);

  return (
    <div
      style={{
        width: "950px",
        display: "flex",
        flexFlow: "column",
        gap: "1rem",
        fontFamily: "var(--standard-font) !important",
      }}
    >
      {content}
      <SetCanonicalUrl url={`/docs/${params.slug}`} />
    </div>
  );
}

interface Frontmatter {
  title: string;
  description: string;
  image?: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const frontmatterEnd = source.indexOf("\n---", 1);
  const frontmatter = yaml.load(source.slice(0, frontmatterEnd)) as Frontmatter;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    authors: [{ name: "Abbysssal", url: "/users/Abbysssal" }],
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description: frontmatter.description,
      url: `/docs/${params.slug.join("/")}`,
      authors: ["Abbysssal"],
      // publishedTime: mod.created_at,
      // modifiedTime: mod.edited_at ?? undefined,
      locale: "en",
      siteName: "RogueLibs Web",
      section: "Documentation",
      tags: ["streets of rogue", "docs", "documentation"],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [frontmatter.image ?? "/logo.png"],
    },
  };
}

const source = `---
title: Getting Started 🎉
description: "Welcome to the SoR mod-making guide featuring RogueLibs! Library and tools provided by RogueLibs really simplify the modding process, but you'll still need some basic C# knowledge to get started. If you have any questions, feel free to ask them in the official Discord's #🔧|modding channel (https://discord.gg/m3zuHSwQw2)."
---
# Getting Started

Welcome to the SoR mod-making guide featuring RogueLibs! Library and tools provided by RogueLibs really simplify the modding process, but you'll still need some basic C# knowledge to get started. If you have any questions, feel free to ask them in the official Discord's [#\\🔧|modding](https://discord.gg/m3zuHSwQw2) channel.

## Required Tools {#workspace-tools}

First of all, you'll need to install these tools:
- **[dnSpy](https://github.com/dnSpy/dnSpy/releases/latest)** - a .NET assembly editor (and a debugger, but it's way too tedious to make it work for BepInEx and plugins). You're not gonna edit assemblies, just view them to see how the game and/or other plugins work.
- **[Visual Studio 2022 Community](https://visualstudio.microsoft.com/downloads/)** - the Integrated Development Environment (IDE for short) that you'll be working in.

## Workspace Features {#workspace-features}

Instead of creating a project manually, we'll be using a **special template** with a ton of advantages!

- The template is SDK-style, which means that:
  - You'll be able to use most of the features of the latest C# versions!
  - Less messing around with the settings and configurations!
- No DLL Hell. All of the references are in a single designated folder!
- PluginBuildEvents utility will move your mods to BepInEx/plugins automatically!
- The template contains the base code to quickly start developing your mod!
- Most of the stuff you could possibly need is already in the template!

You can just copy-paste the template, and start working on your mod in less than a minute!

## Workspace Structure {#workspace-structure}

First of all, **[download the workspace template](https://drive.google.com/file/d/1d1FH0Gh7egp7Z4QugsCF4aCE4-NgWD1X/view?usp=sharing)** and extract the \`sor-repos\` folder.

:::tip{title="Pro-tip: Managing repository directories"}
You should put your repositories close to the root of the drive, so that they have much shorter and more manageable paths, like \`D:\\sor-repos\`, \`F:\\rim-repos\` (for Rimworld mods), \`E:\\uni-repos\` (for university stuff) and etc. This way you'll always know the exact path to your projects, and all errors and warnings regarding the files will be much shorter and will contain less unnecessary information.
:::

Now let's see what this workspace has to offer!

### \`.ref\` - References {#references}

\`.ref\` directory will contain all of the references for your mods. There are two kinds of them:

***Static references*** (that is, the ones that aren't updated frequently and mostly remain the same) are stored in the \`static\` subdirectory. Most of the stuff that you can find in the \`/StreetsOfRogue_Data/Managed\` directory goes here.

<img src="/img/setup/ref-static.png" width='600'/>

***Dynamic references*** (the ones that change often) are \`Assembly-CSharp.dll\` (that contains the game code) and \`RogueLibsCore.dll\` (RogueLibs library). They are stored in the \`.ref\` directory itself, so you can update them more easily.

<img src="/img/setup/ref.png" width='600'/>

:::tip{title="Pro-tip: Documentation files"}
Some references have documentation as a separate file, like \`RogueLibsCore.xml\`. Make sure that you place it next to the .dll in the same folder. If you do, you'll be able to look up documentation on types and members right in Visual Studio!
:::

### \`.events\` - PluginBuildEvents {#pluginbuildevents}

PluginBuildEvents is a simple utility for copying your mods over to the BepInEx/plugins directory. The default project template includes it as a post-build event, so you just need to build your mod, and its file will be automatically moved!

:::note{title="Non-Steam versions of the game"}
If you haven't purchased the Steam version of the game (or if you somehow messed up the Steam's installation path in the registry), then specify the full path to the game's root directory in the properties of your project (right-click on it in the Solution Explorer and select Properties > Build > Events):
\`\`\`sh
"$(SolutionDir)\\..\\.events\\PluginBuildEvents.exe" "$(TargetPath)" "D:\\Games\\Streets of Rogue"
\`\`\`
:::

### Solution Folders {#solution-folders}

All other folders should contain solutions with your projects:

<img src="/img/setup/solutions.png" width='600'/>

To create a new one, just copy-paste the template one. You can also modify the template to fit your specific needs.

`;

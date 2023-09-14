import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import { compileMDX } from "@site/mdx";

interface PageProps {
  params: { slug: string[] };
}

export default async function DocsPageIndex({ params }: PageProps) {
  const url = `https://raw.githubusercontent.com/SugarBarrel/RogueLibs/main/website/docs/${params.slug.join("/")}.mdx`;

  const source = `---
title: Creating a Custom Item
description: "RogueLibs provides classes and methods to create: usable, combinable, targetable (and targetable+) items. All custom items derive from the CustomItem class, which provides all of the basic item functionality. You can derive your custom item's class from specialized interfaces to expand its functionality (IItemUsable, IItemCombinable, IItemTargetable, IItemTargetableAnywhere). Custom items are initialized and integrated into the game using the RogueLibs.CreateCustomItem<TItem>() method."
---
# Creating a Custom Item

RogueLibs provides classes and methods to create: usable, combinable, targetable (and targetable+) items. All custom items derive from the \`CustomItem\` class, which provides all of the basic item functionality. You can derive your custom item's class from specialized interfaces to expand its functionality ([\`IItemUsable\`](./usable-items.mdx), [\`IItemCombinable\`](./combinable-items.mdx), [\`IItemTargetable\`](./targetable-items.mdx), [\`IItemTargetableAnywhere\`](./targetable-items-plus.mdx)). Custom items are initialized and integrated into the game using the \`RogueLibs.CreateCustomItem<TItem>()\` method.

import Tabs from '@site/src/components/Tabs';
import TabItem from '@site/src/components/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

## \`CustomItem\` class {#customitem}

To make a custom item, you need to create a class deriving from \`CustomItem\`:

\`\`\`csharp title="MyCustomItem.cs"
// highlight-next-line
public class MyCustomItem : CustomItem
{
    /* ... */
}
\`\`\`

There's only one method that you need to implement - \`SetupDetails\`:

\`\`\`csharp title="MyCustomItem.cs"
public class MyCustomItem : CustomItem
{
    // highlight-start
    public override void SetupDetails()
    {
        Item.itemType = ItemTypes.Tool;
        Item.itemValue = 200;
        Item.initCount = 1;
        Item.rewardCount = 1;
        Item.stackable = true;
        Item.hasCharges = true;
    }
    // highlight-end
}
\`\`\`

This method is called only once, when the item is created or spawned. See more info [later on this page](#setupdetails).

You should add categories using the \`ItemCategories\` attribute instead of adding them in \`SetupDetails\`:

\`\`\`csharp title="MyCustomItem.cs"
[ItemCategories(RogueCategories.Usable, RogueCategories.Weird, "MyCustomCategory")]
public class MyCustomItem : CustomItem
{
    /* ... */
}
\`\`\`

:::tip{title="Pro-tip: String consts"}
Use static types with string consts, like \`RogueCategories\` and \`ItemTypes\`. This way you won't make a typo. Typos can be critical sometimes, since neither the game nor RogueLibs track all existing item categories *([although it's an interesting idea, maybe I'll do something like that](https://github.com/SugarBarrel/RogueLibs/issues/26))*.
:::

## Initialization {#initialization}

Just call the \`CreateCustomItem\` method with your item's type as a parameter:

\`\`\`csharp title="MyCustomItem.cs"
public class MyCustomItem : CustomItem
{
    [RLSetup]
    public static void Setup()
    {
        // highlight-next-line
        RogueLibs.CreateCustomItem<MyCustomItem>();
    }
}
\`\`\`

:::note
See more about the \`RLSetup\` attribute [here](../patching-utilities#rlsetup).
:::

You can set your item's name and description using \`WithName\` and \`WithDescription\` methods:

\`\`\`csharp title="MyCustomItem.cs"
public class MyCustomItem : CustomItem
{
    [RLSetup]
    public static void Setup()
    {
        RogueLibs.CreateCustomItem<MyCustomItem>();
            // highlight-start
            .WithName(new CustomNameInfo("My Custom Item"))
            .WithDescription(new CustomNameInfo("My Custom Item is very cool and does a lot of great stuff"));
            // highlight-end
    }
}
\`\`\`

You can do the same with sprites and unlocks:

\`\`\`csharp title="MyCustomItem.cs"
public class MyCustomItem : CustomItem
{
    [RLSetup]
    public static void Setup()
    {
        RogueLibs.CreateCustomItem<MyCustomItem>();
            .WithName(new CustomNameInfo("My Custom Item"))
            .WithDescription(new CustomNameInfo("My Custom Item is very cool and does a lot of great stuff"));
            // highlight-start
            .WithSprite(Properties.Resources.MyCustomItem)
            .WithUnlock(new ItemUnlock { UnlockCost = 10, CharacterCreationCost = 5, LoadoutCost = 4, });
            // highlight-end
    }
}
\`\`\`

:::info
See [Custom Names](../names/custom-names), [Custom Sprites](../custom-sprites) for more info.
:::

## Unlock Properties {#unlock-properties}

You can use the following properties when initializing \`ItemUnlock\`s:

Property                      | Default | Description
------------------------------|---------|------------
\`UnlockCost\`                  | \`0\`     | Unlock cost of the item, in nuggets. If set to 0, it will unlock automatically, once all prerequisites are unlocked.
\`CharacterCreationCost\`       | \`1\`     | Cost of the item in Character Creation, in points.
\`LoadoutCost\`                 | \`1\`     | Cost of the item in Loadout, in nuggets.
\`IsAvailable\`                 | \`true\`  | Determines whether the item is available in the Rewards menu.
\`IsAvailableInCC\`             | \`true\`  | Determines whether the item is available in the Character Creation menu.
\`IsAvailableInItemTeleporter\` | \`true\`  | Determines whether the item is available in Item Teleporter's menu.
\`Prerequisites\`               |         | Determines what unlocks must be unlocked in order to unlock this item.
\`Recommendations\`             |         | Just shows these unlocks in a separate Recommendations paragraph in the menus.

Other properties should not be used during initialization.

## Implementing \`SetupDetails\` {#setupdetails}

Alright, while the code generator is being worked on, use the following tables:

  `;

  const { content, frontmatter } = await compileMDX<Frontmatter>(source);

  return (
    <div style={{ display: "flex", flexFlow: "column", gap: "1rem" }}>
      <h1>{frontmatter.title}</h1>
      <div>{frontmatter.description}</div>
      {content}
      <SetCanonicalUrl url={`/docs/${params.slug}`} />
    </div>
  );
}

interface Frontmatter {
  title: string;
  description: string;
}

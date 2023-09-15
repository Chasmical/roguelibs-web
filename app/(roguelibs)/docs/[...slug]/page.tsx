import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import { compileMDX } from "@lib/mdx";

interface PageProps {
  params: { slug: string[] };
}

export default async function DocsPageIndex({ params }: PageProps) {
  const url = `https://raw.githubusercontent.com/SugarBarrel/RogueLibs/main/website/docs/${params.slug.join("/")}.mdx`;

  const source = `---
title: Creating a Custom Item
description: "RogueLibs provides classes and methods to create: usable, combinable, targetable (and targetable+) items. All custom items derive from the CustomItem class, which provides all of the basic item functionality. You can derive your custom item's class from specialized interfaces to expand its functionality (IItemUsable, IItemCombinable, IItemTargetable, IItemTargetableAnywhere). Custom items are initialized and integrated into the game using the RogueLibs.CreateCustomItem<TItem>() method."
---
# Creating a Custom Item :tada:

test :tada: 123 😂 lol :grinning:

@Nile @Abbysssal

RogueLibs provides :tada: classes and methods to create: usable, combinable, targetable (and targetable+) items. All custom items derive from the \`CustomItem\` class, which provides all of the basic item functionality. You can derive your custom item's class from specialized interfaces to expand its functionality ([\`IItemUsable\`](./usable-items.mdx), [\`IItemCombinable\`](./combinable-items.mdx), [\`IItemTargetable\`](./targetable-items.mdx), [\`IItemTargetableAnywhere\`](./targetable-items-plus.mdx)). Custom items are initialized and integrated into the game using the \`RogueLibs.CreateCustomItem<TItem>()\` method.

https://www.youtube.com/watch?v=r57eVyONrJo

https://www.flickr.com/photos/pedrocaetano/27432477888

http://www.23hq.com/mprove/photo/66422006

## \`CustomItem\` class {#customitem}

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

:::tip{title="Pro-tip: String consts"}
Use static types with string consts, like \`RogueCategories\` and \`ItemTypes\`. This way you won't make a typo. Typos can be critical sometimes, since neither the game nor RogueLibs track all existing item categories *([although it's an interesting idea, maybe I'll do something like that](https://github.com/SugarBarrel/RogueLibs/issues/26))*.
:::

:::info
See [Custom Names](../names/custom-names), [Custom Sprites](../custom-sprites) for more info.
:::

  `;

  const { content, frontmatter } = await compileMDX<Frontmatter>(source);

  return (
    <div style={{ display: "flex", flexFlow: "column", gap: "1rem", fontFamily: "var(--standard-font) !important" }}>
      {/* <h1>{frontmatter.title}</h1> */}
      {/* <div>{frontmatter.description}</div> */}
      {content}
      <SetCanonicalUrl url={`/docs/${params.slug}`} />
    </div>
  );
}

interface Frontmatter {
  title: string;
  description: string;
}

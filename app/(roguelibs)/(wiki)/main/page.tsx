import MdxContainer from "@components/Specialized/MdxContainer";
import TabItem from "@components/Common/TabItem";
import Tabs from "@components/Common/Tabs";
import { sample } from "@lib/utils/random";
import CodeBlock from "@components/Common/CodeBlock";
import { fetchItemData } from "@app/assets/sor1-v98/item-data.json";
import ItemInfoBoxServer from "@components/Wiki/ItemInfoBox/server";
import AgentInfoBoxServer from "@components/Wiki/AgentInfoBox/server";
import { fetchAgentData } from "@app/assets/sor1-v98/agent-data.json";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const itemEntries = (await fetchItemData()).entries;
  const items = sample(itemEntries, 3).map(e => e.invItemName!);
  const agentEntries = (await fetchAgentData()).entries;
  const agents = sample(agentEntries, 3).map(e => e.agentName!);

  return (
    <div style={{ padding: "1rem" }}>
      <MdxContainer>
        <Tabs query="os">
          <TabItem value="win" label="Windows" icon="copy">
            <p>{"This is Windows."}</p>
            {agents.map(name => (
              <AgentInfoBoxServer key={name} agentName={name!} />
            ))}
            <CodeBlock lang="json" title="/MySolution/MyProject/agent-data.json">
              {JSON.stringify(agents.map(a => agentEntries.find(e => e.agentName === a)), null, 2)}
            </CodeBlock>
          </TabItem>
          <TabItem values="unix;macos" labels="Unix;macOS">
            <p>{"This is Unix or macOS."}</p>
            <CodeBlock lang="csharp" title="/MySolution/MyProject/Program.cs">
              {"using System;"}
              {""}
              {"namespace MyNamespace"}
              {"{"}
              {"    public static class Program"}
              {"    {"}
              {"        public static void Main()"}
              {"        {"}
              {'            Console.WriteLine("Hello World");'}
              {"        }"}
              {"    }"}
              {"}"}
            </CodeBlock>
            <CodeBlock lang="svg" title="/MySolution/MyProject/icon.svg" wrap nonums>
              {`<svg version="1.1" viewBox="0 0 16 16" width="32" height="32" aria-hidden><path fill="#e6edf3" d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>`}
              {""}
            </CodeBlock>
            {items.map(name => (
              <ItemInfoBoxServer key={name} invItemName={name!} />
            ))}
            <CodeBlock lang="json" title="/MySolution/MyProject/item-data.json">
              {JSON.stringify(items.map(i => itemEntries.find(e => e.invItemName === i)), null, 2)}
            </CodeBlock>
          </TabItem>
        </Tabs>
      </MdxContainer>
    </div>
  );
}

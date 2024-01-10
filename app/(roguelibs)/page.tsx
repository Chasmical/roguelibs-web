import MdxContainer from "@components/Specialized/MdxContainer";
import TabItem from "@components/Common/TabItem";
import Tabs from "@components/Common/Tabs";
import CodeBlock from "@components/Common/CodeBlock";

export default function LandingPage() {
  return (
    <div style={{ padding: "1rem" }}>
      <MdxContainer>
        <Tabs query="os">
          <TabItem value="win" label="Windows" icon="copy">
            <p>{"This is Windows."}</p>
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
          </TabItem>
          <TabItem values="unix;macos" labels="Unix;macOS">
            <p>{"This is Unix or macOS."}</p>
          </TabItem>
        </Tabs>
      </MdxContainer>
    </div>
  );
}

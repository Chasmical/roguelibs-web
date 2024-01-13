import { ItemInfo, fetchItemData } from "@app/assets/sor1-v98/item-data.json";
import { fetchLocale } from "@app/assets/sor1-v98/locale";
import ItemInfoBox from "@components/Wiki/ItemInfoBox";

export default async function ItemInfoBoxServer({ invItemName }: { invItemName: string }) {
  const itemData = await fetchItemData();
  const itemEntry = itemData.entries.find(e => e.invItemName === invItemName);
  if (!itemEntry) return <>{"Not found."}</>;

  const locale = (await fetchLocale("en"))!;
  const name = locale.Categories["Item"][invItemName];
  const description = locale?.Categories["Description"][invItemName];

  const info = { ...itemData.baseline, ...itemEntry } as ItemInfo;
  return <ItemInfoBox info={info} name={name} description={description} />;
}

import { Children, cloneElement, useCallback, useMemo, useState } from "react";
import type { IconType } from "@components/Common/Icon";
import type { TabItemProps } from "@components/Common/TabItem";
import useLocalStorage from "@lib/hooks/useLocalStorage";
import useQueryString from "@lib/hooks/useQueryString";

interface Tab {
  value: string;
  label: React.ReactNode;
  default: boolean;
  key: React.Key | null;
  icon: IconType | null | undefined;
}
export interface TabsHookInput {
  local?: string;
  query?: string;
}
export interface TabsHookOutput {
  tabs: Tab[];
  selectedValue: string;
  selectValue: (newValue: string) => void;
  elements: React.ReactElement<TabItemProps>[];
}

export default function useTabs(children: React.ReactNode, { local, query }: TabsHookInput): TabsHookOutput {
  const [elements, tabs] = useMemo(() => {
    const elements = getTabItemElements(children);
    return [elements, convertTabsChildren(elements)];
  }, [children]);

  function getDefaultValue() {
    return (tabs.find(t => t.default) ?? tabs[0]).value;
  }

  const [simpleState, setSimpleState] = useState(getDefaultValue);
  const [storedState, setStoredState] = useLocalStorage(local);
  const [queryState, setQueryState] = useQueryString(query);

  const selectValue = useCallback((newValue: string) => {
    setSimpleState(newValue);
    setStoredState(newValue);
    setQueryState(newValue === getDefaultValue() ? null : newValue);
  }, []);

  const aggregatedValue = queryState ?? storedState ?? simpleState;
  const selectedValue = useMemo(() => {
    if (tabs.some(t => t.value === aggregatedValue)) return aggregatedValue;
    return getDefaultValue();
  }, [aggregatedValue, tabs]);

  return { tabs, elements, selectedValue, selectValue };
}

function getTabItemElements(children: React.ReactNode) {
  const tabItems: React.ReactElement<TabItemProps>[] = [];

  const handleChild = (child: React.ReactNode, keyPrefix: string) => {
    if (typeof child === "object" && child !== null && "type" in child) {
      if ((child.type as any) === Symbol.for("react.fragment")) {
        keyPrefix += child.key;
        Children.toArray(child.props.children).forEach(sub => handleChild(sub, keyPrefix));
      } else {
        // if (child.type === TabItem)
        tabItems.push(keyPrefix ? cloneElement(child, { key: keyPrefix + child.key }) : child);
      }
    }
  };
  Children.toArray(children).forEach(child => handleChild(child, ""));

  return tabItems;
}

const TabValueSeparator = /[,;|]/;

function convertTabsChildren(tabItemElements: React.ReactElement<TabItemProps>[]) {
  const tabs: Tab[] = [];

  for (const child of tabItemElements) {
    const values = splitValues(child.props.values) ?? [child.props.value];
    const labels = splitValues(child.props.labels) ?? [child.props.label];
    const defaultIndex = convertDefaultIndex(child.props.default, values);
    const count = Math.max(values.length, labels.length);

    for (let i = 0; i < count; i++) {
      const simpleLabel = isSimpleValue(labels[i]);
      const value = "" + (values[i] ?? (simpleLabel ? labels[i] : null) ?? `${child.key}${count > 1 ? "." + i : ""}`);
      const label = labels[i] ?? toTitleCase(value);

      tabs.push({
        key: child.key,
        value: value.toLowerCase(),
        label: label,
        default: i === defaultIndex,
        icon: child.props.icon,
      });
    }
  }

  return tabs;
}

function isSimpleValue(value: unknown) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function splitValues(str: string | string[] | null | undefined) {
  return !str ? null : Array.isArray(str) ? str : str.split(TabValueSeparator);
}
function convertDefaultIndex(value: string | number | boolean | null | undefined, values: (string | undefined)[]) {
  if (value == null || value === false) return -1;
  if (value === true) return 0;
  if (typeof value === "number") return value;
  return values.indexOf(value);
}
function toTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

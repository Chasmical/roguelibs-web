"use client";
import { Children, cloneElement, useCallback, useMemo, useState } from "react";
import useLocalStorage from "@lib/hooks/useLocalStorage";
import useScrollPositionBlocker from "@lib/hooks/useScrollPositionBlocker";
import { TabItemProps } from "@components/Common/TabItem";
import styles from "./index.module.scss";
import clsx from "clsx";
import useQueryString from "@lib/hooks/useQueryString";
import Icon, { IconType } from "@components/Common/Icon";

export interface TabsProps extends TabsHookInput, Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  lazy?: boolean;
  className?: string;
  children?: React.ReactNode;
  faded?: boolean;
  // ...TabsHookInput props
}

export default function Tabs({ lazy, local, query, className, children, faded, ...props }: TabsProps) {
  const tabs = useTabs(children, { local, query });
  return (
    <div role="panel" className={clsx(styles.wrapper, className)} {...props} defaultValue={undefined}>
      <TabsHeader {...tabs} faded={faded} />
      <TabsContainer {...tabs} lazy={lazy} />
    </div>
  );
}

function TabsHeader({ tabs, selectedValue, selectValue, faded }: TabsHookOutput & Pick<TabsProps, "faded">) {
  const tabRefs: (HTMLLIElement | null)[] = [];
  const blockScrollUntilNextRender = useScrollPositionBlocker();

  const handleTabChange = (
    event: React.FocusEvent<HTMLLIElement> | React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>,
  ) => {
    const newTabValue = tabs[tabRefs.indexOf(event.currentTarget)].value;

    if (newTabValue !== selectedValue) {
      blockScrollUntilNextRender(event.currentTarget);
      selectValue(newTabValue);
    }
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    const index = tabRefs.indexOf(event.currentTarget);
    switch (event.key) {
      case "Enter":
        return handleTabChange(event);
      case "ArrowRight":
        return tabRefs[(index + 1) % tabRefs.length]!.focus();
      case "ArrowLeft":
        return tabRefs.at(index - 1)!.focus();
    }
  };

  return (
    <ul role="tablist" aria-orientation="horizontal" className={clsx(styles.tabs, faded && styles.faded)}>
      {/* eslint-disable-next-line unused-imports/no-unused-vars */}
      {tabs.map(({ value, label, key, icon, ...attr }) => {
        const isSelected = selectedValue === value;
        return (
          <li
            key={value}
            role="tab"
            tabIndex={isSelected ? 0 : -1}
            aria-selected={isSelected}
            ref={tabControl => tabRefs.push(tabControl)}
            onKeyDown={handleKeydown}
            onClick={handleTabChange}
            {...attr}
            className={clsx(styles.tab, isSelected && styles.selected, (attr as any).className)}
          >
            {icon && <Icon type={icon} size={24} />}
            {label ?? value}
          </li>
        );
      })}
    </ul>
  );
}

function TabsContainer({ lazy, elements, tabs, selectedValue }: TabsHookOutput & Pick<TabsProps, "lazy">) {
  return elements.map(item => {
    const sub = tabs.filter(t => t.key === item.key);
    const hidden = sub.every(t => t.value !== selectedValue);
    if (lazy && hidden) return null;
    return cloneElement(item, { hidden });
  });
}

interface Tab {
  value: string;
  label: React.ReactNode;
  default: boolean;
  key: React.Key | null;
  icon: IconType | null | undefined;
}
interface TabsHookInput {
  local?: string;
  query?: string;
}
interface TabsHookOutput {
  tabs: Tab[];
  selectedValue: string;
  selectValue: (newValue: string) => void;
  elements: React.ReactElement<TabItemProps>[];
}

export function useTabs(children: React.ReactNode, { local, query }: TabsHookInput): TabsHookOutput {
  const elements = useMemo(() => getTabItemElements(children), [children]);
  const tabs = useMemo(() => convertTabsChildren(elements), [elements]);

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
    const value = getDefaultValue();
    selectValue(value);
    return value;
  }, [aggregatedValue, tabs]);

  return { tabs, elements, selectedValue, selectValue };
}

const TabValueSeparator = /[,;|]/;

function convertTabsChildren(tabItemElements: React.ReactElement<TabItemProps>[]) {
  const tabs: Tab[] = [];

  for (const child of tabItemElements) {
    const values = splitValues(child.props.values) ?? [child.props.value];
    const labels = splitValues(child.props.labels) ?? [child.props.label];
    const defaultIndex = convertDefaultIndex(child.props.default, values);
    let count = Math.max(values.length, labels.length);
    for (let i = 0; i < count; i++) {
      const simpleLabel = isSimpleValue(labels[i]);
      let value = "" + (values[i] ?? (simpleLabel ? labels[i] : null) ?? `${child.key}${count > 1 ? "." + i : ""}`);
      let label = labels[i] ?? toTitleCase(value);

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

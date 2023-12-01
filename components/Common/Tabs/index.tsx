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

export default function Tabs({ lazy, id, query, className, children, faded, ...props }: TabsProps) {
  const tabs = useTabs(children, { id, query });
  return (
    <div role="panel" className={clsx(styles.wrapper, className)} {...props} defaultValue={undefined}>
      <TabsHeader {...tabs} faded={faded} />
      <TabsContainer lazy={lazy} {...tabs}>
        {children}
      </TabsContainer>
    </div>
  );
}

function TabsHeader({ tabs, selectedValue, selectValue, faded }: TabsHookOutput & { faded?: boolean }) {
  const tabRefs: (HTMLLIElement | null)[] = [];
  const blockElementScrollPositionUntilNextRender = useScrollPositionBlocker();

  const handleTabChange = (
    event: React.FocusEvent<HTMLLIElement> | React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>,
  ) => {
    const newTabValue = tabs[tabRefs.indexOf(event.currentTarget)].value;

    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(event.currentTarget);
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

function TabsContainer({ lazy, children, tabs, selectedValue }: Pick<TabsProps, "lazy" | "children"> & TabsHookOutput) {
  const items = Children.toArray(children).filter(Boolean) as React.ReactElement<TabItemProps>[];

  return (
    <>
      {items.map(item => {
        const sub = tabs.filter(t => t.key === item.key);
        const hidden = sub.every(t => t.value !== selectedValue);
        if (lazy && hidden) return null;
        return cloneElement(item, { hidden });
      })}
    </>
  );
}

interface Tab {
  value: string;
  label: React.ReactNode;
  default: boolean;
  key: React.Key | null;
  icon: IconType | null | undefined;
}
interface TabsHookInput {
  id?: string;
  query?: boolean;
}
interface TabsHookOutput {
  tabs: Tab[];
  selectedValue: string;
  selectValue: (newValue: string) => void;
}

export function useTabs(children: React.ReactNode, { id, query }: TabsHookInput): TabsHookOutput {
  const tabs = useMemo(() => {
    return convertTabsChildren(children);
  }, [children]);

  function getDefaultValue() {
    return (tabs.find(t => t.default) ?? tabs[0]).value;
  }

  const [simpleState, setSimpleState] = useState(getDefaultValue);
  const [storedState, setStoredState] = useLocalStorage(id);
  const [queryState, setQueryState] = useQueryString(query ? id : undefined);

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

  return { tabs, selectedValue, selectValue };
}

const TabValueSeparator = /[,;|]/;

function convertTabsChildren(children: React.ReactNode): Tab[] {
  const tabs: Tab[] = [];
  for (const child of Children.toArray(children).filter(Boolean) as React.ReactElement<TabItemProps>[]) {
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
function toTitleCase(str: string): string;
function toTitleCase(str: string | null | undefined): string | undefined;
function toTitleCase(str: string | null | undefined): string | undefined {
  if (!str) return undefined;
  return str.charAt(0).toUpperCase() + str.substring(1);
}

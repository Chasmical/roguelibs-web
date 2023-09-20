"use client";
import { Children, HTMLAttributes, ReactElement, cloneElement, useMemo, useState } from "react";
import { TabItemProps } from "@components/Common/TabItem";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface TabsProps extends TabsHookInput, Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  lazy?: boolean;
  className?: string;
  children?: React.ReactNode;
  // ...TabsHookInput props
}

export default function Tabs({ lazy, className, children, ...props }: TabsProps) {
  const tabs = useTabs(props);
  return (
    <div role="panel" className={clsx(styles.wrapper, className)} {...props}>
      <TabsHeader {...tabs} />
      <TabsContainer lazy={lazy} {...tabs}>
        {children}
      </TabsContainer>
    </div>
  );
}

function TabsHeader({ tabs, selectedValue, selectValue }: TabsHookOutput) {
  const tabRefs: (HTMLLIElement | null)[] = [];
  // const { blockElementScrollPositionUntilNextRender } = useScrollPositionBlocker();

  const handleTabChange = (
    event: React.FocusEvent<HTMLLIElement> | React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>,
  ) => {
    const newTabValue = tabs[tabRefs.indexOf(event.currentTarget)].value;

    if (newTabValue !== selectedValue) {
      // blockElementScrollPositionUntilNextRender(newTab);
      selectValue(newTabValue);
    }
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    const index = tabRefs.indexOf(event.currentTarget);
    switch (event.key) {
      case "Enter":
        return handleTabChange(event);
      case "ArrowRight":
        return (tabRefs[index + 1] ?? tabRefs[0]!).focus();
      case "ArrowLeft":
        return (tabRefs[index - 1] ?? tabRefs[tabRefs.length - 1]!).focus();
    }
  };

  return (
    <ul role="tablist" aria-orientation="horizontal" className={styles.tabs}>
      {tabs.map(({ value, label, ...attr }) => {
        const isSelected = isTabSelected(selectedValue, value);
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
            {label ?? value}
          </li>
        );
      })}
    </ul>
  );
}

function TabsContainer({ lazy, children, selectedValue }: Pick<TabsProps, "lazy" | "children"> & TabsHookOutput) {
  let tabs = Children.toArray(children).filter(Boolean) as ReactElement<TabItemProps>[];
  lazy && (tabs = tabs.filter(tab => isTabSelected(selectedValue, tab.props.value)));

  return (
    <>
      {tabs.map((tab, key) => {
        const hidden = !isTabSelected(selectedValue, tab.props.value);
        if (lazy && hidden) return null;
        return cloneElement(tab, { key, hidden });
      })}
    </>
  );
}

interface Tab {
  value: string;
  label: string;
  default?: boolean;
}
interface TabsHookInput {
  values: Tab[] | string[] | Record<string, string> | string;
  id?: string;
  query?: boolean;
  storage?: boolean;
}
interface TabsHookOutput {
  tabs: Tab[];
  selectedValue: string;
  selectValue: (newValue: string) => void;
}

export function useTabs({ values, id, query, storage }: TabsHookInput): TabsHookOutput {
  const tabs = useMemo(() => convertTabValues(values), [values]);
  const [selectedValue, setSelectedValue] = useState(() => (tabs.find(t => t.default) ?? tabs[0]).value);

  const selectValue = (newValue: string) => {
    setSelectedValue(newValue);
    // TODO: store the new value
  };

  return { tabs, selectedValue, selectValue };
}

const TabValueSeparator = /[,;|]/;

function convertTabValues(values: TabsHookInput["values"]): Tab[] {
  if (typeof values === "string") {
    return values
      .split(TabValueSeparator)
      .map(v => v.trim())
      .filter(Boolean)
      .map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));
  }
  if (!Array.isArray(values)) {
    return Object.entries(values).map(([value, label]) => ({ value, label }));
  }
  if (typeof values[0] !== "object") {
    return (values as string[])
      .map(String)
      .filter(Boolean)
      .map(v => ({ value: v, label: v }));
  }
  return values as Tab[];
}

function isTabSelected(selectedValue: string, value: string | string[]) {
  if (Array.isArray(value)) return value.includes(selectedValue);
  if (TabValueSeparator.test(value)) {
    return value
      .split(TabValueSeparator)
      .map(v => v.trim())
      .includes(selectedValue);
  }
  return selectedValue === value;
}

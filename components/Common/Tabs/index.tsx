"use client";
import { cloneElement } from "react";
import Icon from "@components/Common/Icon";
import useScrollPositionBlocker from "@lib/hooks/useScrollPositionBlocker";
import useTabs, { TabsHookInput, TabsHookOutput } from "./useTabs";
import styles from "./index.module.scss";
import clsx from "clsx";

type HTMLDivProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue">;

export interface TabsProps extends HTMLDivProps, TabsHookInput {
  lazy?: boolean;
  faded?: boolean;
}

export default function Tabs({ lazy, local, query, className, children, faded, ...props }: TabsProps) {
  const tabs = useTabs(children, { local, query });
  return (
    <div role="panel" className={clsx(styles.wrapper, className)} {...props}>
      <TabsHeader {...tabs} faded={faded} />
      <TabsContainer {...tabs} lazy={lazy} />
    </div>
  );
}

function TabsHeader({ tabs, selectedValue, selectValue, faded }: TabsHookOutput & Pick<TabsProps, "faded">) {
  const tabRefs: (HTMLLIElement | null)[] = [];
  const blockScrollUntilNextRender = useScrollPositionBlocker();

  const handleTabChange = (event: React.UIEvent<HTMLLIElement>) => {
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
            ref={tabRef => tabRefs.push(tabRef)}
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

function TabsContainer({ elements, tabs, selectedValue, lazy }: TabsHookOutput & Pick<TabsProps, "lazy">) {
  return elements.map(item => {
    const matches = tabs.filter(t => t.key === item.key);
    const hidden = matches.every(t => t.value !== selectedValue);
    if (lazy && hidden) return null;
    return cloneElement(item, { hidden });
  });
}

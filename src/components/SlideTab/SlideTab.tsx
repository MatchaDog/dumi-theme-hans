import "./index.less";

import React, { FC, useState, useRef, useCallback, CSSProperties } from "react";
import { useDidUpdate, useDidMount } from "hooooks";
import cls from "classnames";

import { NavLink } from "dumi/theme";
import { Dropdown, Menu } from "antd";

const SlideTab: FC<{
    tabData: any[];
    tabLabel: string | number;
    tabKey: string | number;
    onTabChange?: (tab: any) => void;
    value?: any;
    className?: string;
    style?: CSSProperties;
}> = ({ tabData, tabKey, tabLabel, className, style }) => {
    const ref = useRef<HTMLDivElement>();
    const [activeTab, setActiveTab] = useState(tabData[0]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [inkBar, setInkBar] = useState({
        left: 0,
        width: 0,
    });

    const handleSetInkBar = useCallback(() => {
        const index = tabData.findIndex((item) => {
            return item[tabKey] === activeTab[tabKey];
        });
        const child = ref.current.children[index] as HTMLSpanElement;
        setInkBar({
            left: child.offsetLeft,
            width: child.offsetWidth,
        });
    }, [tabKey, activeTab, tabData]);

    const handleTabChange = (item) => {
        setActiveTab(item);
    };

    const handleMenuClick = (item, { key }) => {
        setActiveTab(item);
        setActiveMenu(key);
    };

    useDidUpdate(() => {
        handleSetInkBar();
    }, [activeTab]);

    useDidMount(() => {
        handleSetInkBar();
    });

    return (
        <div className={cls("slide-tab", { className })} ref={ref}>
            {tabData.length > 0 &&
                tabData.map((item) =>
                    item.children && item.children.length > 0 ? (
                        <Dropdown
                            getPopupContainer={() => document.querySelector(".slide-tab")}
                            key={item.path}
                            overlay={
                                <Menu onClick={(e) => handleMenuClick(item, e)}>
                                    {item.children.map((c) => (
                                        <Menu.Item
                                            key={c.path}
                                            className={cls({
                                                active: c.path === activeMenu,
                                            })}>
                                            <NavLink to={c.path} exact>
                                                <span>{c.title}</span>
                                            </NavLink>
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            }>
                            <span
                                key={item[tabKey]}
                                className={cls("slide-tab-item", {
                                    active: item[tabKey] === activeTab[tabKey],
                                })}>
                                {item[tabLabel]}
                            </span>
                        </Dropdown>
                    ) : (
                        <NavLink key={item.path} to={item.path} exact>
                            <span
                                className={cls("slide-tab-item", {
                                    active: item[tabKey] === activeTab[tabKey],
                                })}
                                onClick={() => {
                                    handleTabChange(item);
                                }}>
                                {item[tabLabel]}
                            </span>
                        </NavLink>
                    ),
                )}
            <span
                className="active-bg-tab"
                style={{
                    left: inkBar.left,
                    width: inkBar.width,
                }}></span>
        </div>
    );
};

export default SlideTab;

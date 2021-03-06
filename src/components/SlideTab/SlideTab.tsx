import "./index.less";

import React, { FC, useState, useRef, useCallback, CSSProperties, useContext } from "react";
import { useDidUpdate, useDidMount } from "hooooks";
import cls from "classnames";

import { NavLink, context } from "dumi/theme";
import { Dropdown, Menu } from "antd";

const SlideTab: FC<{
    tabData: any[];
    tabLabel: string | number;
    tabKey: string | number;
    onTabChange?: (tab: any) => void;
    value?: any;
    className?: string;
    style?: CSSProperties;
}> = ({ tabData, tabKey, tabLabel, className }) => {
    const { meta } = useContext(context);
    const ref = useRef<HTMLDivElement>();
    const [activeTab, setActiveTab] = useState(tabData[0]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [inkBar, setInkBar] = useState({
        left: 0,
        width: 0,
    });
    const handleSetInkBar = useCallback(() => {
        const curRoute = meta;
        if (!curRoute || !curRoute.filePath) {
            setInkBar({
                left: 0,
                width: 0,
            });
            setActiveTab({});
            setActiveMenu(null);
            return;
        }
        const index = tabData.findIndex((item) => {
            return curRoute.filePath.includes(item[tabKey]);
        });
        const child = ref.current.children[index] as HTMLSpanElement;
        setInkBar({
            left: child.offsetLeft,
            width: child.offsetWidth,
        });
        setActiveMenu(meta.legacy);
        setActiveTab(tabData[index]);
    }, [tabKey, tabData, meta]);

    const handleTabChange = (item, index) => {
        setActiveTab(item);
        const child = ref.current.children[index] as HTMLSpanElement;
        setInkBar({
            left: child.offsetLeft,
            width: child.offsetWidth,
        });
    };

    const handleMenuClick = (item, index, { key }) => {
        setActiveTab(item);
        const child = ref.current.children[index] as HTMLSpanElement;
        setInkBar({
            left: child.offsetLeft,
            width: child.offsetWidth,
        });
        setActiveMenu(key);
    };

    useDidMount(() => {
        handleSetInkBar();
    });

    useDidUpdate(() => {
        const curRoute = meta;
        if (!curRoute || !curRoute.filePath) {
            setInkBar({
                left: 0,
                width: 0,
            });
            setActiveTab({});
            setActiveMenu(null);
            return;
        }
    }, [meta]);

    return (
        <div className={cls("slide-tab", { className })} ref={ref}>
            {tabData.length > 0 &&
                tabData.map((item, index) =>
                    item.children && item.children.length > 0 ? (
                        <Dropdown
                            getPopupContainer={() => document.querySelector(".slide-tab")}
                            key={item.path}
                            overlay={
                                <Menu onClick={(e) => handleMenuClick(item, index, e)}>
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
                                    handleTabChange(item, index);
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

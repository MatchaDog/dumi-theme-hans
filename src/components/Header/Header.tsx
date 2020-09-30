import "./index.less";

import React, { FC, useState, useContext, useEffect, useCallback } from "react";

import { context, Link } from "dumi/theme";
import { ThemeStore } from "../../store/ThemeProvider";
import { prefix } from "../../style/prefix";

import { Divider, Row, Switch, Col } from "antd";
import SlideTab from "../SlideTab";
import Icon from "../Icon";

const Header: FC = () => {
    const {
        base,
        config: { logo, title },
        menu,
        meta,
    } = useContext(context);
    const { state, dispatch } = useContext(ThemeStore);
    const setTheme = useCallback(
        (type: string) => {
            dispatch({
                value: {
                    ...state,
                    theme: type,
                },
            });
        },
        [dispatch, state],
    );

    const setAntdDarkCss = useCallback(() => {
        const darkCss = document.querySelector("#dark-css");
        if (!darkCss) {
            const link = document.createElement("link");
            link.href = "https://cdnjs.cloudflare.com/ajax/libs/antd/4.6.6/antd.dark.min.css";
            link.type = "text/css";
            link.rel = "stylesheet";
            link.id = "dark-css";
            document.head.appendChild(link);
            setTheme("dark");
        } else {
            document.head.removeChild(darkCss);
        }
    }, [setTheme]);

    const themeCallback = useCallback(
        (e: MediaQueryListEvent) => {
            if (e.matches) {
                document.body.dataset.theme = "dark";
                setTheme("dark");
            } else {
                document.body.dataset.theme = "default";
                setTheme("default");
            }
            setAntdDarkCss();
        },
        [setTheme, setAntdDarkCss],
    );

    useEffect(() => {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.body.dataset.theme = "dark";
            setTheme("dark");
            setAntdDarkCss();
        }
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", themeCallback);
    }, []);

    const handleThemeClick = useCallback(() => {
        if (state.theme === "dark") {
            document.body.dataset.theme = "default";
            setTheme("default");
        } else {
            document.body.dataset.theme = "dark";
        }
        setAntdDarkCss();
    }, [state.theme, setTheme, setAntdDarkCss]);

    return (
        <header className={`${prefix}-header`}>
            <Row className={`${prefix}-header-bar`} align="middle">
                <Col xs={0} sm={0} md={0} lg={8} xl={6} xxl={5}>
                    <Link
                        className={`${prefix}-header-logo`}
                        style={{
                            backgroundImage: logo && `url('${logo}')`,
                        }}
                        to={base}
                        data-plaintext={logo === false || undefined}>
                        {title}
                    </Link>
                    <Divider
                        style={{
                            margin: "0 58px",
                        }}
                        className={`${prefix}-header-divider`}
                        type="vertical"></Divider>
                </Col>
                <Col xs={24} sm={22} md={22} lg={15} xl={17} xxl={18}>
                    <Row justify="space-between" align="middle" style={{ flex: 1 }}>
                        <SlideTab tabData={menu} tabLabel="title" tabKey="title"></SlideTab>
                    </Row>
                </Col>
                <Col xs={0} sm={2} md={2} lg={1} xl={1} xxl={1}>
                    <Switch
                        checked={state.theme === "dark"}
                        onChange={handleThemeClick}
                        checkedChildren={<Icon type={"iconmoon"}></Icon>}
                        unCheckedChildren={<Icon type={"iconsun"}></Icon>}></Switch>
                </Col>
            </Row>
        </header>
    );
};

export default Header;

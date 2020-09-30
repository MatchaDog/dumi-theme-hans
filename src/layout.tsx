import "./style/layout.less";
import "./style/theme.less";

import React, { FC, useContext } from "react";
import { prefix } from "./style/prefix";

import { Layout, Row, Col } from "antd";
import { Header, Footer, SlugList } from "./components";
import { ThemeProvider } from "./store/ThemeProvider";
import { context } from "dumi/theme";

const CustomLayout: FC = ({ children }) => {
    const {
        config: { mode },
        meta,
    } = useContext(context);
    const isSiteMode = mode === "site";
    const showHero = isSiteMode && meta.hero;
    const showFeatures = isSiteMode && meta.features;
    const showSlugs =
        !showHero &&
        !showFeatures &&
        Boolean(meta.slugs?.length) &&
        (meta.toc === "content" || meta.toc === undefined) &&
        !meta.gapless;
    return (
        <ThemeProvider>
            <Layout className={`${prefix}-layout`}>
                <Header />
                <Row className={`${prefix}-article-row`}>
                    <Col xs={0} sm={0} md={0} xl={3} xxl={3}></Col>
                    <Col xs={24} sm={24} md={18} lg={18} xl={16} xxl={16}>
                        <article className={`${prefix}-article`}>
                            {children}
                            <Footer />
                        </article>
                    </Col>
                </Row>
                {showSlugs && <SlugList></SlugList>}
            </Layout>
        </ThemeProvider>
    );
};

export default CustomLayout;

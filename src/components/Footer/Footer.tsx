/*
 * @Date: 2020-09-29 18:02:43
 * @LastEditors: Hans
 * @description:
 * @LastEditTime: 2020-09-29 18:09:45
 * @FilePath: /dumi-theme-hans/src/components/Footer/Footer.tsx
 */
import React, { useContext, FC } from "react";
import { context, Link } from "dumi/theme";
import { prefix } from "../../style/prefix";

const Footer: FC = () => {
    const {
        config: { locales, repository, navs },
        meta,
        locale,
    } = useContext(context);
    console.log(locale, locales);
    const { url: repoUrl, branch } = repository;
    const repoPlatform = { github: "GitHub", gitlab: "GitLab" }[
        (repoUrl || "").match(/(github|gitlab)/)?.[1] || "nothing"
    ];
    const updatedTime: any = new Date(meta.updatedTime).toLocaleString();
    const isCN =
        locale === "zh-CN" ||
        (locale === "*" && locales[0]?.name === "zh-CN") ||
        /[\u4e00-\u9fa5]/.test(JSON.stringify(navs));

    return (
        <div className={`${prefix}-layout-footer-meta`}>
            {repoPlatform && (
                <Link to={`${repoUrl}/edit/${branch}/${meta.filePath}`}>
                    {isCN ? `在 ${repoPlatform} 上编辑这篇文档` : `Edit this doc on ${repoPlatform}`}
                </Link>
            )}
            <span data-updated-text={isCN ? "最后更新时间：" : "Last Update: "}>{updatedTime}</span>
        </div>
    );
};

export default Footer;

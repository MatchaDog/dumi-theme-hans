import "./SourceCode.less";

import React, { useContext } from "react";

import { useCopy } from "dumi/theme";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/dracula";

import { prefix } from "../style/prefix";
import { ThemeStore } from "../store/ThemeProvider";

import { Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

export interface ICodeBlockProps {
    code: string;
    lang: Language;
    showCopy?: boolean;
}

export default ({ code, lang, showCopy = true }: ICodeBlockProps) => {
    const [copyCode, copyStatus] = useCopy();
    const { state, dispatch } = useContext(ThemeStore);
    return (
        <div className={`${prefix}-code-block`}>
            <Highlight {...defaultProps} theme={state.theme === "dark" ? theme : undefined} code={code} language={lang}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={className} style={style}>
                        {showCopy && (
                            <Button
                                title="Copy source code"
                                className={`${prefix}-icon ${prefix}-code-block-copy-btn`}
                                type="text"
                                data-status={copyStatus}
                                role="none"
                                onClick={() => copyCode(code)}>
                                <CopyOutlined />
                            </Button>
                        )}
                        {tokens.map((line, i) => (
                            <div {...getLineProps({ line, key: i })}>
                                {line.map((token, key) => (
                                    <span {...getTokenProps({ token, key })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
};

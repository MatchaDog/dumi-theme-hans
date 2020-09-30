import "./Previewer.less";

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useContext, useRef } from "react";
// @ts-ignore
import { history } from "dumi";
// @ts-ignore
import {
    context,
    useCodeSandbox,
    useRiddle,
    useMotions,
    useCopy,
    useLocaleProps,
    Link,
    AnchorLink,
    IPreviewerComponentProps,
} from "dumi/theme";

import { prefix } from "../style/prefix";

import { Icon } from "../components";
import SourceCode from "./SourceCode";
import { CodeSandboxOutlined, ShareAltOutlined, CopyOutlined, CodeOutlined } from "@ant-design/icons";
import { Button } from "antd";

export interface IPreviewerProps extends IPreviewerComponentProps {
    /**
     * enable transform to change CSS containing block for demo
     */
    transform?: boolean;
    /**
     * modify background for demo area
     */
    background?: string;
    /**
     * collapse padding of demo area
     */
    compact?: string;
    /**
     * configurations for action button
     */
    hideActions?: ("CSB" | "EXTERNAL" | "RIDDLE")[];
    /**
     * show source code by default
     */
    defaultShowCode?: boolean;
}

const Previewer: React.FC<IPreviewerProps> = (oProps) => {
    const demoRef = useRef();
    const { locale } = useContext(context);
    const props = useLocaleProps<IPreviewerProps>(locale, oProps);
    const isActive = history.location.hash === `#${props.identifier}`;
    const isSingleFile = Object.keys(props.sources).length === 1;
    const openCSB = useCodeSandbox(props.hideActions?.includes("CSB") ? null : props);
    const openRiddle = useRiddle(props.hideActions?.includes("RIDDLE") ? null : props);
    const [execMotions, isMotionRunning] = useMotions(props.motions || [], demoRef.current);
    const [copyCode, copyStatus] = useCopy();
    const [currentFile, setCurrentFile] = useState("_");
    const [sourceType, setSourceType] = useState<"jsx" | "tsx">();
    const [showSource, setShowSource] = useState(Boolean(props.defaultShowCode));
    const currentFileCode =
        props.sources[currentFile][sourceType] || props.sources[currentFile].jsx || props.sources[currentFile].content;

    useEffect(() => {
        setSourceType(props.sources._.tsx ? "tsx" : "jsx");
    }, []);

    return (
        <div
            style={props.style}
            className={[props.className, `${prefix}-previewer`, isActive ? `${prefix}-previewer-target` : ""]
                .filter(Boolean)
                .join(" ")}
            id={props.identifier}>
            <div
                ref={demoRef}
                className={`${prefix}-previewer-demo`}
                style={{
                    transform: props.transform ? "translate(0, 0)" : undefined,
                    padding: props.compact ? "0" : undefined,
                    background: props.background,
                }}>
                {props.children}
            </div>
            <div className={`${prefix}-previewer-desc`} data-title={props.title}>
                {props.title && <AnchorLink to={`#${props.identifier}`}>{props.title}</AnchorLink>}
                {props.description && (
                    <div
                        // eslint-disable-next-line
                        dangerouslySetInnerHTML={{ __html: props.description }}
                    />
                )}
            </div>
            <div className={`${prefix}-previewer-actions`}>
                {openCSB && (
                    <Button
                        title="Open demo on CodeSandbox.io"
                        className={`${prefix}-icon`}
                        type="text"
                        role="none"
                        onClick={openCSB}>
                        <CodeSandboxOutlined />
                    </Button>
                )}
                {!props.hideActions?.includes("EXTERNAL") && (
                    <Link target="_blank" to={`/~demos/${props.identifier}`}>
                        <Button title="Open demo in new tab" className={`${prefix}-icon`} role="none" type="text">
                            <ShareAltOutlined />
                        </Button>
                    </Link>
                )}
                <span />
                <Button
                    title="Copy source code"
                    className={`${prefix}-icon`}
                    type="text"
                    data-status={copyStatus}
                    role="none"
                    onClick={() => copyCode(currentFileCode)}>
                    <CopyOutlined />
                </Button>

                {isSingleFile && showSource && (
                    <Button
                        title="Toggle type for source code"
                        className={`${prefix}-icon`}
                        role="none"
                        type="text"
                        onClick={() => setSourceType(sourceType === "tsx" ? "jsx" : "tsx")}>
                        <Icon type={sourceType === "tsx" ? "iconjavascript" : "icontypescript"}></Icon>
                    </Button>
                )}
                <Button
                    title="Toggle source code panel"
                    className={`${prefix}-icon${showSource ? `${prefix}-btn-expand` : ""}`}
                    type="text"
                    role="none"
                    onClick={() => setShowSource(!showSource)}>
                    <CodeOutlined />
                </Button>
            </div>
            {showSource && (
                <div className={`${prefix}-previewer-source-wrapper`}>
                    {!isSingleFile && (
                        <ul className={`${prefix}-previewer-source-tab`}>
                            {Object.keys(props.sources).map((filename) => (
                                <li className={currentFile === filename ? "active" : ""} key={filename}>
                                    <button type="button" onClick={() => setCurrentFile(filename)}>
                                        {filename === "_" ? `index.${sourceType}` : filename}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className={`${prefix}-previewer-source`}>
                        <SourceCode code={currentFileCode} lang={sourceType} showCopy={false} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Previewer;

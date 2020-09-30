import "./index.less";

import React, { FC, useContext, useState, useCallback } from "react";
import { context, AnchorLink } from "dumi/theme";
import cls from "classnames";
import { prefix } from "../../style/prefix";

const SlugList: FC = () => {
    const { meta } = useContext(context);
    const [activeSlug, setActiveSlug] = useState(null);
    const handleSelectSlug = useCallback((i, index) => {
        setActiveSlug(i.value);
    }, []);
    return (
        <ul className={`${prefix}-slug-list`}>
            {meta &&
                meta.slugs &&
                meta.slugs.length > 0 &&
                meta.slugs
                    .filter((i) => i.depth < 5 && i.depth > 1)
                    .map((i, index) => (
                        <li
                            key={i.value}
                            className={cls(`${prefix}-slug-list-item`, {
                                active: i.value === activeSlug,
                            })}
                            onClick={() => handleSelectSlug(i, index)}>
                            <AnchorLink to={`#${i.heading}`}>
                                <span className={`${prefix}-slug-list-item-circle`}></span>
                                <span className={`${prefix}-slug-list-item-text`}>
                                    {index + 1}、{i.value}
                                </span>
                            </AnchorLink>
                        </li>
                    ))}
        </ul>
    );
};

export default SlugList;

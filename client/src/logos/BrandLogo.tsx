import React from 'react';

import cli from '../assets/cli.png';
import frontend_build_tool from '../assets/frontend_build_tool.png';
import frontend_framework from '../assets/frontend_framework.png';
import linter from '../assets/linter.png';
import nodejs from '../assets/nodejs.png';
import typescript from '../assets/typescript.png';
import web from '../assets/web.png';

const imageLogos = {
    cli,
    frontend_build_tool,
    frontend_framework,
    linter,
    nodejs,
    typescript,
    web
};

interface BrandLogoProps {
    name: string,
}

const BrandLogo: React.FC<BrandLogoProps> = (props: BrandLogoProps) => {
    return (
        <div className="icon-container">
            <img src={imageLogos[props.name]} alt="Nopalm" />
        </div>
    )
};

export default BrandLogo;

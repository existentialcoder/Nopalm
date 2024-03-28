import React from 'react';

import NopalmLogoImg from '../assets/nopalm.svg';

import './NopalmLogo.scss';

interface NopalmLogoProps {
    includeTitle?: boolean
}

const NopalmLogo: React.FC<NopalmLogoProps> = (props: NopalmLogoProps) => {
    return (
        <div className="icon-container">
            <img src={NopalmLogoImg} width={"25%"} height={"100%"} alt="Nopalm" />
            {
                props.includeTitle ? <div className="nopalm-title">
                    NOPALM
                </div> : ''
            }
        </div>
    )
};

export default NopalmLogo;

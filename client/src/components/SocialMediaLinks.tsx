import React from 'react';

import './SocialMediaLinks.scss';

import Icon, {
    GithubFilled, FacebookFilled, LinkedinFilled
} from '@ant-design/icons';

type SocialMediaData = {
    icon: typeof Icon,
    label: string,
    linkSrc: string
};

const socialMediaData: SocialMediaData[] = [
    {
        icon: LinkedinFilled,
        label: 'Linkedin',
        linkSrc: 'https://linkedin.com'
    },
    {
        icon: GithubFilled,
        label: 'Github',
        linkSrc: 'https://github.com/existentialcoder'
    },
    {
        icon: FacebookFilled,
        label: 'Facebook',
        linkSrc: 'https://facebook.com'
    },
];

const SocialMediaLinks: React.FC = () => {
    return (
        <div className="social-media-link-container">
            {
                socialMediaData.map(socialMedia =>
                (
                    <div className="social-media-link" key={socialMedia.label}>
                        <a href={socialMedia.linkSrc} target={'_blank'}>
                            <socialMedia.icon />
                        </a>
                    </div>
                )
                )
            }
        </div>
    )
};

export default SocialMediaLinks;

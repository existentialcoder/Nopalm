import React, { useEffect, useRef, useState } from "react";

import { Flex, Button, Modal } from 'antd';

import './Packages.scss';

import PackageCard from '../components/PackageCard';

import Dataservice from '../api/Dataservice';

import { InstalledPackageProps, PackageExplorerRef, ProjectDetailsProps, SettingsResultProps } from "../helpers/types";

import PackageExplorer from '../components/PackageExplorer';

import { dummyPackages } from "../helpers/constants";

const Packages: React.FC<{ settings: SettingsResultProps }> = (props) => {
    const [installedPackages, setInstalledPackages] = useState<InstalledPackageProps[]>([]);

    const [projectDetails, setProjectDetails] = useState<ProjectDetailsProps>({});

    const [packagesLoading, setPackagesLoading] = useState(true);

    const [emptyPackageList, setEmptyPackageList] = useState(false);

    const [isPackagesSaveLoading, setIsPackagesSaveLoading] = useState(false);

    const [isModalOpen, setModalOpen] = useState(false);

    const packageExplorerRef = useRef<PackageExplorerRef>(null);

    async function setInitialFlags() {
        const projectDetails = await Dataservice.getProjectDetails();
        const packages = await Dataservice.getInstalledPackages();

        if (packages.length === 0) {
            setEmptyPackageList(true);
        }

        setProjectDetails(projectDetails);
        setInstalledPackages(packages);
        setPackagesLoading(false);
    }

    useEffect(() => {
        setInitialFlags();
    }, []);

    const reRenderPackages = () => {
        setTimeout(() => setInitialFlags(), 100);
    };

    return (
        <div className="packages-container">
            <div className="title-container">
                Installed Packages
                <Button type={"primary"} onClick={() => setModalOpen(true)}>
                    Add more
                </Button>
            </div>
            <Modal title="Package Explorer"
                open={isModalOpen} width={1000} bodyStyle={{ minHeight: 430, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
                footer={[
                    <Button key="revert" disabled={isPackagesSaveLoading} type="default" onClick={() => packageExplorerRef.current?.onRevertClickHandler()}>
                        Revert
                    </Button>,
                    <Button key="save" type="primary" loading={isPackagesSaveLoading}
                    onClick={() => { setIsPackagesSaveLoading(true); packageExplorerRef.current?.onSaveClickHandler() }}>
                        Save
                    </Button>
                ]}
                onCancel={() => { setModalOpen(false); packageExplorerRef.current?.onCancelClickHandler() }}>
                <PackageExplorer
                    ref={packageExplorerRef}
                    reRenderPackages={reRenderPackages}
                    setIsPackagesSaveLoading={setIsPackagesSaveLoading}
                    projectName={projectDetails.name}
                    projectDescription={projectDetails.description} />
            </Modal>
            <div className="packages-list">
                {installedPackages.length === 0 && emptyPackageList && (
                    <div className="no-packages-container"> No packages installed.
                        <div className="consent-btn-group">
                            <Flex gap="medium" wrap="wrap" justify="center" style={{ margin: "10px" }}>
                                <Button type={"primary"} onClick={() => { }}>
                                    Explore
                                </Button>
                            </Flex>
                        </div>
                    </div>
                ) ||
                    (installedPackages.length > 0 ? installedPackages : dummyPackages).map(installedPackage => (
                        <PackageCard
                            reRenderPackages={reRenderPackages}
                            loading={packagesLoading}
                            key={installedPackage.name}
                            package={installedPackage}
                            installed={true}
                            versions={[]}
                            accentColor={props.settings.appearance.accent_color}
                            modifyListOfPackagesToInstall={() => { }}
                        />
                    ))}
            </div>
        </div>
    )
};

export default Packages;

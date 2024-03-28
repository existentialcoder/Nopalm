import React, { useState, forwardRef, useImperativeHandle } from 'react';

import { Space, Input, notification } from 'antd'

import './PackageExplorer.scss';

import PackageCard from './PackageCard';

import type { SearchProps } from 'antd/es/input/Search';

import { PackageExplorerProps, PackageProps, PackageToInstallProps } from '../helpers/types';

import Dataservice from '../api/Dataservice';

import { dummyPackages } from '../helpers/constants';

const { Search } = Input;

const PackageExplorer: React.FC<PackageExplorerProps> = forwardRef((props: PackageExplorerProps, ref) => {
    const [searchResults, setSearchResults] = useState<PackageProps[]>([]);

    const [searchResultsLoading, setSearchResultsLoading] = useState(false);

    const [searchClicked, setSearchClicked] = useState(false);

    const [listOfPackagesToInstall, setListOfPackagesToInstall] = useState<PackageToInstallProps[]>([])

    const [emptyPackageList, setEmptyPackageList] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const [api, contextHolder] = notification.useNotification();

    type NotificationType = 'success' | 'info' | 'warning' | 'error';

    function notify(message: string, description: string, type: NotificationType) {
        return api[type]({
            message,
            description
        });
    }

    async function callAndSetSearchResults(q: string) {
        const result = await Dataservice.searchPackages(q);

        setEmptyPackageList(result.length === 0);

        setSearchResults(result);
    }

    const onSearch: SearchProps['onSearch'] = async (value) => {
        setSearchQuery(value);
        setSearchClicked(true);
        setSearchResultsLoading(true);

        await callAndSetSearchResults(value);

        setSearchResultsLoading(false);
    };

    function modifyListOfPackagesToInstall(packageName: string, selectedVersionToInstall?: string, isDevPackage?: boolean) {
        let clonedList = Array.from(listOfPackagesToInstall);

        if (selectedVersionToInstall) {
            const alreadyExistsIndex = clonedList.findIndex(pkg => pkg.name === packageName);
            if (alreadyExistsIndex >= 0) {
                // updation
                clonedList[alreadyExistsIndex] = {
                    name: packageName,
                    version_to_install: selectedVersionToInstall,
                    is_dev: isDevPackage
                };
            } else {
                // addition
                clonedList.push({
                    name: packageName,
                    version_to_install: selectedVersionToInstall,
                    is_dev: isDevPackage
                });
            }
        } else {
            // removal
            clonedList = clonedList.filter(pkg => pkg.name !== packageName);
        }

        return setListOfPackagesToInstall(clonedList);
    }

    const onSaveClickHandler = async () => {
        await Promise.all(listOfPackagesToInstall.map(
            pkg => Dataservice.installPackage(pkg.name, pkg.version_to_install || '', pkg.is_dev || false))
        );

        notify('Installed Packages', 'Successfully installed list of packages', 'success');
        setListOfPackagesToInstall([]);
        await callAndSetSearchResults(searchQuery);
        props.setIsPackagesSaveLoading(false);
    };

    const onRevertClickHandler = () => {
        setListOfPackagesToInstall([]);
    };

    const onCancelClickHandler = () => {
        // reset search query, search results and list of packages to install
        setSearchQuery('');
        setListOfPackagesToInstall([]);
        setSearchResults([]);
        setSearchResultsLoading(false);
        setSearchClicked(false);
        props.reRenderPackages();
    };

    useImperativeHandle(ref, () => ({
        onSaveClickHandler,
        onRevertClickHandler,
        onCancelClickHandler
    }));

    return (
        <div className="package-explorer-container">
            {contextHolder}
            <Space direction="vertical">
                <Search placeholder="Search your package..."
                    disabled={listOfPackagesToInstall.length > 0} onChange={e => setSearchQuery(e.target.value)}
                    onSearch={onSearch} allowClear enterButton style={{ width: 950 }} />
            </Space>
            <div className="search-results-container">
                {
                    searchClicked ?
                        (searchResultsLoading && !emptyPackageList ? dummyPackages : searchResults).map(searchResult => (
                            <PackageCard
                                reRenderPackages={() => { }}
                                loading={searchResultsLoading}
                                key={searchResult.name}
                                package={searchResult}
                                installed={false}
                                versions={searchResult.versions}
                                isPackageSelectedToInstall={listOfPackagesToInstall.map(({ name }) => name).includes(searchResult.name)}
                                modifyListOfPackagesToInstall={modifyListOfPackagesToInstall}
                            />
                        )) : <div className="explore-more-message">
                            Explore more packages that best fits your project!
                        </div>
                }
                {
                    searchClicked && !searchResultsLoading && emptyPackageList &&
                    <div className="explore-more-message">
                        No results found! Check your search query
                    </div>
                }
            </div>
        </div>
    )
});

export default PackageExplorer;

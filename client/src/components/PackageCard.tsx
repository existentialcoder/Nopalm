import { Card, Switch, Avatar, Button, Select, Tag, Tooltip, Popconfirm, notification, theme as antdTheme } from 'antd';

import { UploadOutlined, DeleteFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons';

import './PackageCard.scss';

import React, { useState } from "react";

import { compare } from 'compare-versions';

import { PackageCardProps } from '../helpers/types';

import Dataservice from '../api/Dataservice';

const { Meta } = Card;

const PackageCard: React.FC<PackageCardProps> = (props: PackageCardProps) => {
    type NotificationType = 'success' | 'info' | 'warning' | 'error';

    const { token: theme } = antdTheme.useToken();

    const [api, contextHolder] = notification.useNotification();

    const [isDevPackage, setIsDevPackage] = useState(props.package.is_dev);

    const [isDevDepToggleLoading, setIsDevDepToggleLoading] = useState(false);

    const [packageDescription,] = useState(`${props.package.description.slice(0, 75)}${props.package.description.length >= 75 ? '...' : ''}`);

    const [selectedVersionToInstall, setSelectedVersionToInstall] = useState(props.package.versions[0]);

    function notify(message: string, description: string, type: NotificationType) {
        return api[type]({
            message,
            description
        });
    }

    async function devDependencyHandler(checked: boolean) {
        setIsDevPackage(checked);
        if (props.installed) {
            setIsDevDepToggleLoading(true);
            try {
                await Dataservice.updatePackage(props.package.name, props.package.installed_version, checked);

                setIsDevDepToggleLoading(false);

                props.reRenderPackages();

                return notify('Updated the package', `Successfully updated the package as ${checked ? 'dev' : 'normal'} dependency`, 'success');
            } catch (ex) {
                const msg = `Error updating the package ${props.package.name}`;

                console.error(msg, ex);

                return notify('Updating Package', msg, 'error');
            }
        }

        // update the existing package - dep type
        props.modifyListOfPackagesToInstall(props.package.name, selectedVersionToInstall, isDevPackage)
    }

    async function uninstallPackage(packageName: string) {
        try {
            await Dataservice.uninstallPackage(packageName);

            props.reRenderPackages();

            return notify('Uninstalled Package', `Successfully uninstalled package ${packageName}`, 'success');
        } catch (ex) {
            const msg = `Error uninstalling package ${packageName}`;

            console.error(msg, ex);

            return notify('Uninstalling Package', msg, 'error');
        }
    }

    async function updatePackage(packageName: string, version: string) {
        try {
            await Dataservice.updatePackage(packageName, version, undefined);

            props.reRenderPackages();

            return notify('Updgraded the package', `Successfully upgraded package ${packageName}`, 'success');
        } catch (ex) {
            const msg = `Error upgrading package ${packageName} to the latest version`;

            console.error(msg, ex);

            return notify('Upgrading the package', msg, 'error');
        }
    }

    return (
        <Card bordered={true} style={{
            boxSizing: 'border-box',
            marginTop: '16px',
            height: '100px',
        }} loading={props.loading}>
            {contextHolder}
            <div className="card-main-container">
                <Meta
                    style={{ width: '90' }}
                    avatar={<Avatar src={props.package.logo} />}
                    title={
                        <a href={props.package.homepage} className="package-link"
                            target='_blank' style={{ color: theme.colorText, textDecorationColor: theme.colorPrimary }}>
                            {`${props.package.name} ${props.installed ? ` (${props.package.installed_version})` : ''}`}
                        </a>
                    }
                    description={
                        <div title={props.package.description}>
                            {packageDescription}
                        </div>
                    }
                />
                {
                    props.installed && (compare(props.package.installed_version || '', props.package.latest_version, '=') ? ""
                        : <Tag className="upgradable-tag" color={props.accentColor}>
                            Latest : {props.package.latest_version}
                        </Tag>)
                }
                <div className={`card-actions-container ${props.installed ? 'installed' : ''}`}>
                    <div className="toggle-select-buttons">
                        {
                            !props.installed && (
                                <Select disabled={!props.isPackageSelectedToInstall} placeholder='Version' defaultValue={{
                                    value: props.package.versions[0],
                                    label: props.package.versions[0]
                                }}
                                    onChange={(val) => {
                                        setSelectedVersionToInstall(val);
                                        props.modifyListOfPackagesToInstall(props.package.name, val, isDevPackage)
                                    }}
                                    style={{ textAlign: 'center', minWidth: 80, maxWidth: 80, marginRight: '10px' }}
                                    options={props.package.versions.map(ver => ({ value: ver, label: ver }))}
                                />
                            )
                        }
                        <div className="dev-dependency">
                            <Tooltip title={isDevPackage ? 'Toggle off to make it a regular dependency' : 'Toggle to make it a development dependency'}>
                                <Switch
                                    disabled={!props.installed && !props.isPackageSelectedToInstall}
                                    checkedChildren="Dev" unCheckedChildren="Dev"
                                    loading={isDevDepToggleLoading}
                                    onChange={devDependencyHandler}
                                    checked={isDevPackage} ></Switch>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="action-buttons">
                        {
                            props.installed && (compare(props.package.installed_version || '', props.package.latest_version, '=') ? ""
                                : <React.Fragment>
                                    <Popconfirm title="Upgrade the package"
                                        description='Are you sure to upgrade the package to latest version ?'
                                        onConfirm={() => updatePackage(props.package.name, props.package.latest_version)}
                                        okText="Yes"
                                        cancelText="No">
                                        <Button type="text" style={{ marginTop: '15px' }} size="middle" icon={<UploadOutlined />}>
                                        </Button>
                                    </Popconfirm>
                                </React.Fragment>)
                        }
                        {props.installed ? <Popconfirm title="Uninstall package"
                            description="Are you sure to uninstall the package ?"
                            onConfirm={() => uninstallPackage(props.package.name)}
                            okText="Yes"
                            cancelText="No">
                            <Button type="text" danger={true} style={{ marginTop: '15px' }} size="middle" icon={<DeleteFilled />}>
                            </Button>
                        </Popconfirm> :
                            <React.Fragment>
                                <Button
                                    onClick={() => props.modifyListOfPackagesToInstall(props.package.name, selectedVersionToInstall, isDevPackage)}
                                    type='primary' disabled={props.isPackageSelectedToInstall} shape='circle' style={{ marginTop: '5px' }} icon={<PlusOutlined />} />
                                {
                                    props.isPackageSelectedToInstall && <Button
                                        onClick={() => props.modifyListOfPackagesToInstall(props.package.name)}
                                        type='primary' shape='circle' style={{ marginLeft: '5px', marginTop: '5px' }} icon={<MinusOutlined />} danger />
                                }
                            </React.Fragment>
                        }
                    </div>
                </div>
            </div>
        </Card>
    )
};

export default PackageCard;

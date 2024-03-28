import React from "react";

export enum PackageManagers {
    yarn = 'yarn',
    npm = 'npm'
}

export enum AppearanceModes {
    light = 'light',
    dark = 'dark',
    system = 'system'
}

export enum LogLevels {
    info = 'info',
    debug = 'debug',
    error = 'error',
    warn = 'warn'
}

export enum AccentColors {
    red = 'red',
    volcano = 'volcano',
    orange = 'orange',
    gold = 'gold',
    yellow = 'yellow',
    lime = 'lime',
    green = 'green',
    cyan = 'cyan',
    blue = 'blue',
    purple = 'purple',
    magenta = 'magenta',
    geekblue = 'geekblue'
}

export interface SettingsResultProps {
    appearance: {
        mode: AppearanceModes,
        accent_color: AccentColors | string
    },
    preferences: {
        package_manager: PackageManagers,
        log_level: LogLevels
    }
}
export interface AppProps {
    settings: SettingsResultProps,
    reflectUpdatedUserSettings: () => void
}

export type Option = {
    value: string,
    label: string,
    questions?: QuestionObject[]
};

export type QuestionObject = {
    question: string,
    question_name: string,
    logo_name?: string,
    options: Option[]
};

export interface QuestionProps {
    questionObj: QuestionObject;
    answerHandler: (value: string, options: Option[], questionName: string) => void;
}

export interface PackageProps {
    name: string,
    latest_version: string,
    description: string,
    homepage: string,
    logo: string,
    versions: string[]
}

export interface InstalledPackageProps extends PackageProps {
    installed_version?: string,
    is_dev?: boolean
}

interface PackageExplorerPropsInterface {
    projectName: string,
    projectDescription: string,
    reRenderPackages: () => void,
    setIsPackagesSaveLoading: () => void
}

export interface PackageExplorerRef {
    onSaveClickHandler: () => void,
    onRevertClickHandler: () => void,
    onCancelClickHandler: () => void
}

export type PackageExplorerProps = PackageExplorerPropsInterface & React.RefAttributes<PackageExplorerRef>

export interface PackageCardProps {
    loading: boolean,
    reRenderPackages: () => void,
    package: InstalledPackageProps,
    installed: boolean,
    versions: string[],
    accentColor: AccentColors,
    isPackageSelectedToInstall?: boolean,
    modifyListOfPackagesToInstall: () => void,
}

export interface ProjectDetailsProps {
    name: string,
    description: string
}

export interface PackageToInstallProps {
    name: string,
    version_to_install?: string,
    is_dev?: boolean
}

export interface AccentColorPickerProps {
    selectedAccentColor: string,
    onColorChange: (accentColor: string) => void
}

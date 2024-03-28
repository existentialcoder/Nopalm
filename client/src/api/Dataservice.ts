const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

import { InstalledPackageProps, ProjectDetailsProps, SettingsResultProps } from '../helpers/types';

async function getProjectDetails(): Promise<ProjectDetailsProps> {
    const urlPath = 'project';

    const result = await fetch(`${API_BASE_URL}/${urlPath}`);

    const { project } = await result.json();

    return project;
}

async function getInstalledPackages(): Promise<InstalledPackageProps[]> {
    const urlPath = 'packages/installed';

    const result = await fetch(`${API_BASE_URL}/${urlPath}`);

    const { packages } = await result.json();

    return packages;
}

async function searchPackages(q: string) {
    const urlPath = 'packages/search';

    const result = await fetch(`${API_BASE_URL}/${urlPath}?q=${q}`);

    const { packages } = await result.json();

    return packages;
}

async function installPackage(packageName: string, versionToInstall: string, isDev: boolean) {
    const urlPath = 'packages/install';

    const result = await fetch(`${API_BASE_URL}/${urlPath}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            package: {
                name: packageName,
                version: versionToInstall,
                is_dev: isDev
            }
        })
    });

    if (result.ok === false) {
        throw result.json();
    }

    return result;
}

async function updatePackage(packageName: string, versionToUpdate: string | undefined, isDev: boolean | undefined) {
    const urlPath = 'packages/upgrade';

    const packageDetailsToUpdate: {
        name: string,
        version?: string,
        latest?: boolean,
        isDev?: boolean
    } = {
        name: packageName
    };

    if (versionToUpdate && versionToUpdate.length > 0) {
        packageDetailsToUpdate.version = versionToUpdate;
        packageDetailsToUpdate.latest = !!packageDetailsToUpdate.latest
    }

    if (isDev !== undefined) {
        packageDetailsToUpdate.isDev = isDev;
    }

    const result = await fetch(`${API_BASE_URL}/${urlPath}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            package: packageDetailsToUpdate
        })
    });

    if (result.ok === false) {
        throw result.json();
    }

    return result;
}

async function uninstallPackage(packageName: string) {
    const urlPath = 'packages/uninstall';

    const result = await fetch(`${API_BASE_URL}/${urlPath}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            package: { name: packageName }
        })
    });

    if (result.ok === false) {
        throw result.json();
    }

    return result;
}

async function getSettings(scope: 'global' | 'local'): Promise<SettingsResultProps> {
    const urlPath = 'settings';

    const result = await fetch(`${API_BASE_URL}/${urlPath}?scope=${scope}`);

    const { settings } = await result.json();

    return settings;
}

async function updateSettings(scope: 'global' | 'local', settingsToUpdate: SettingsResultProps) {
    const urlPath = 'settings';

    const result = await fetch(`${API_BASE_URL}/${urlPath}?scope=${scope}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsToUpdate)
    });

    if (result.ok === false) {
        throw result.json();
    }

    return result;
}

const Dataservice = {
    getProjectDetails,
    getInstalledPackages,
    searchPackages,
    installPackage,
    updatePackage,
    uninstallPackage,
    getSettings,
    updateSettings
};

export default Dataservice;

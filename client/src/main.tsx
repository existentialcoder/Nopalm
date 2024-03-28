import React, { useState, useEffect } from 'react';

import { BrowserRouter } from 'react-router-dom';

import * as colors from '@ant-design/colors';

import App from './App.tsx';

import './index.scss';

import { ConfigProvider, ThemeConfig, Skeleton, theme } from 'antd';

import Dataservice from './api/Dataservice.ts';

const { defaultAlgorithm, darkAlgorithm, getDesignToken } = theme;

const Main: React.FC = () => {
  console.log(import.meta.env.REACT_APP_API_BASE_URL)
  const [globalSettings, setGlobalSettings] = useState('');

  const [isDark, setIsDark] = useState<boolean>(false);

  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState<string>('');

  const [isMainLoading, setIsMainLoading] = useState<boolean>(false);

  const DarkTheme: ThemeConfig = {
    algorithm: darkAlgorithm,
    token: {
      // add here custom colors
    }
  };
  const LightTheme: ThemeConfig = {
    algorithm: defaultAlgorithm,
    token: {
      // add here custom colors
    }
  };

  const DarkToken = getDesignToken(DarkTheme);

  const LightToken = getDesignToken(LightTheme);

  const [tokenSelected, setTokenSelected] = useState(LightToken);

  const fetchGlobalSettings = async () => {
    setIsMainLoading(true);

    const settings = await Dataservice.getSettings('global');

    setGlobalSettings(settings);

    const darkModeEnabled =
      (settings.appearance.mode === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
      settings.appearance.mode === 'dark';

    setIsDark(darkModeEnabled);

    const primaryColor = colors[settings.appearance.accent_color]?.primary || '';

    setSelectedPrimaryColor(primaryColor);

    setTokenSelected(isDark ? DarkToken : LightToken);

    setIsMainLoading(false);
  };

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <ConfigProvider theme={{
          algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
          components: {
            Layout: {
              siderBg: selectedPrimaryColor,
              triggerBg: selectedPrimaryColor
            }
          },
          token: {
            colorPrimary: selectedPrimaryColor
          }
        }}>
          <div style={{
            color: tokenSelected.colorText,
            background: tokenSelected.colorBgBase
          }}>
            <Skeleton loading={isMainLoading}>
              <App settings={globalSettings} reflectUpdatedUserSettings={fetchGlobalSettings} />
            </Skeleton>
          </div>
        </ConfigProvider>
      </BrowserRouter>
    </React.StrictMode >
  )
};

export default Main;

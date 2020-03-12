import * as React from 'react';
import createPersistedState from 'use-persisted-state';

type OwnProps = {
  duration?: number;
  auto?: boolean;
  children?: any;
};

export function useClearCache(props: OwnProps = {}) {
  const { duration = 60 * 1000, auto = false } = props;

  const [loading, setLoading] = React.useState(true);
  const [isLatestVersion, setIsLatestVersion] = React.useState(true);
  const useAppVersionState = createPersistedState('appVersion');
  const [appVersion, setAppVersion] = useAppVersionState('');
  const [latestVersion, setLatestVersion] = React.useState(appVersion);

  async function setVersion(version: string) {
    await setAppVersion(version);
  }

  const emptyCacheStorage = async (version: string) => {
    console.log('Clearing cache and hard reloading...');
    if ('caches' in window) {
      // Service worker cache should be cleared with caches.delete()
      caches.keys().then(names => {
        // eslint-disable-next-line no-restricted-syntax
        for (const name of names) caches.delete(name);
      });
    }

    // clear browser cache and reload page
    await setVersion(version || latestVersion).then(() =>
      window.location.reload(true)
    );
  };

  function fetchMeta() {
    fetch(`/clear-cache`, {
      method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', },
    })
      .then(response => response.json())
      .then(meta => {
        const newVersion = meta.version;
        const currentVersion = appVersion;
        const isUpdated = newVersion === currentVersion;
        if (!isUpdated && !auto) {
          console.log('An update is available!');
          setLatestVersion(newVersion);
          setLoading(false);
          setIsLatestVersion(false);
        } else if (!isUpdated && auto) {
          emptyCacheStorage(newVersion);
        } else {
          setIsLatestVersion(true);
          setLoading(false);
        }
      });
  }

  React.useEffect(() => {
    const fetchCacheTimeout = setInterval(() => fetchMeta(), duration);
    return () => {
      clearInterval(fetchCacheTimeout);
    };
  }, [loading]);

  React.useEffect(() => {
    fetchMeta();
  }, []);

  return {
    loading, isLatestVersion, emptyCacheStorage, latestVersion
  }
}

const ClearCache: React.FC<OwnProps > = props => {
  const {loading, isLatestVersion, emptyCacheStorage} = useClearCache(props);

  const { children } = props;

  return children({
    loading,
    isLatestVersion,
    emptyCacheStorage
  });
};

export default ClearCache;

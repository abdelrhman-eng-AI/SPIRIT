import React, { createContext, useContext } from 'react';

const FailedAssetsContext = createContext<Set<string>>(new Set());

export const FailedAssetsProvider: React.FC<{
  failedUrls: string[];
  children: React.ReactNode;
}> = ({ failedUrls, children }) => {
  const value = React.useMemo(() => new Set(failedUrls), [failedUrls]);
  return (
    <FailedAssetsContext.Provider value={value}>
      {children}
    </FailedAssetsContext.Provider>
  );
};

export function useIsAssetFailed(url: string): boolean {
  const failedSet = useContext(FailedAssetsContext);
  return failedSet.has(url.trim());
}

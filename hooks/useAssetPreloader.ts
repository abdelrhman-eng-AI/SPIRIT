import { useEffect, useMemo, useState } from 'react';

export interface CriticalAsset {
  id: string;
  url: string;
  label?: string;
}

export interface AssetPreloadState {
  total: number;
  loadedCount: number;
  failedCount: number;
  settledCount: number;
  progress: number;
  isReady: boolean;
  hasFailures: boolean;
  failedAssetIds: string[];
  failedUrls: string[];
  activeLabel: string;
}

interface UseAssetPreloaderOptions {
  /** Safety timeout (ms) per asset so a stalled socket cannot hang the loader indefinitely. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 8000;

export function useAssetPreloader(
  assets: CriticalAsset[],
  options: UseAssetPreloaderOptions = {}
): AssetPreloadState {
  const { timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  // Deduplicate by URL so identical static URLs never trigger duplicate network requests
  const uniqueAssets = useMemo(() => {
    const seen = new Set<string>();
    const result: CriticalAsset[] = [];
    for (const asset of assets) {
      const normalized = asset.url.trim();
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      result.push({ ...asset, url: normalized });
    }
    return result;
  }, [assets]);

  const total = uniqueAssets.length;
  const assetKey = useMemo(
    () => uniqueAssets.map((a) => `${a.id}:${a.url}`).join('|'),
    [uniqueAssets]
  );

  const [state, setState] = useState<AssetPreloadState>(() => ({
    total,
    loadedCount: 0,
    failedCount: 0,
    settledCount: 0,
    progress: total === 0 ? 100 : 0,
    isReady: total === 0,
    hasFailures: false,
    failedAssetIds: [],
    failedUrls: [],
    activeLabel: uniqueAssets[0]?.label || 'Initializing Space Systems',
  }));

  useEffect(() => {
    if (total === 0) {
      setState({
        total: 0,
        loadedCount: 0,
        failedCount: 0,
        settledCount: 0,
        progress: 100,
        isReady: true,
        hasFailures: false,
        failedAssetIds: [],
        failedUrls: [],
        activeLabel: 'Ready',
      });
      return;
    }

    let isCancelled = false;
    let loaded = 0;
    let failed = 0;
    const failedIds: string[] = [];
    const failedUrlList: string[] = [];
    const settledIds = new Set<string>();
    const cleanups: Array<() => void> = [];

    setState({
      total,
      loadedCount: 0,
      failedCount: 0,
      settledCount: 0,
      progress: 0,
      isReady: false,
      hasFailures: false,
      failedAssetIds: [],
      failedUrls: [],
      activeLabel: uniqueAssets[0]?.label || 'Loading Critical Observatory Assets',
    });

    const settleAsset = (asset: CriticalAsset, didLoad: boolean) => {
      if (isCancelled || settledIds.has(asset.id)) return;
      settledIds.add(asset.id);

      if (didLoad) {
        loaded += 1;
      } else {
        failed += 1;
        failedIds.push(asset.id);
        failedUrlList.push(asset.url);
      }

      const settledCount = loaded + failed;
      const progress = Math.round((settledCount / total) * 100);
      const isReady = settledCount >= total;
      const nextPending = uniqueAssets.find((a) => !settledIds.has(a.id));

      setState({
        total,
        loadedCount: loaded,
        failedCount: failed,
        settledCount,
        progress,
        isReady,
        hasFailures: failed > 0,
        failedAssetIds: [...failedIds],
        failedUrls: [...failedUrlList],
        activeLabel: isReady
          ? failed > 0
            ? 'Entering Observatory (Fallback Ready)'
            : 'Observatory Ready'
          : nextPending?.label || 'Preparing Telemetry',
      });
    };

    uniqueAssets.forEach((asset) => {
      const img = new Image();
      let timerId: number | null = null;
      let finished = false;

      const cleanupListeners = () => {
        img.onload = null;
        img.onerror = null;
        if (timerId !== null) {
          window.clearTimeout(timerId);
          timerId = null;
        }
      };

      const finish = (didLoad: boolean) => {
        if (finished) return;
        finished = true;
        cleanupListeners();
        settleAsset(asset, didLoad);
      };

      img.decoding = 'async';

      img.onload = () => {
        if (typeof img.decode === 'function') {
          img
            .decode()
            .catch(() => {
              // Some browsers reject decode() on valid cached/progressive images; still treat load as settled
            })
            .finally(() => finish(true));
        } else {
          finish(true);
        }
      };

      img.onerror = () => {
        finish(false);
      };

      timerId = window.setTimeout(() => {
        finish(false);
      }, timeoutMs);

      img.src = asset.url;

      // Handle already-cached synchronous completion if onload didn't queue
      if (img.complete && img.naturalWidth > 0) {
        finish(true);
      }

      cleanups.push(cleanupListeners);
    });

    return () => {
      isCancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [assetKey, total, timeoutMs, uniqueAssets]);

  return state;
}

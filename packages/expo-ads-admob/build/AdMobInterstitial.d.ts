declare type EventNameType = 'interstitialDidLoad' | 'interstitialDidFailToLoad' | 'interstitialDidOpen' | 'interstitialDidClose' | 'interstitialWillLeaveApplication';
declare type EventListener = (...args: any[]) => void;
declare const _default: {
    setAdUnitID(id: string): Promise<void>;
    requestAdAsync(options?: {
        servePersonalizedAds?: boolean;
        additionalRequestParams?: Record<string, string>;
    }): Promise<void>;
    showAdAsync(): Promise<void>;
    dismissAdAsync(): Promise<void>;
    getIsReadyAsync(): Promise<boolean>;
    addEventListener(type: EventNameType, handler: EventListener): void;
    removeEventListener(type: EventNameType, handler: EventListener): void;
    removeAllListeners(): void;
};
export default _default;
//# sourceMappingURL=AdMobInterstitial.d.ts.map
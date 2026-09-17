export type AffiliateNetworkType =
  | 'DIRECT'
  | 'AMAZON_ASSOCIATES'
  | 'IMPACT_RADIUS'
  | 'CJ_AFFILIATE'
  | 'RAKUTEN'
  | 'AWIN'
  | 'CUSTOM';

export interface AffiliateNetworkConfig {
  network: AffiliateNetworkType;
  partnerId?: string;
  urlTemplate?: string;
  subIdParam?: string;
  campaignParam?: string;
}

/**
 * Generates a unique, URL-safe click tracking identifier.
 */
export function generateClickId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `c_${timestamp}_${random}`;
}

/**
 * Builds an attribution-ready destination URL without hardcoding or inventing fake credentials.
 * Preserves retailer destination parameters while securely injecting click attribution sub-IDs.
 */
export function buildAffiliateUrl({
  productUrl,
  affiliateUrl,
  clickId,
  campaignId,
  config,
}: {
  productUrl: string;
  affiliateUrl?: string | null;
  clickId: string;
  campaignId?: string;
  config?: AffiliateNetworkConfig;
}): { destinationUrl: string; isDecorated: boolean } {
  const baseTarget = affiliateUrl?.trim() || productUrl.trim();

  let targetUrl: URL;
  try {
    targetUrl = new URL(baseTarget);
  } catch {
    return { destinationUrl: baseTarget, isDecorated: false };
  }

  // Enforce secure HTTPS destination
  if (targetUrl.protocol !== 'https:') {
    return { destinationUrl: baseTarget, isDecorated: false };
  }

  const network = config?.network || 'DIRECT';

  switch (network) {
    case 'AMAZON_ASSOCIATES': {
      // Amazon uses tag parameter and optional subtag
      if (config?.partnerId) {
        targetUrl.searchParams.set('tag', config.partnerId);
      }
      targetUrl.searchParams.set('ascsubtag', clickId);
      return { destinationUrl: targetUrl.toString(), isDecorated: true };
    }

    case 'IMPACT_RADIUS': {
      // Impact uses subId1 for click/session and subId2 for campaign
      targetUrl.searchParams.set('subId1', clickId);
      if (campaignId) targetUrl.searchParams.set('subId2', campaignId);
      return { destinationUrl: targetUrl.toString(), isDecorated: true };
    }

    case 'CJ_AFFILIATE': {
      // CJ uses sid parameter
      targetUrl.searchParams.set('sid', clickId);
      return { destinationUrl: targetUrl.toString(), isDecorated: true };
    }

    case 'RAKUTEN': {
      // Rakuten uses u1 for subId
      targetUrl.searchParams.set('u1', clickId);
      return { destinationUrl: targetUrl.toString(), isDecorated: true };
    }

    case 'AWIN': {
      // Awin uses clickref
      targetUrl.searchParams.set('clickref', clickId);
      if (campaignId) targetUrl.searchParams.set('clickref2', campaignId);
      return { destinationUrl: targetUrl.toString(), isDecorated: true };
    }

    case 'CUSTOM': {
      const subParam = config?.subIdParam || 'subid';
      targetUrl.searchParams.set(subParam, clickId);
      if (campaignId && config?.campaignParam) {
        targetUrl.searchParams.set(config.campaignParam, campaignId);
      }
      return { destinationUrl: targetUrl.toString(), isDecorated: true };
    }

    case 'DIRECT':
    default: {
      // For direct merchant links, attach internal tracking reference if safe
      targetUrl.searchParams.set('ctp_click', clickId);
      if (campaignId) targetUrl.searchParams.set('ctp_campaign', campaignId);
      return { destinationUrl: targetUrl.toString(), isDecorated: true };
    }
  }
}

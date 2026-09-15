update public.source_rights
set notes = 'Technical Products API connector prepared only. Best Buy Developer terms require source attribution/branding and include restrictions relevant to multi-retailer comparison/third-party pricing analysis. Do not activate for CatchThePrice production comparison until Best Buy/affiliate/partner permission for this use case is confirmed and recorded.',
    retention_notes = 'API access/key alone is not treated as permission to republish, retain history, compare against other retailers, or use images beyond the permitted terms. Confirm allowed retention and comparison use before enabling those rights.',
    updated_at = now()
where id = 'bestbuy-us';

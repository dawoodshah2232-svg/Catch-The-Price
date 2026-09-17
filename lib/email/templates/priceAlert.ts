export interface PriceAlertEmailProps {
  productTitle: string;
  productImageUrl?: string | null;
  productUrl: string;
  targetPrice: string;
  currentPrice: string;
  merchantName?: string;
  dropPercentage?: number;
  market: 'ae' | 'us';
}

export function renderPriceAlertEmail(props: PriceAlertEmailProps): { subject: string; html: string; text: string } {
  const subject = `🎯 Target Reached: ${props.productTitle} is now ${props.currentPrice}!`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f7f5; margin: 0; padding: 24px; color: #0c1913; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #d6e3dd; overflow: hidden; }
    .header { background: #081510; padding: 24px 32px; text-align: center; }
    .header img { height: 36px; }
    .content { padding: 32px; }
    .badge { display: inline-block; background: #e6f9f0; color: #00A859; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px; text-transform: uppercase; }
    .title { font-size: 20px; font-weight: 800; margin: 12px 0 6px 0; color: #0c1913; line-height: 1.3; }
    .price-box { background: #f8faf9; border: 1px solid #e0ebe5; border-radius: 16px; padding: 20px; margin: 24px 0; display: flex; justify-content: space-between; }
    .price-item { text-align: left; }
    .price-label { font-size: 11px; color: #71867c; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
    .price-val { font-size: 22px; font-weight: 900; color: #0c1913; }
    .price-val.target { color: #00A859; }
    .btn { display: block; text-align: center; background: #00C16A; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 14px; font-weight: 800; font-size: 14px; margin-top: 24px; }
    .footer { text-align: center; font-size: 11px; color: #8aa095; padding: 20px; border-top: 1px solid #edf4f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: -0.5px;">CatchThe<span style="color: #00D27A;">Price</span></span>
    </div>
    <div class="content">
      <span class="badge">Price Drop Detected</span>
      <h1 class="title">${props.productTitle}</h1>
      <p style="font-size: 13px; color: #5c7268; margin-top: 4px;">
        Great news! The product you are tracking just hit your target price${props.merchantName ? ` at <strong>${props.merchantName}</strong>` : ''}.
      </p>

      <div class="price-box">
        <div class="price-item">
          <div class="price-label">Current Best Price</div>
          <div class="price-val target">${props.currentPrice}</div>
        </div>
        <div class="price-item" style="text-align: right;">
          <div class="price-label">Your Target Price</div>
          <div class="price-val">${props.targetPrice}</div>
        </div>
      </div>

      <a href="${props.productUrl}" class="btn">View Deal & Compare Retailers &rarr;</a>
    </div>
    <div class="footer">
      You are receiving this alert because you requested price notifications for this item on CatchThePrice.<br>
      To manage your alerts, visit your <a href="https://catchtheprice.com/${props.market}/account/alerts" style="color: #00A859;">account settings</a>.
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `CatchThePrice Alert: ${props.productTitle} is now ${props.currentPrice} (Target: ${props.targetPrice}). View deal at: ${props.productUrl}`;

  return { subject, html, text };
}

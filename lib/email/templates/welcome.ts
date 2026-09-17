export interface WelcomeEmailProps {
  userName: string;
  market: 'ae' | 'us';
}

export function renderWelcomeEmail(props: WelcomeEmailProps): { subject: string; html: string; text: string } {
  const subject = `Welcome to CatchThePrice — Smarter Shopping & Price Tracking`;

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
    .content { padding: 32px; }
    .title { font-size: 22px; font-weight: 900; margin: 0 0 12px 0; color: #0c1913; }
    .text { font-size: 14px; color: #42584e; line-height: 1.6; margin-bottom: 16px; }
    .feature-list { background: #f8faf9; border-radius: 16px; padding: 20px; margin: 20px 0; list-style: none; }
    .feature-item { font-size: 13px; font-weight: 700; color: #0c1913; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
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
      <h1 class="title">Welcome, ${props.userName}!</h1>
      <p class="text">
        You are now ready to track prices, discover real deals, and compare major retailer listings without ever overpaying.
      </p>

      <div class="feature-list">
        <div class="feature-item">🎯 Set Target Price Drop Alerts on any product</div>
        <div class="feature-item">📊 View Verified Price Movement History</div>
        <div class="feature-item">⚖️ Compare Retailers side-by-side</div>
        <div class="feature-item">💎 Spot genuinely scored deals, not fake discounts</div>
      </div>

      <a href="https://catchtheprice.com/${props.market}" class="btn">Start Exploring Deals &rarr;</a>
    </div>
    <div class="footer">
      CatchThePrice — TRACK IT. CATCH THE DROP. PAY LESS.<br>
      © 2026 CatchThePrice. All rights reserved.
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `Welcome to CatchThePrice, ${props.userName}! Start tracking prices and discovering deals at https://catchtheprice.com/${props.market}`;
  return { subject, html, text };
}

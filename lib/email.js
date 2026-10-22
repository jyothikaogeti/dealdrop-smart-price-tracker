import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPriceDropAlert(
  userEmail,
  product,
  oldPrice,
  newPrice,
) {
  try {
    const priceDrop = oldPrice - newPrice;
    const percentageDrop = ((priceDrop / oldPrice) * 100).toFixed(1);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: userEmail,
      subject: `🎉 Price Drop Alert: ${product.name}`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>Price Drop Alert</title>
      </head>

      <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#171717;">

        <!-- Preheader -->
        <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
          ${product.name} just dropped in price. You could save ${product.currency} ${priceDrop.toFixed(2)}.
        </div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; background:#f5f5f5;">
          <tr>
            <td align="center" style="padding:40px 16px;">

              <!-- Main Container -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%;">

                <!-- Card -->
                <tr>
                  <td style="background:#ffffff; border:1px solid #e5e5e5; border-radius:16px; overflow:hidden;">

                    <!-- Orange Header -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td
                          align="center"
                          style="padding:30px 30px 28px; background:#f97316; border-radius:16px 16px 0 0;"
                        >

                          <div style="font-size:30px; line-height:36px; margin-bottom:8px;">
                            🎉
                          </div>

                          <div
                            style="font-size:26px; line-height:34px; font-weight:700; letter-spacing:-0.5px; color:#ffffff;"
                          >
                            Price Drop Alert!
                          </div>

                          <div
                            style="font-size:14px; line-height:21px; color:#ffedd5; margin-top:5px;"
                          >
                            Good news — the price of an item you're tracking just dropped.
                          </div>

                        </td>
                      </tr>
                    </table>

                    <!-- Product -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:28px 30px 24px;">

                          ${
                            product.image_url
                              ? `
                                <div style="text-align:center; margin-bottom:24px;">
                                  <img
                                    src="${product.image_url}"
                                    alt="${product.name}"
                                    width="220"
                                    style="display:block; width:220px; max-width:100%; height:auto; max-height:260px; object-fit:contain; margin:0 auto; border-radius:10px;"
                                  >
                                </div>
                              `
                              : ""
                          }

                          <div style="font-size:18px; line-height:25px; font-weight:600; color:#171717;">
                            ${product.name}
                          </div>

                          ${
                            product.store_name
                              ? `
                                <div style="font-size:13px; line-height:20px; color:#737373; margin-top:4px;">
                                  ${product.store_name}
                                </div>
                              `
                              : ""
                          }

                        </td>
                      </tr>
                    </table>

                    <!-- Price Summary -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:0 30px 28px;">

                          <table
                            role="presentation"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="background:#fafafa; border:1px solid #eeeeee; border-radius:12px;"
                          >
                            <tr>

                              <!-- Previous Price -->
                              <td
                                width="50%"
                                style="padding:18px 16px; border-right:1px solid #eeeeee; vertical-align:top;"
                              >
                                <div style="font-size:11px; line-height:16px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#a3a3a3;">
                                  Was
                                </div>

                                <div style="font-size:18px; line-height:26px; color:#737373; text-decoration:line-through; margin-top:5px;">
                                  ${product.currency} ${oldPrice.toFixed(2)}
                                </div>
                              </td>

                              <!-- Current Price -->
                              <td
                                width="50%"
                                style="padding:18px 16px; vertical-align:top;"
                              >
                                <div style="font-size:11px; line-height:16px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#a3a3a3;">
                                  Now
                                </div>

                                <div style="font-size:24px; line-height:30px; font-weight:700; color:#ea580c; margin-top:3px;">
                                  ${product.currency} ${newPrice.toFixed(2)}
                                </div>
                              </td>

                            </tr>
                          </table>

                        </td>
                      </tr>
                    </table>

                    <!-- Savings -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:0 30px 28px;">

                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td
                                style="background:#f0fdf4; border:1px solid #dcfce7; border-radius:10px; padding:14px 16px;"
                              >

                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>

                                    <td style="font-size:13px; line-height:20px; color:#166534;">
                                      You're saving
                                    </td>

                                    <td
                                      align="right"
                                      style="font-size:16px; line-height:20px; font-weight:700; color:#15803d;"
                                    >
                                      ${product.currency} ${priceDrop.toFixed(2)}
                                    </td>

                                  </tr>
                                </table>

                                <div style="font-size:12px; line-height:18px; color:#4d7c0f; margin-top:2px;">
                                  That's ${percentageDrop}% off the previous price.
                                </div>

                              </td>
                            </tr>
                          </table>

                        </td>
                      </tr>
                    </table>

                    <!-- CTA -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding:0 30px 32px;">

                          <a
                            href="${product.url}"
                            style="display:inline-block; background:#171717; color:#ffffff; text-decoration:none; padding:13px 24px; border-radius:8px; font-size:14px; line-height:20px; font-weight:600;"
                          >
                            View Product →
                          </a>

                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:0 30px;">
                          <div style="height:1px; background:#eeeeee; line-height:1px; font-size:1px;">
                            &nbsp;
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Footer -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding:24px 30px 28px;">

                          <div style="font-size:12px; line-height:19px; color:#a3a3a3;">
                            You're receiving this because you're tracking this product on Price Tracker.
                          </div>

                          <div style="margin-top:10px;">
                            <a
                              href="${process.env.NEXT_PUBLIC_APP_URL}"
                              style="font-size:12px; line-height:18px; font-weight:600; color:#ea580c; text-decoration:none;"
                            >
                              Manage Tracked Products
                            </a>
                          </div>

                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Bottom Footer -->
                <tr>
                  <td align="center" style="padding:18px 20px 0;">

                    <div style="font-size:11px; line-height:17px; color:#a3a3a3;">
                      Price Tracker · Automatic price monitoring
                    </div>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        error,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Email error:", error);
    return {
      error: error.message,
    };
  }
}

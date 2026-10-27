export type Quotation = {
  name: string;
  email: string;
  services: string[];
  idea: string;
};
export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
export function quotationMessage(
  quote: Quotation,
  reference: string,
  receivedAt: Date,
) {
  const safe = escapeHtml;
  const date =
    receivedAt.toLocaleString("en-GB", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "UTC",
    }) + " UTC";
  const subject = `New quotation request | ${reference}`;
  const text = `TERVYX Technologies — Code the Future\nNEW QUOTATION REQUEST\nReference: ${reference}\nReceived: ${date}\n\nCLIENT DETAILS\nName: ${quote.name}\nEmail: ${quote.email}\nServices: ${quote.services.join(", ")}\n\nPROJECT REQUIREMENTS\n${quote.idea}\n\nNEXT STEP\nReview the scope and reply directly to ${quote.email} to discuss the project and prepare a tailored quote.\n\nSubmitted through the TERVYX Technologies website. No price has been agreed.\n`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New quotation request</title></head>
<body style="margin:0;padding:0;background:#edf0e9;font-family:Arial,Helvetica,sans-serif;color:#18231b;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">A new project enquiry is ready for review. ${safe(reference)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf0e9;"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #dce3d8;border-radius:16px;overflow:hidden;">
<tr><td style="background:#101413;padding:30px 28px;border-top:5px solid #c8fa73;">
<p style="margin:0;color:#f3f5ee;font-size:28px;font-weight:700;letter-spacing:3px;">TERVYX<span style="color:#c8fa73;">.</span></p>
<p style="margin:6px 0 0;color:#c8fa73;font-size:11px;letter-spacing:3px;">TECHNOLOGIES · CODE THE FUTURE</p></td></tr>
<tr><td style="padding:32px 28px 24px;">
<p style="margin:0 0 12px;color:#527332;font-size:11px;letter-spacing:2px;font-weight:700;">NEW BUSINESS OPPORTUNITY</p>
<h1 style="margin:0 0 12px;font-size:30px;line-height:1.2;letter-spacing:-1px;">A new idea starts here.</h1>
<p style="margin:0;color:#5b675e;font-size:15px;line-height:1.7;">You’ve received a quotation request. Review the project overview below and connect with your prospective client.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;background:#f2f6ed;border-radius:8px;"><tr><td style="padding:16px;font-size:12px;line-height:1.8;color:#53614f;"><strong style="color:#24381d;">${safe(reference)}</strong><br>Received ${safe(date)}</td></tr></table>
<h2 style="margin:28px 0 12px;font-size:18px;">Client details</h2>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;line-height:1.7;table-layout:fixed;">
<tr><td width="76" valign="top" style="padding:10px 0;border-bottom:1px solid #e8ece5;color:#65705e;">Name</td><td style="padding:10px 0;border-bottom:1px solid #e8ece5;font-weight:600;overflow-wrap:anywhere;word-break:break-word;">${safe(quote.name)}</td></tr>
<tr><td valign="top" style="padding:10px 0;border-bottom:1px solid #e8ece5;color:#65705e;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e8ece5;overflow-wrap:anywhere;word-break:break-word;"><a href="mailto:${encodeURIComponent(quote.email)}" style="color:#3d641f;">${safe(quote.email)}</a></td></tr></table>
<h2 style="margin:28px 0 12px;font-size:18px;">Requested services</h2>
<p style="margin:0;line-height:2.4;">${quote.services.map((service) => `<span style="display:inline-block;background:#eaf3df;color:#34551e;border:1px solid #d8e7c8;padding:3px 10px;border-radius:5px;font-size:12px;font-weight:600;margin:0 5px 6px 0;">${safe(service)}</span>`).join("")}</p>
<h2 style="margin:24px 0 12px;font-size:18px;">Project requirements</h2>
<div style="background:#f7f8f5;border-left:3px solid #a6d85c;padding:18px;font-size:14px;line-height:1.8;overflow-wrap:anywhere;word-break:break-word;">${safe(quote.idea).replace(/\n/g, "<br>")}</div>
<table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:28px;"><tr><td bgcolor="#c8fa73" style="border-radius:6px;"><a href="mailto:${encodeURIComponent(quote.email)}?subject=${encodeURIComponent(`Re: Your TERVYX project enquiry — ${reference}`)}" style="display:inline-block;padding:15px 22px;font-size:14px;font-weight:700;color:#14200e;text-decoration:none;">Reply to ${safe(quote.name)} &rarr;</a></td></tr></table>
<p style="margin:16px 0 0;font-size:12px;color:#6b7567;line-height:1.7;">Reply directly to this email to contact the client. Confirm the scope, timeline, and requirements before preparing a tailored quote.</p>
</td></tr><tr><td style="padding:22px 28px;background:#f7f8f5;border-top:1px solid #e8ece5;color:#687361;font-size:11px;line-height:1.8;">
<strong style="color:#34462d;">TERVYX Technologies</strong><br>Website quotation notification · ${safe(reference)}<br>This is an enquiry. No price or project agreement has been confirmed.</td></tr></table>
<p style="margin:16px 0 0;font-size:11px;color:#788270;">Innovation in every line. Possibility in every idea.</p>
</td></tr></table></body></html>`;
  return { subject, text, html };
}

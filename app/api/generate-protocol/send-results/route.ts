import { Resend } from 'resend';

// 🛑 IMPORTANT: You must add RESEND_API_KEY to your Vercel Environment Variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, protocol } = await req.json();

    if (!email || !protocol) {
      return Response.json({ error: 'Missing email or protocol content' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'protocol@curlyhairguide.com',
      to: email,
      subject: 'Your Science-Backed 90-Day Hair Protocol',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto;">
          <h1 style="color: #ec4899;">Your Prescription Protocol</h1>
          <p>Hello,</p>
          <p>We have finished analyzing your unique biology and environmental stressors (including Layton's 352 PPM hard water data). Your science-backed 90-day protocol is attached below.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
            ${protocol.replace(/\n/g, '<br />')}
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <p style="font-size: 12px; color: #9ca3af; font-style: italic;">
            <strong>Zero Liability Disclaimer:</strong> This AI-generated protocol is for educational and cosmetic purposes only. We are not medical professionals. This information is based on cosmetic chemistry and fiber physics. Consult a doctor for scalp conditions.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (err) {
    console.error('Server Error in Send-Results:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
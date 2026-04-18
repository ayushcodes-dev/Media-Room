import nodemailer from "nodemailer";
import { OTPValidationTime } from "#/utility.js";
async function sendSignupOTP(email, OTP) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.E_MAIL,
                pass: process.env.E_MAIL_SENDER_PASS // App password
            }
        });

        await transporter.verify();

              const info = await transporter.sendMail({
            from: `VidFly`,
            to: email,
            subject: "VidFly - Signup OTP",
            text: `Your OTP is ${OTP}`, // fallback plain text
            html: `
<div style="margin:0;padding:0;background:#0F172A;width:100%;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0F172A;padding:40px 0;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:500px;background:#1E293B;border-radius:24px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.4);">

          <tr>
            <td align="center" style="padding:40px 20px 20px;">
              <div style="display:inline-block;background:linear-gradient(135deg, #38BDF8 0%, #6366F1 100%);padding:2px;border-radius:12px;">
                <div style="background:#1E293B;padding:10px 20px;border-radius:10px;">
                   <h1 style="margin:0;font-size:32px;font-weight:800;color: #38BDF8 ;letter-spacing:-1px;">
                    Vid<span style="color:#FFFFFF;">Fly</span>
                  </h1>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px;">
              <h2 style="color:#FFFFFF;font-size:22px;text-align:center;margin-top:20px;">Verify your identity</h2>
              <p style="color:#94A3B8;font-size:16px;line-height:24px;text-align:center;margin-bottom:30px;">
                Ready to take off? Use the verification code below to complete your <b>VidFly</b> registration.
              </p>

              <div style="background:rgba(56, 189, 248, 0.1);border:1px dashed #38BDF8;border-radius:16px;padding:30px;text-align:center;">
                <span style="display:block;color:#38BDF8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">
                  Your OTP Code
                </span>
                <span style="font-family:'Courier New', monospace;font-size:42px;font-weight:bold;color:#FFFFFF;letter-spacing:10px;">
                  ${OTP}
                </span>
              </div>

              <p style="color:#64748B;font-size:13px;text-align:center;margin-top:30px;line-height:20px;">
                This code expires in <b>${OTPValidationTime / (1000 * 60)} minutes</b>.<br>
                For security, never share this code with anyone.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 40px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #334155;padding-top:20px;">
                <tr>
                  <td align="center">
                    <p style="margin:0;color:#475569;font-size:12px;">
                      © 2026 VidFly Labs. Built for creators.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</div>`
        });

        //console.log("OTP sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return false;
    }
}

export default sendSignupOTP;

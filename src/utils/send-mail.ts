const nodemailer: any = {};

export const sendMail = async (options: {
     email: string;
     subject: string;
     message: string;
}) => {
     try {
          const transporter = nodemailer.createTransport({
               service: "gmail",
               secure: false,
               auth: {
                    user: process.env.EMAIL_USER!,
                    pass: process.env.EMAIL_PASS!,
                    // type: 'SMTP',
               },
          });
          const mailOptions = {
               from: process.env.EMAIL_USER!,
               to: options.email,
               subject: options.subject,
               html: options.message,
          };
          await transporter.sendMail(mailOptions);
          return;
     } catch (error) {
          throw error;
     }
};

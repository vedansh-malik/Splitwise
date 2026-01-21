const nodemailer = require('nodemailer');

// 1. Setup the "Transporter" (The service sending the email)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASSCODE   
  }
});

// 2. Function to send the email
const sendExpenseNotification = async (toEmail, payerName, amount, description) => {
  try {
    const mailOptions = {
      from: '"Splitwise Pro" <malikvedansh0003@gmail.com>', // Sender address
      to: toEmail,
      subject: `New Expense Added: ${description}`,
      html: `
      <div style="background-color: #0a0a0a; margin: 0; padding: 40px 20px; font-family: 'Helvetica', 'Arial', sans-serif; color: #E5E5E5;">
  
      <div style="max-width: 600px; margin: 0 auto; background-color: #171717; border-radius: 24px; border: 1px solid #333333; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        
        <div style="height: 6px; background-color: #EA580C; background-image: linear-gradient(90deg, #EA580C, #9A3412);"></div>
        
        <div style="padding: 40px 30px; text-align: center;">
          
          <div style="display: inline-block; padding: 12px; background-color: rgba(234, 88, 12, 0.1); border-radius: 12px; margin-bottom: 24px;">
            <span style="color: #EA580C; font-weight: 800; font-size: 24px; letter-spacing: -1px;">SplitwisePro</span>
          </div>
    
          <h2 style="margin: 0 0 10px 0; color: #FFFFFF; font-size: 24px; font-weight: 700;">New Expense Added</h2>
          <p style="margin: 0 0 30px 0; color: #A3A3A3; font-size: 16px;">
            <strong style="color: #FFFFFF;">${payerName}</strong> just added a new expense.
          </p>
    
          <div style="background-color: #0a0a0a; border: 1px solid #333; border-radius: 16px; padding: 25px; text-align: left; margin-bottom: 30px;">
            
            <div style="margin-bottom: 20px;">
              <p style="margin: 0; color: #A3A3A3; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Expense</p>
              <p style="margin: 5px 0 0 0; color: #FFFFFF; font-size: 18px; font-weight: 600;">${description}</p>
            </div>
    
            <div style="padding-top: 20px; border-top: 1px solid #262626;">
               <p style="margin: 0; color: #A3A3A3; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your Share</p>
               <p style="margin: 5px 0 0 0; color: #EF4444; font-size: 32px; font-weight: 800; letter-spacing: -1px;">
                 $${amount.toFixed(2)}
               </p>
               <p style="margin: 5px 0 0 0; font-size: 12px; color: #EF4444; opacity: 0.8;">(You owe this)</p>
            </div>
            
          </div>
    
          <a href="https://your-website-url.com/dashboard" style="display: inline-block; background-color: #EA580C; color: #FFFFFF; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(234, 88, 12, 0.4);">
            View Details & Settle Up
          </a>
          
          <p style="margin-top: 30px; font-size: 14px; color: #525252;">
            Track your shared expenses instantly on SplitwisePro.
          </p>
    
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #525252; font-size: 12px;">
        <p>&copy; 2024 SplitwisePro. All rights reserved.</p>
      </div>
    
    </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendExpenseNotification;

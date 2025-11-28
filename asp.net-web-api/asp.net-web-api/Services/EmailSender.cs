using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net;
using System.Net.Mail;

namespace asp.net_web_api.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration config;

        public EmailSender(IConfiguration config)
        {
            this.config = config;
        }

        public Task SendEmailAsync(string targetEmail, string subject, string htmlMessage)
        {
            try
            {
                string emailAddress = config.GetSection("EmailCredentials:Email").Get<string>() ?? throw new ArgumentException("No email address provided to send data");
                string password = config.GetSection("EmailCredentials:Password").Get<string>() ?? throw new ArgumentException("No email password provided to send data");


                var msg = new MailMessage()
                {
                    Subject = subject,
                    IsBodyHtml = true,
                    Body = htmlMessage,
                    To = { new MailAddress(targetEmail) },
                    From = new MailAddress(emailAddress),
                };

                var smtp = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    EnableSsl = true,
                    Credentials = new NetworkCredential(emailAddress, password)
                };

                return smtp.SendMailAsync(msg);
            }
            catch (Exception)
            {
                return Task.CompletedTask;
            }
        }
    }
}

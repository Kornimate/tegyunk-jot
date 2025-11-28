using asp.net_web_api.DTOs;
using asp.net_web_api.Interfaces;
using asp.net_web_api.Models.Email;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace asp.net_web_api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _config;

        public EmailService(IEmailSender emailSender, IConfiguration config)
        {
            _emailSender = emailSender;
            _config = config;
        }

        public Task SendNotificationToInbox(RequestCreateDto dto)
        {
            return _emailSender.SendEmailAsync(_config.GetSection("EmailCredentials:Email").Get<string>()!, "Új ajánlatkérés", NotificationEmailModel.GetHtmlContent(dto));
        }

        public Task SendResponseToRequest(string targetEmail)
        {
            return _emailSender.SendEmailAsync(targetEmail, @"Köszönjük a kérését \ Thank you for your request", RequestEmailResponseModel.HtmlContent);
        }
    }
}

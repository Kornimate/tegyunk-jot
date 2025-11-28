using asp.net_web_api.DTOs;

namespace asp.net_web_api.Interfaces
{
    public interface IEmailService
    {
        Task SendResponseToRequest(string targetEmail);
        Task SendNotificationToInbox(RequestCreateDto dto);
    }
}

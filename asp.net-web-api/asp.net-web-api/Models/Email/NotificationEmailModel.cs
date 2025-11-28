using asp.net_web_api.DTOs;

namespace asp.net_web_api.Models.Email
{
    public class NotificationEmailModel
    {
        public static string GetHtmlContent(RequestCreateDto dto)
        {
            return $@"<!DOCTYPE html>
<html>
  <body
    style=""
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    ""
  >
    <table
      width=""100%""
      cellspacing=""0""
      cellpadding=""0""
      style=""
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        border-radius: 6px;
        overflow: hidden;
      ""
    >
      <tr>
        <td style=""text-align: center; background: #cc0000; padding: 20px"">
          <h2 style=""color: #ffffff; margin: 0"">Ajánlatkérés Beérkezett</h2>
        </td>
      </tr>
      <tr>
        <td style=""padding: 25px; color: #000000"">
          <p style=""font-size: 15px; line-height: 1.6"">
            Az alábbi adatokkal rendelkező kérelem
            beérkezett a rendszerbe.
          </p>

          <p style=""font-size: 15px; line-height: 1.6"">
            <strong>Név:</strong> {dto.Name}<br />
            <strong>Email:</strong> {dto.Email}<br />
            <strong>Üzenet:</strong><br />
            {dto.Message}
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
";
        }
    }
}

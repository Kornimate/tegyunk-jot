namespace asp.net_web_api.Models.Email
{
    public class RequestEmailResponseModel
    {
        public static string HtmlContent
        {
            get
            {
                return @"<!DOCTYPE html>
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
          <h2>Tegyünk Jót</h2>
        </td>
      </tr>
      <tr>
        <td style=""padding: 25px 25px 0 25px; color: #000000"">
            <i>For english see below!</i>
        </td>
      </tr>
      <tr>
        <td style=""padding: 25px; color: #000000"">
          <h2 style=""color: #cc0000; margin-top: 0"">
            Űrlap Beérkezésének Visszaigazolása
          </h2>
          <p style=""font-size: 15px; line-height: 1.6"">
            Tisztelt Ügyfél!<br /><br />
            Ezúton igazoljuk, hogy megkaptuk az Ön által beküldött űrlapot.
            Munkatársaink megvizsgálják az adatokat, és hamarosan felveszik
            Önnel a kapcsolatot.<br /><br />
            Amennyiben kérdése merül fel, kérem küldjön egy emailt a <b>tegyunk.jot.org@gmail.com</b> címre.
          </p>

          <h2 style=""color: #cc0000; margin-top: 0"">
            Form Receipt Confirmation
          </h2>
          <p style=""font-size: 15px; line-height: 1.6"">
            Dear Applicant,<br /><br />
            This email is to confirm that we have received your form. Our team
            will review the information you provided and will contact you.<br /><br />
            If you have any questions, feel free to send a message to:
            <b>tegyunk.jot.org@gmail.com</b>.
          </p>

          <hr
            style=""border: 0; border-top: 1px solid #000000; margin: 30px 0""
          />

          <p style=""font-size: 15px; line-height: 1.6; margin-top: 30px"">
            Kind regards / Üdvözlettel,<br />
            <strong>Tegyünk Jót csapata</strong>
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
}

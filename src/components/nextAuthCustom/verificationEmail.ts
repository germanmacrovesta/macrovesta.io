export function html (params: { url: string; host: string; token: string; }) {
  const { url: callbackurl, host, token } = params

  const url = new URL(callbackurl)

  console.log(url.origin) // Outputs: https://rubbishportal.com

  const escapedHost = host.replace(/\./g, '&#8203;.')

  // const brandColor = theme.brandColor || "#346df1"
  const brandColor = '#346df1'
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    // buttonText: theme.buttonText || "#fff",
    buttonText: '#fff'
  }

  return `
    <body style="background: ${color.background};">
      <table width="100%" border="0" cellspacing="20" cellpadding="0"
        style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center"
            style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
            Sign in to <strong>${escapedHost}</strong>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
              <td align="center" style="border-radius: 5px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;" bgcolor="${color.buttonBackground}">
              Your code is: ${token}
              </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center"
            style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
            If you did not request this email you can safely ignore it.
          </td>
        </tr>
      </table>
    </body>
    `
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
export function text ({ url: callbackurl, host, token }: { url: string; host: string; token: string; }) {
  const url = new URL(callbackurl)
  return `Sign in to ${host}\n\nYour code is: ${token}`
}

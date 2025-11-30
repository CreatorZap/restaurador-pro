import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCodeEmail(data: {
  email: string;
  code: string;
  packageName: string;
  credits: number;
}) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'FotoMagic Pro <noreply@fotomagicpro.com>',
      to: data.email,
      subject: `🎉 Seu código FotoMagic Pro: ${data.code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f23; color: #ffffff; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; color: #ffffff;">✨ FotoMagic Pro</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Restauração de Fotos com IA</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #10B981; margin: 0 0 20px; font-size: 24px;">🎉 Pagamento Confirmado!</h2>
              
              <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Obrigado pela sua compra! Seu código de acesso está pronto para uso.
              </p>
              
              <!-- Código -->
              <div style="background: rgba(139, 92, 246, 0.1); border: 2px solid #8B5CF6; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
                <p style="color: #a0a0a0; margin: 0 0 10px; font-size: 14px;">SEU CÓDIGO DE ACESSO</p>
                <p style="font-size: 32px; font-weight: bold; color: #8B5CF6; margin: 0; letter-spacing: 3px; font-family: monospace;">${data.code}</p>
              </div>
              
              <!-- Detalhes -->
              <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #ffffff; margin: 0 0 15px; font-size: 16px;">📦 Detalhes da Compra</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #a0a0a0; padding: 8px 0;">Pacote:</td>
                    <td style="color: #ffffff; text-align: right; padding: 8px 0;">${data.packageName}</td>
                  </tr>
                  <tr>
                    <td style="color: #a0a0a0; padding: 8px 0;">Créditos:</td>
                    <td style="color: #10B981; text-align: right; padding: 8px 0; font-weight: bold;">${data.credits} restaurações</td>
                  </tr>
                  <tr>
                    <td style="color: #a0a0a0; padding: 8px 0;">Validade:</td>
                    <td style="color: #ffffff; text-align: right; padding: 8px 0;">12 meses</td>
                  </tr>
                </table>
              </div>
              
              <!-- CTA -->
              <div style="text-align: center; margin: 40px 0 20px;">
                <a href="https://fotomagicpro.com" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  🚀 Começar a Restaurar
                </a>
              </div>
              
              <!-- Instruções -->
              <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10B981; padding: 15px 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #10B981; margin: 0 0 10px; font-weight: bold;">📋 Como usar:</p>
                <ol style="color: #a0a0a0; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Acesse <strong style="color: #ffffff;">fotomagicpro.com</strong></li>
                  <li>Clique em <strong style="color: #ffffff;">"Usar Código"</strong></li>
                  <li>Digite seu código: <strong style="color: #8B5CF6;">${data.code}</strong></li>
                  <li>Faça upload da foto e aguarde a mágica! ✨</li>
                </ol>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: rgba(0,0,0,0.3); padding: 25px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                © 2024 FotoMagic Pro - Todos os direitos reservados<br>
                <a href="https://fotomagicpro.com" style="color: #8B5CF6; text-decoration: none;">fotomagicpro.com</a>
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error };
    }

    console.log('Email enviado com sucesso:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error };
  }
}

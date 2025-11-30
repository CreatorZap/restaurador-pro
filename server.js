// Servidor Express com Mercado Pago
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// CONFIGURAÇÃO MERCADO PAGO
// ============================================
// Use suas credenciais de TESTE primeiro
const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000';

// Log do token para debug
console.log('🔑 Token MP:', MP_ACCESS_TOKEN ? `${MP_ACCESS_TOKEN.substring(0, 20)}...` : '❌ NÃO DEFINIDO');

const client = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

const preference = new Preference(client);
const payment = new Payment(client);

// ============================================
// STORAGE DE CÓDIGOS (em memória para dev)
// ============================================
const codes = {};
const pendingPayments = {}; // Mapeia payment_id -> dados da compra

// Gerar código único
function generateCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const segment = (len) => 
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `REST-${segment(4)}-${segment(4)}`;
}

// ============================================
// ROTAS DE CÓDIGOS (existentes)
// ============================================
app.get('/api/codes', (req, res) => {
  const { action, code } = req.query;
  
  console.log(`📥 GET /api/codes?action=${action}&code=${code || 'N/A'}`);

  if (action === 'validate' && code) {
    const upperCode = String(code).toUpperCase();
    const creditCode = codes[upperCode];
    
    if (!creditCode) {
      console.log(`   ❌ Código não encontrado: ${upperCode}`);
      return res.status(404).json({ success: false, error: 'Código não encontrado' });
    }
    
    if (!creditCode.isActive) {
      return res.status(400).json({ success: false, error: 'Código desativado' });
    }
    
    const remaining = creditCode.creditsTotal - creditCode.creditsUsed;
    if (remaining <= 0) {
      return res.status(400).json({ success: false, error: 'Sem créditos' });
    }
    
    console.log(`   ✅ Código válido: ${upperCode} (${remaining} créditos)`);
    return res.json({ 
      success: true, 
      data: { ...creditCode, creditsRemaining: remaining } 
    });
  }

  if (action === 'list') {
    return res.json({ success: true, data: codes });
  }

  return res.status(400).json({ success: false, error: 'Ação inválida' });
});

app.post('/api/codes', (req, res) => {
  const { action } = req.query;
  
  console.log(`📥 POST /api/codes?action=${action}`);

  if (action === 'create') {
    const { email, credits, packageName } = req.body;
    
    if (!email || !credits || !packageName) {
      return res.status(400).json({ success: false, error: 'Dados incompletos' });
    }

    const code = generateCode();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const creditCode = {
      code,
      email: email.toLowerCase().trim(),
      creditsTotal: Number(credits),
      creditsUsed: 0,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      packageName,
      isActive: true,
    };

    codes[code] = creditCode;
    
    console.log(`   ✅ Código criado: ${code}`);
    return res.json({ success: true, data: creditCode });
  }

  if (action === 'use') {
    const { code } = req.body;
    const upperCode = String(code).toUpperCase();
    const creditCode = codes[upperCode];

    if (!creditCode) {
      return res.status(404).json({ success: false, error: 'Código não encontrado' });
    }

    const remaining = creditCode.creditsTotal - creditCode.creditsUsed;
    if (remaining <= 0) {
      return res.status(400).json({ success: false, error: 'Sem créditos' });
    }

    creditCode.creditsUsed += 1;
    codes[upperCode] = creditCode;

    return res.json({ 
      success: true, 
      data: { creditsRemaining: creditCode.creditsTotal - creditCode.creditsUsed } 
    });
  }

  return res.status(400).json({ success: false, error: 'Ação inválida' });
});

// ============================================
// ROTAS MERCADO PAGO
// ============================================

// Pacotes disponíveis
const PACKAGES = {
  starter: { id: 'starter', name: 'Pacote Inicial', price: 19, credits: 10 },
  family: { id: 'family', name: 'Pacote Família', price: 49, credits: 35 },
  pro: { id: 'pro', name: 'Pacote Profissional', price: 99, credits: 100 }
};

// POST /api/payment/create - Criar preferência de pagamento
app.post('/api/payment/create', async (req, res) => {
  const { packageId, email } = req.body;
  
  console.log(`💳 POST /api/payment/create`);
  console.log(`   Package: ${packageId}, Email: ${email}`);

  if (!packageId || !email) {
    return res.status(400).json({ success: false, error: 'Dados incompletos' });
  }

  const pkg = PACKAGES[packageId];
  if (!pkg) {
    return res.status(400).json({ success: false, error: 'Pacote não encontrado' });
  }

  // Verificar se token está configurado
  if (!MP_ACCESS_TOKEN || MP_ACCESS_TOKEN.includes('xxxx') || MP_ACCESS_TOKEN.includes('0000')) {
    console.log('   ⚠️ Token MP não configurado, usando simulação');
    return res.status(400).json({ 
      success: false, 
      error: 'Mercado Pago não configurado. Use a simulação.' 
    });
  }

  try {
    console.log(`   🔑 Token: ${MP_ACCESS_TOKEN.substring(0, 20)}...`);
    
    // URL base - DEVE estar definida
    const siteUrl = 'http://localhost:3000';
    
    console.log(`   🔗 Site URL: ${siteUrl}`);

    // Criar preferência no Mercado Pago
    // IMPORTANTE: NÃO usar auto_return em localhost - causa erro
    const preferenceData = {
      items: [
        {
          id: pkg.id,
          title: `${pkg.name} - ${pkg.credits} Créditos`,
          description: `Restaurador Pro - ${pkg.credits} restaurações de fotos`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: Number(pkg.price)
        }
      ],
      payer: {
        email: email
      },
      back_urls: {
        success: `${siteUrl}/?status=success&package=${packageId}`,
        failure: `${siteUrl}/?status=failure`,
        pending: `${siteUrl}/?status=pending` 
      },
      // NÃO incluir auto_return em localhost - causa erro
      // auto_return será adicionado apenas em produção
      external_reference: JSON.stringify({
        email,
        packageId,
        credits: pkg.credits,
        packageName: pkg.name,
        timestamp: Date.now()
      }),
      statement_descriptor: 'RESTAURADOR PRO',
      expires: false
    };

    console.log('📦 Preferência:', JSON.stringify(preferenceData, null, 2));

    const response = await preference.create({ body: preferenceData });
    
    console.log(`   ✅ Preferência criada!`);
    console.log(`   📝 ID: ${response.id}`);
    console.log(`   🔗 Link Produção: ${response.init_point}`);
    console.log(`   🧪 Link Sandbox: ${response.sandbox_init_point}`);

    return res.json({
      success: true,
      data: {
        preferenceId: response.id,
        initPoint: response.init_point,
        sandboxInitPoint: response.sandbox_init_point
      }
    });

  } catch (error) {
    console.error('   ❌ Erro Mercado Pago:', error.message);
    if (error.cause) {
      console.error('   Causa:', JSON.stringify(error.cause, null, 2));
    }
    return res.status(500).json({ 
      success: false, 
      error: `Erro ao criar pagamento: ${error.message}` 
    });
  }
});

// POST /api/payment/webhook - Receber notificações do Mercado Pago
app.post('/api/payment/webhook', async (req, res) => {
  const { type, data } = req.body;
  
  console.log(`🔔 WEBHOOK recebido: ${type}`);
  console.log(`   Data:`, data);

  // Responder imediatamente (Mercado Pago espera resposta rápida)
  res.status(200).send('OK');

  if (type === 'payment') {
    try {
      // Buscar detalhes do pagamento
      const paymentInfo = await payment.get({ id: data.id });
      
      console.log(`   💰 Status: ${paymentInfo.status}`);
      console.log(`   💰 Valor: R$ ${paymentInfo.transaction_amount}`);

      if (paymentInfo.status === 'approved') {
        // Pagamento aprovado! Gerar código
        const externalRef = JSON.parse(paymentInfo.external_reference || '{}');
        const { email, credits, packageName } = externalRef;

        if (email && credits) {
          const code = generateCode();
          const expiresAt = new Date();
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);

          const creditCode = {
            code,
            email: email.toLowerCase().trim(),
            creditsTotal: Number(credits),
            creditsUsed: 0,
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
            packageName,
            isActive: true,
            paymentId: data.id
          };

          codes[code] = creditCode;

          console.log(`   ✅ CÓDIGO GERADO: ${code}`);
          console.log(`   📧 Email: ${email}`);
          console.log(`   💳 Créditos: ${credits}`);

          // TODO: Enviar email com o código
          // await sendEmail(email, code, credits);
        }
      }
    } catch (error) {
      console.error('   ❌ Erro ao processar webhook:', error);
    }
  }
});

// GET /api/payment/status/:id - Verificar status do pagamento
app.get('/api/payment/status/:id', async (req, res) => {
  const { id } = req.params;
  
  console.log(`🔍 GET /api/payment/status/${id}`);

  try {
    const paymentInfo = await payment.get({ id });

    return res.json({
      success: true,
      data: {
        status: paymentInfo.status,
        statusDetail: paymentInfo.status_detail,
        externalReference: paymentInfo.external_reference
      }
    });
  } catch (error) {
    console.error('   ❌ Erro ao buscar pagamento:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao buscar pagamento' 
    });
  }
});

// POST /api/payment/simulate - APENAS PARA TESTE: Simular pagamento aprovado
app.post('/api/payment/simulate', (req, res) => {
  const { email, packageId } = req.body;
  
  console.log(`🧪 SIMULAÇÃO de pagamento`);

  const pkg = PACKAGES[packageId];
  if (!pkg) {
    return res.status(400).json({ success: false, error: 'Pacote não encontrado' });
  }

  // Gerar código diretamente (simulando pagamento aprovado)
  const code = generateCode();
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const creditCode = {
    code,
    email: email.toLowerCase().trim(),
    creditsTotal: pkg.credits,
    creditsUsed: 0,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    packageName: pkg.name,
    isActive: true,
    simulated: true
  };

  codes[code] = creditCode;

  console.log(`   ✅ Código simulado: ${code}`);

  return res.json({
    success: true,
    data: creditCode
  });
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    codes: Object.keys(codes).length,
    mpConfigured: !!MP_ACCESS_TOKEN && MP_ACCESS_TOKEN !== 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000'
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ================================');
  console.log('   API Server + Mercado Pago');
  console.log('🚀 ================================');
  console.log('');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log('');
  
  // Debug: Verificar token
  const tokenConfigured = MP_ACCESS_TOKEN && MP_ACCESS_TOKEN !== 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000';
  console.log('🔑 Mercado Pago:');
  console.log(`   Token configurado: ${tokenConfigured ? '✅ SIM' : '❌ NÃO'}`);
  if (tokenConfigured) {
    console.log(`   Token: ${MP_ACCESS_TOKEN.substring(0, 20)}...`);
  }
  console.log('');
  
  console.log('📝 Endpoints de Códigos:');
  console.log(`   GET  /api/codes?action=validate&code=XXX`);
  console.log(`   GET  /api/codes?action=list`);
  console.log(`   POST /api/codes?action=create`);
  console.log(`   POST /api/codes?action=use`);
  console.log('');
  console.log('💳 Endpoints de Pagamento:');
  console.log(`   POST /api/payment/create`);
  console.log(`   POST /api/payment/webhook`);
  console.log(`   GET  /api/payment/status/:id`);
  console.log(`   POST /api/payment/simulate (teste)`);
  console.log('');
  console.log('🔥 Aguardando requisições...');
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\n👋 Encerrando servidor...');
  process.exit(0);
});

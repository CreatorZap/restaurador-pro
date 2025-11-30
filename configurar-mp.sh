#!/bin/bash

# Script para configurar Mercado Pago

echo "🔑 Configurador de Mercado Pago"
echo "================================"
echo ""

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Criando arquivo .env..."
    cat > .env << 'EOF'
# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=

# URLs
SITE_URL=http://localhost:3000
WEBHOOK_URL=https://seu-dominio.com
EOF
    echo "✅ Arquivo .env criado!"
    echo ""
fi

# Verificar token atual
CURRENT_TOKEN=$(grep "MERCADOPAGO_ACCESS_TOKEN=" .env | cut -d'=' -f2)

if [ -z "$CURRENT_TOKEN" ] || [ "$CURRENT_TOKEN" = "APP_USR-xxxxxx" ]; then
    echo "⚠️  Token não configurado ou é um exemplo"
    echo ""
    echo "📝 Para configurar:"
    echo "1. Acesse: https://www.mercadopago.com.br/developers"
    echo "2. Vá em 'Suas integrações'"
    echo "3. Copie o Access Token de TESTE"
    echo "4. Cole aqui:"
    echo ""
    read -p "Token do Mercado Pago: " NEW_TOKEN
    
    if [ ! -z "$NEW_TOKEN" ]; then
        # Atualizar .env
        sed -i '' "s|MERCADOPAGO_ACCESS_TOKEN=.*|MERCADOPAGO_ACCESS_TOKEN=$NEW_TOKEN|" .env
        echo ""
        echo "✅ Token configurado!"
        echo ""
        echo "🔄 Reinicie o servidor com: npm run api"
    else
        echo ""
        echo "❌ Token não fornecido"
        echo ""
        echo "💡 Alternativa: Use a simulação!"
        echo "   - Não precisa de token"
        echo "   - Clique em 'Simular Pagamento (teste)'"
    fi
else
    echo "✅ Token já configurado!"
    echo "Token: ${CURRENT_TOKEN:0:20}..."
    echo ""
    echo "🔄 Se quiser alterar, edite o arquivo .env"
fi

echo ""
echo "================================"
echo "✅ Configuração concluída!"

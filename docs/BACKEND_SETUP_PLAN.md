# Plano de Execução: Configuração do Backend WhatsCRM

## Pré-requisitos
- WSL2 Ubuntu
- Node.js instalado
- Acesso sudo

---

## ETAPA 1: Instalar MySQL/MariaDB

### 1.1 Atualizar pacotes
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Instalar MariaDB (recomendado - compatível com MySQL)
```bash
sudo apt install mariadb-server mariadb-client -y
```

### 1.3 Iniciar o serviço
```bash
sudo service mariadb start
```

### 1.4 Verificar se está rodando
```bash
sudo service mariadb status
```

### 1.5 Configurar segurança (opcional mas recomendado)
```bash
sudo mysql_secure_installation
```
- Responda as perguntas:
  - Enter current password for root: (pressione Enter, está vazio)
  - Switch to unix_socket authentication? N
  - Change the root password? Y (defina uma senha)
  - Remove anonymous users? Y
  - Disallow root login remotely? Y
  - Remove test database? Y
  - Reload privilege tables now? Y

---

## ETAPA 2: Criar Banco de Dados

### 2.1 Acessar o MySQL como root
```bash
sudo mysql -u root -p
```

### 2.2 Criar o banco de dados
```sql
CREATE DATABASE whatscrm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2.3 Criar usuário dedicado
```sql
CREATE USER 'whatscrm'@'localhost' IDENTIFIED BY 'SuaSenhaSegura123!';
```

### 2.4 Conceder permissões
```sql
GRANT ALL PRIVILEGES ON whatscrm_db.* TO 'whatscrm'@'localhost';
FLUSH PRIVILEGES;
```

### 2.5 Verificar criação
```sql
SHOW DATABASES;
SELECT User, Host FROM mysql.user;
EXIT;
```

---

## ETAPA 3: Importar Schema do Banco

### 3.1 Importar o arquivo SQL
```bash
cd /home/convertfy/projetos/whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system
mysql -u whatscrm -p whatscrm_db < database/import.sql
```

### 3.2 Verificar tabelas criadas
```bash
mysql -u whatscrm -p whatscrm_db -e "SHOW TABLES;"
```

**Tabelas esperadas (32):**
- admin
- agents
- agent_chats
- agent_task
- beta_campaign
- beta_campaign_logs
- beta_chatbot
- beta_chats
- beta_conversation
- chat_tags
- contact
- flow
- flow_data
- flow_session
- instance
- meta_api
- orders
- phonebook
- plan
- templates
- user
- warmers
- web_public
- (e outras...)

---

## ETAPA 4: Configurar .env do Backend

### 4.1 Editar arquivo .env
```bash
nano /home/convertfy/projetos/whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/.env
```

### 4.2 Configuração recomendada:
```env
# Servidor
HOST=127.0.0.1
PORT=3010

# Banco de Dados
DBHOST=localhost
DBNAME=whatscrm_db
DBUSER=whatscrm
DBPASS=SuaSenhaSegura123!
DBPORT=3306

# JWT - GERE UMA CHAVE ÚNICA E FORTE
JWTKEY=ConvertfyCRM2024SecretKeyParaJWTMuitoForteESegura!@#$%

# URLs (desenvolvimento local)
FRONTENDURI=http://localhost:5173
BACKURI=http://localhost:3010

# Stripe (opcional por enquanto)
STRIPE_LANG=pt
```

### 4.3 Variáveis explicadas:

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| HOST | IP do servidor | Sim |
| PORT | Porta do backend | Sim |
| DBHOST | Host do MySQL | Sim |
| DBNAME | Nome do banco | Sim |
| DBUSER | Usuário do banco | Sim |
| DBPASS | Senha do banco | Sim |
| DBPORT | Porta do MySQL | Sim |
| JWTKEY | Chave secreta JWT (min 32 chars) | Sim |
| FRONTENDURI | URL do frontend | Sim |
| BACKURI | URL do backend | Sim |
| STRIPE_LANG | Idioma do Stripe | Não |

---

## ETAPA 5: Instalar Dependências do Backend

### 5.1 Navegar para a pasta
```bash
cd /home/convertfy/projetos/whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system
```

### 5.2 Instalar pacotes npm
```bash
npm install
```

### 5.3 Verificar se não houve erros
- Warnings de deprecated são normais
- Erros de compilação (bcrypt, etc) podem precisar de:
```bash
sudo apt install build-essential python3
npm rebuild
```

---

## ETAPA 6: Iniciar o Backend

### 6.1 Iniciar em modo desenvolvimento
```bash
cd /home/convertfy/projetos/whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system
npm start
```

### 6.2 Saída esperada:
```
WaCrm server is running on port 3010
```

### 6.3 Testar se API responde
Em outro terminal:
```bash
curl http://localhost:3010/api/web/get-web-public
```

Resposta esperada:
```json
{"success":true,"data":{...}}
```

---

## ETAPA 7: Verificar Integração Frontend

### 7.1 Iniciar o frontend (outro terminal)
```bash
cd /home/convertfy/projetos/convertfy-growth-hub
npm run dev
```

### 7.2 Testar no navegador
1. Acesse http://localhost:5173
2. Vá para /login
3. Tente fazer login com:
   - Email: admin@admin.com
   - Senha: admin123 (ou a senha padrão do import.sql)

---

## ETAPA 8: Criar Primeiro Usuário (se necessário)

Se o login admin não funcionar, crie via SQL:

```bash
mysql -u whatscrm -p whatscrm_db
```

```sql
-- Gerar hash bcrypt para senha "teste123"
-- Use: https://bcrypt-generator.com/ ou node -e "console.log(require('bcrypt').hashSync('teste123', 10))"

INSERT INTO user (uid, name, email, password, mobile, role, createdAt)
VALUES (
  'ABC123XYZ789DEF456',
  'Admin Teste',
  'admin@convertfy.com',
  '$2b$10$HASH_GERADO_AQUI',
  '11999999999',
  'user',
  NOW()
);
```

---

## Comandos Rápidos de Referência

### Iniciar/Parar MariaDB
```bash
sudo service mariadb start
sudo service mariadb stop
sudo service mariadb restart
```

### Logs do Backend
```bash
# Rodar com nodemon para auto-reload
npx nodemon server.js
```

### Verificar portas em uso
```bash
sudo lsof -i :3010
sudo lsof -i :3306
```

---

## Troubleshooting

### Erro: "Can't connect to MySQL server"
```bash
sudo service mariadb start
```

### Erro: "Access denied for user"
Verifique usuário/senha no .env e no MySQL:
```bash
mysql -u whatscrm -p -e "SELECT 1"
```

### Erro: "EADDRINUSE port 3010"
Outra instância está rodando:
```bash
sudo kill $(sudo lsof -t -i:3010)
```

### Erro: "JWT malformed" no frontend
Limpe o localStorage do navegador (F12 > Application > Clear)

---

## Próximos Passos Após Setup

1. **Testar login** - Frontend + Backend integrados
2. **Configurar Meta API** - Para WhatsApp Cloud API
3. **Testar QR Code** - Conectar WhatsApp via Baileys
4. **Configurar SMTP** - Para envio de emails

---

**Data de criação:** 2025-12-04
**Projeto:** Convertfy Growth Hub + WhatsCRM Backend

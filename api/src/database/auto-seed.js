const bcrypt = require('bcrypt');
const db = require('../config/database');

async function autoSeed() {
  try {
    // Verifica se a tabela existe
    const [tables] = await db.query(
      "SHOW TABLES LIKE 'volunteers'"
    );
    
    if (tables.length === 0) {
      console.error('\n❌ ERRO: Tabela "volunteers" não encontrada!');
      console.log('Execute o script SQL primeiro: api/src/database/create_db.sql');
      console.log('Depois reinicie o servidor.\n');
      process.exit(1);
    }

    // Verifica se já existem usuários
    const [users] = await db.query('SELECT COUNT(*) as count FROM volunteers');
    
    if (users[0].count > 0) {
      console.log('✓ Banco já possui usuários. Seed não necessário.');
      return;
    }

    console.log('Nenhum usuário encontrado no banco. Executando seed automático...\n');

    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);

    const volunteers = [
      { name: 'Administrador', email: 'admin@ifrs.edu', phone: '(54) 99999-0001', role: 'admin' },
      { name: 'João Pedro', email: 'user@ifrs.edu', phone: '(54) 99999-0002', role: 'user' },
      { name: 'Maria Franz', email: 'maria@ifrs.edu', phone: '(54) 99999-0003', role: 'user' },
      { name: 'Pedro Machado', email: 'pedro@ifrs.edu', phone: '(54) 99999-0004', role: 'user' },
    ];

    for (const vol of volunteers) {
      await db.query(
        'INSERT INTO volunteers (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)',
        [vol.name, vol.email, vol.phone, vol.role, hashedPassword]
      );
      console.log(`  ✓ Criado: ${vol.email} / ${password} (${vol.role})`);
    }
    console.log('\n');
  } catch (error) {
    console.error('⚠️  Erro no seed automático:', error.message);
  }
}

module.exports = autoSeed;

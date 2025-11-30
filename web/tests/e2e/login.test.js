import { Builder, By, until } from 'selenium-webdriver';

const BASE_URL = 'http://localhost:5173';

(async function testeLoginE2E() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // ======== CENÁRIO 1: Login inválido ========
    console.log('\nCenário 1: login inválido → deve exibir mensagem de erro');

    // Acessa a página inicial (login) 
    await driver.get(`${BASE_URL}/login`);

    // Preenche com credenciais inválidas
    const campoEmail = await driver.wait(
      until.elementLocated(By.id('email')),
      5000
    );
    const campoSenha = await driver.findElement(By.id('password'));
    const botaoEntrar = await driver.findElement(By.id('login-submit'));

    await campoEmail.sendKeys('user@ifrs.edu');
    await campoSenha.sendKeys('senha-incorreta');
    await botaoEntrar.click();

    // Aguarda até que a mensagem de erro apareça 
    const mensagemErro = await driver.wait(
      until.elementLocated(By.id('login-error')),
      3000
    );

     // Lê o texto exibido 
    const textoErro = await mensagemErro.getText();

    // Confere se contém o texto esperado 
    if (textoErro.includes('Credenciais inválidas')) {
      console.log('Mensagem de erro exibida corretamente!');
    } else {
      throw new Error(`Mensagem inesperada: ${textoErro}`);
    }

    // ======== CENÁRIO 2: Login correto ========
    console.log('\nCenário 2: login válido → deve navegar para o dashboard');

    // Reabre a página de login e preenche campos com credenciais válidas
    await driver.get(`${BASE_URL}/login`);

    const campoEmailValido = await driver.wait(
      until.elementLocated(By.id('email')),
      5000
    );
    const campoSenhaValida = await driver.findElement(By.id('password'));
    const botaoEntrarValido = await driver.findElement(By.id('login-submit'));

    await campoEmailValido.sendKeys('user@ifrs.edu');
    await campoSenhaValida.sendKeys('123456');

    // Clica novamente em "Entrar" 
    await botaoEntrarValido.click();

    // Aguarda até que a URL mude para /dashboard 
    await driver.wait(until.urlContains("/dashboard"), 5000); 
    
    // Aguarda o título do dashboard
    const titulo = await driver.wait(
      until.elementLocated(By.id('dashboard-title')),
      5000
    );

    const textoTitulo = await titulo.getText();
    if (/dashboard/i.test(textoTitulo)) {
      console.log('Login realizado e dashboard exibido com sucesso!');
    } else {
      throw new Error(`Título do dashboard incorreto: ${textoTitulo}`);
    }

    console.log('Teste finalizado sem erros!');
  } catch (erro) {
    console.error('Falha durante o teste:', erro.message);
  } finally {
    // Fecha o navegador, mesmo que ocorra erro
    await driver.quit();
  }
})();

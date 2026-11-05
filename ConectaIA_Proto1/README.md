# ConectaIA — protótipo funcional

Interface web demonstrativa pensada para apoiar a aprendizagem digital de pessoas idosas, com navegação simples, texto ajustável, alto contraste, leitura em voz alta e trilhas educativas.

## O que funciona nesta versão

- Navegação entre Início, Conversa, Trilhas, Sobre a IA, Acessibilidade e Ajuda.
- Personalização do nome/apelido durante a sessão.
- Chat demonstrativo com respostas predefinidas por assunto. **Não está conectado a um serviço de IA real.**
- Reconhecimento de fala real quando o navegador oferece a Web Speech API e o usuário concede permissão. Se não houver suporte, a interface informa e permite digitar.
- Leitura em voz alta usando a síntese de fala do navegador, quando disponível.
- Quatro trilhas com conteúdo e passos de orientação exibidos em uma janela própria.
- Ajuste do tamanho da fonte, alto contraste, velocidade da leitura e restauração das configurações.
- Layout adaptável a telas menores e controles com rótulos acessíveis.
- Ajuda informativa; **não chama emergência nem envia mensagens a terceiros**.

## Limites importantes

- O chat usa regras e respostas pré-programadas; não é uma IA generativa.
- Reconhecimento de fala depende do navegador, do microfone, da permissão do usuário e, em alguns casos, de uma conexão segura (HTTPS). A digitação continua disponível.
- Leitura em voz alta depende do suporte do navegador/sistema operacional.
- Não há servidor, login, banco de dados ou sincronização entre dispositivos.
- O nome e as configurações não são persistidos após atualizar ou fechar a página.
- Não insira senhas, códigos bancários ou outros dados sensíveis.

## Requisitos

- Node.js LTS instalado.
- Navegador atualizado.
- Conexão à internet na primeira instalação das dependências.

## Executar no Windows (PowerShell)

Abra no VS Code a pasta que contém este `package.json` e execute:

```powershell
npm.cmd install
npm.cmd run dev
```

Abra a URL apresentada pelo Vite no terminal (normalmente `http://localhost:5173/`). Para encerrar, pressione `Ctrl+C`.

> `npm.cmd` pode ser usado quando a política de execução do PowerShell bloqueia `npm.ps1`.

## Validar e gerar build

```powershell
npm.cmd run build
npm.cmd run preview
```

O primeiro comando verifica os tipos TypeScript e gera a versão de produção. O segundo serve o build localmente para conferência.

## Estrutura

```text
ConectaIA/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── App.tsx
    ├── main.tsx
    └── styles.css
```

## Observação de entrega

Este é um protótipo acadêmico funcional no escopo descrito acima, não um serviço de produção. Antes de apresentar, execute `npm.cmd install` e `npm.cmd run build` no ambiente de destino e teste microfone/leitura no navegador escolhido. Não declare testes como aprovados sem executar e registrar os resultados.

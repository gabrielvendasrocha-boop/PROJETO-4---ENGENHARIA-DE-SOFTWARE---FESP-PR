# ConectaIA
### Guia Digital Inclusivo para o Uso Seguro e Consciente da Inteligência Artificial

![Status](https://img.shields.io/badge/Status-Prot%C3%B3tipo%20Acad%C3%AAmico-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## 1. Apresentação

O **ConectaIA** é um projeto acadêmico de desenvolvimento de uma aplicação web educacional, concebido com o propósito de promover a inclusão digital e facilitar o acesso às tecnologias contemporâneas, especialmente à inteligência artificial.

A solução foi idealizada prioritariamente para pessoas idosas e indivíduos com pouca familiaridade com recursos tecnológicos, considerando a necessidade de interfaces intuitivas, linguagem acessível e mecanismos que favoreçam a autonomia no ambiente digital.

A plataforma reúne funcionalidades de interação com inteligência artificial generativa, conteúdos educativos, orientações sobre segurança digital e recursos de acessibilidade, proporcionando uma experiência de aprendizagem orientada e progressiva.

O projeto fundamenta-se na utilização da tecnologia como instrumento de inclusão social, democratização do conhecimento e desenvolvimento de competências digitais.

## 2. Objetivo geral

Desenvolver uma aplicação web educacional que contribua para a inclusão e a alfabetização digital, oferecendo recursos interativos e conteúdos orientativos que auxiliem os usuários na compreensão e utilização segura das tecnologias digitais e da inteligência artificial.

### Objetivos específicos

- Facilitar a compreensão de conceitos relacionados à inteligência artificial.
- Promover a autonomia na utilização de dispositivos móveis e ferramentas digitais.
- Disponibilizar conteúdos educativos sobre comunicação e navegação na internet.
- Incentivar práticas de segurança e proteção de informações pessoais.
- Incorporar recursos de acessibilidade para melhorar a experiência de utilização.
- Demonstrar a aplicação de conceitos de Engenharia de Software no desenvolvimento de uma solução tecnológica.

## 3. Funcionalidades do sistema

### 3.1. Conversa com Inteligência Artificial

Módulo de interação por linguagem natural, integrado à API do Google Gemini, permitindo que os usuários realizem perguntas e recebam orientações.

O assistente foi concebido para utilizar linguagem simples, respostas objetivas e explicações organizadas em etapas, considerando as necessidades de usuários com menor familiaridade tecnológica.

A implementação contempla:
- Envio de perguntas por texto.
- Processamento do histórico recente da conversa.
- Recebimento progressivo de respostas.
- Orientações personalizadas conforme o contexto da interação.
- Respostas locais predefinidas como mecanismo de contingência.

### 3.2. Trilhas de Sucesso

Área educacional estruturada em quatro eixos temáticos:

**1. Aprendendo a usar o celular:** orientações sobre funcionalidades, configurações e utilização de dispositivos móveis.

**2. Conversando com assistentes digitais:** introdução à utilização de assistentes virtuais e ferramentas de inteligência artificial.

**3. Mensagens e videochamadas:** orientações para utilização de ferramentas de comunicação digital.

**4. Segurança na internet:** recomendações para identificação de golpes, proteção de senhas e utilização consciente dos ambientes digitais.

### 3.3. Sobre a Inteligência Artificial

Apresenta conteúdos introdutórios sobre inteligência artificial, suas características, aplicações e possibilidades de utilização no cotidiano.

### 3.4. Acessibilidade

Disponibiliza recursos para adaptação da interface às necessidades dos usuários:

- Ajuste da escala visual entre 90% e 130%.
- Ativação do modo de alto contraste.
- Leitura de conteúdos em voz alta.
- Ajuste da velocidade de leitura.
- Restauração das configurações visuais padrão.

### 3.5. Recursos de voz

A aplicação utiliza recursos disponíveis nos navegadores para reconhecimento de fala e síntese de voz, possibilitando formas alternativas de interação.

A disponibilidade desses recursos depende da compatibilidade do navegador, das permissões concedidas e dos dispositivos utilizados.

### 3.6. Ajuda e orientação

Área destinada à apresentação de instruções sobre navegação, utilização das funcionalidades e acesso aos conteúdos educativos.

## 4. Tecnologias utilizadas

O desenvolvimento do ConectaIA utiliza tecnologias voltadas à construção de aplicações web modernas e interativas.

| Tecnologia | Finalidade |
|---|---|
| React 18 | Construção da interface e componentes. |
| TypeScript 5 | Tipagem e organização do código. |
| Vite 6 | Ambiente de desenvolvimento e compilação. |
| HTML5 | Estruturação da aplicação. |
| CSS3 | Estilização e apresentação visual. |
| Lucide React | Biblioteca de ícones. |
| Google Gemini API | Integração com inteligência artificial generativa. |
| Web Speech API | Reconhecimento de fala. |
| SpeechSynthesis API | Conversão de texto em áudio. |
| npm | Gerenciamento de dependências. |

## 5. Arquitetura do sistema

A aplicação apresenta uma arquitetura web predominantemente concentrada no front-end, organizada por meio de componentes React e serviços desenvolvidos em TypeScript.

A estrutura contempla a separação entre a interface, os estilos visuais e o serviço responsável pela comunicação com a inteligência artificial.

### Principais componentes

- **App.tsx:** componente principal, responsável pela interface, navegação e gerenciamento dos estados da aplicação.
- **main.tsx:** ponto de entrada e inicialização da aplicação React.
- **styles.css:** organização dos estilos e elementos visuais.
- **gemini.ts:** serviço responsável pela comunicação com a API do Google Gemini e pelo gerenciamento das respostas locais de contingência.
- **vite.config.ts:** configuração do ambiente de desenvolvimento e compilação.

A versão apresentada constitui um protótipo acadêmico e não contempla um back-end próprio, banco de dados ou sistema de autenticação de usuários.

### Diagrama de arquitetura

![Arquitetura do ConectaIA](./Arquitetura%20do%20Projeto%20Conecta.IA.png)

### Fluxos e modelagem

A modelagem do sistema está documentada nos arquivos disponibilizados no repositório, contemplando requisitos, casos de uso, fluxos de navegação e diagramas.

## 6. Organização do repositório

```text
PROJETO-4-ENGENHARIA-DE-SOFTWARE/
│
├── .gitignore
├── LICENSE
├── README.md
│
├── ConectaIA_Proto1/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   │
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── styles.css
│       └── services/
│           └── gemini.ts
│
├── Arquitetura_e_Diagrama.md
├── Casos_de_Uso_e_Fluxos.md
├── Fluxos_e_Diagramas.md
├── Requisitos_e_Rastreabilidade.md
│
├── Plano_de_Testes.xlsx
├── TESTES_USUARIOS.xlsx
│
├── Arquitetura do Projeto Conecta.IA.png
└── mermaid-diagram.png
```

## 7. Requisitos para execução

Para executar o projeto em ambiente local, são necessários:

- Node.js instalado.
- npm para gerenciamento de dependências.
- Navegador atualizado.
- Conexão com a internet para instalação das dependências e utilização da integração com o Gemini.

## 8. Instalação e execução

### 8.1. Clonar o repositório

Abra o terminal ou PowerShell e execute:

```bash
git clone https://github.com/gabrielvendasrocha-boop/PROJETO-4---ENGENHARIA-DE-SOFTWARE---FESP-PR.git
```

Entre na pasta do projeto:

```bash
cd PROJETO-4---ENGENHARIA-DE-SOFTWARE---FESP-PR
```

### 8.2. Acessar a aplicação

```bash
cd ConectaIA_Proto1
```

### 8.3. Instalar as dependências

```bash
npm install
```

Caso o PowerShell apresente restrições na execução do npm, utilize:

```powershell
npm.cmd install
```

### 8.4. Executar a aplicação

```bash
npm run dev
```

Após a inicialização, o Vite disponibilizará um endereço local, normalmente:

```text
http://localhost:5173/
```

Acesse esse endereço no navegador para utilizar a aplicação.

### 8.5. Gerar a compilação de produção

```bash
npm run build
```

Para visualizar a versão compilada:

```bash
npm run preview
```

## 9. Segurança e privacidade

A segurança constitui um aspecto essencial para a utilização responsável de ferramentas digitais e de inteligência artificial.

O ConectaIA apresenta orientações relacionadas à proteção de informações pessoais, prevenção de golpes e utilização consciente dos recursos tecnológicos.

A integração com o Google Gemini exige atenção especial ao gerenciamento de credenciais.

**Importante:** chaves de API não devem ser publicadas no repositório nem incorporadas diretamente ao código disponibilizado ao navegador. O uso de variáveis com prefixo `VITE_` não garante sigilo, pois seus valores podem ser incorporados à aplicação compilada.

Para disponibilização pública, recomenda-se implementar uma camada de back-end responsável por proteger as credenciais e intermediar as requisições ao serviço externo.

As interações com a inteligência artificial podem envolver o envio de perguntas e histórico de conversa ao provedor externo. Portanto, os usuários devem evitar compartilhar senhas, códigos de autenticação, dados bancários e informações pessoais sensíveis.

As respostas geradas por inteligência artificial podem apresentar imprecisões e devem ser verificadas em fontes confiáveis.

## 10. Documentação acadêmica e testes

O repositório reúne materiais relacionados às etapas de especificação, modelagem e planejamento de validação do sistema.

Entre os documentos disponibilizados estão:

- Arquitetura e diagramas do sistema.
- Casos de uso e fluxos de interação.
- Requisitos funcionais e não funcionais.
- Matriz de rastreabilidade.
- Plano de testes.
- Material de avaliação com usuários.
- Diagramas de representação da solução.

Os documentos de testes apresentam os cenários planejados para avaliação do sistema. A aprovação de cada cenário depende de sua execução e do registro dos respectivos resultados.

## 11. Limitações do protótipo

O ConectaIA encontra-se caracterizado como um protótipo acadêmico, possuindo limitações que devem ser consideradas:

- Dependência de serviços externos para geração de respostas pela inteligência artificial.
- Dependência de compatibilidade do navegador para os recursos de voz.
- Ausência de banco de dados próprio.
- Ausência de autenticação e gerenciamento de usuários.
- Necessidade de evolução da arquitetura de segurança para disponibilização pública da integração com a IA.
- Necessidade de validação sistemática de usabilidade, acessibilidade e desempenho.

Essas limitações representam oportunidades para futuras melhorias e evolução tecnológica.

## 12. Contexto acadêmico

O projeto foi desenvolvido no contexto acadêmico do curso de Bacharelado em Sistemas de Informação, como atividade prática relacionada à disciplina de Engenharia de Software.

**Instituição:** Faculdade de Educação Superior do Paraná (FESPPR).

**Curso:** Bacharelado em Sistemas de Informação.

**Disciplina:** Engenharia de Software.

**Professor:** André Roberto Guerra.

**Projeto:** Projeto 4 — ConectaIA.

## 13. Considerações finais

O ConectaIA representa uma iniciativa de aplicação dos conhecimentos de desenvolvimento de software e inteligência artificial em uma proposta voltada à inclusão social e à democratização do conhecimento tecnológico.

A integração entre recursos educacionais, mecanismos de acessibilidade e inteligência artificial generativa demonstra o potencial das soluções computacionais para ampliar a autonomia dos indivíduos e reduzir barreiras relacionadas à utilização das tecnologias digitais.

Além de seu caráter tecnológico, o projeto evidencia a importância de considerar as necessidades dos usuários, a experiência de utilização, a segurança da informação e a responsabilidade no desenvolvimento de sistemas inteligentes.

Dessa forma, o ConectaIA constitui uma base acadêmica para estudos, aprimoramentos e futuras evoluções direcionadas à construção de ambientes digitais mais acessíveis, inclusivos e seguros.

---

**ConectaIA — Tecnologia, conhecimento e inclusão digital.**

Projeto acadêmico desenvolvido no âmbito da Engenharia de Software.

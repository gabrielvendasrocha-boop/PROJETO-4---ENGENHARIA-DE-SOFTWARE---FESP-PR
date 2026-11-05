# Requisitos e matriz de rastreabilidade — ConectaIA

## 1. Nota de interpretação

Os requisitos abaixo formalizam o escopo documentado do protótipo reconstruído. Onde a implementação ainda não foi executada e verificada pelo responsável pela entrega, o status deve permanecer “A verificar”. A existência de um requisito não prova que a funcionalidade está correta.

## 2. Requisitos funcionais

| ID | Requisito | Critério de aceite observável | Prioridade sugerida | Teste |
|---|---|---|---|---|
| RF01 | Apresentar boas-vindas ao abrir a aplicação | Tela inicial aparece sem erro bloqueante | Alta | T02 |
| RF02 | Permitir avançar para o painel | A ação de continuar abre o painel | Alta | T03 |
| RF03 | Apresentar opções de navegação para as áreas existentes | Cada opção abre a área correspondente | Alta | T03 |
| RF04 | Permitir inserir e enviar texto na conversa | A mensagem enviada aparece na interface | Alta | T04 |
| RF05 | Responder à conversa com conteúdo demonstrativo | Uma resposta predefinida é apresentada; a natureza simulada fica clara | Alta | T04, T13 |
| RF06 | Exibir feedback de estado durante a interação | Os estados visuais previstos aparecem de modo compreensível | Média | T05 |
| RF07 | Disponibilizar conteúdo “Sobre a IA” | A área abre e apresenta o conteúdo previsto | Média | T07 |
| RF08 | Disponibilizar “Trilhas de Sucesso” | A área abre e permite visualizar o conteúdo | Média | T08 |
| RF09 | Disponibilizar controles de acessibilidade presentes no código | Cada controle muda o comportamento visual/de leitura conforme o rótulo | Alta | T09 |
| RF10 | Oferecer leitura em voz alta, quando suportada | O navegador tenta ler o texto selecionado/definido; limitações são informadas | Média | T06 |
| RF11 | Disponibilizar área de ajuda | A área abre e explica as opções disponíveis | Alta | T12 |
| RF12 | Informar limites da simulação | A interface/documentação não dá a entender que existe IA real ou serviço de emergência | Alta | T13 |

## 3. Requisitos não funcionais

| ID | Requisito | Como verificar | Teste |
|---|---|---|---|
| RNF01 | Legibilidade | Avaliar tamanho, espaçamento, zoom e leitura em telas previstas | T09, T11 |
| RNF02 | Navegação por teclado | Percorrer controles com Tab, Shift+Tab, Enter e Espaço | T10 |
| RNF03 | Foco visível | Confirmar que o elemento focado pode ser identificado visualmente | T10 |
| RNF04 | Contraste adequado | Medir as combinações de cor relevantes com ferramenta apropriada | T09 |
| RNF05 | Feedback compreensível | Verificar se as ações geram resposta observável e coerente | T03–T05 |
| RNF06 | Transparência sobre capacidades | Conferir textos, botões e documentação contra capacidades realmente implementadas | T13 |
| RNF07 | Privacidade | Confirmar que a demonstração não solicita dados sensíveis desnecessários | Revisão manual |
| RNF08 | Responsividade | Testar larguras de janela e zoom representativos | T11 |
| RNF09 | Compatibilidade de fala | Testar síntese de fala nos navegadores previstos e registrar diferenças | T06 |
| RNF10 | Manutenibilidade documental | Confirmar consistência entre código, README, requisitos, testes e slides | Revisão final |

## 4. Regras de negócio e restrições

- RB01: respostas de conversa devem ser tratadas como demonstrativas, não como respostas geradas por IA real.
- RB02: a leitura em voz alta depende de suporte do navegador; a interface não deve prometer disponibilidade universal.
- RB03: a área de ajuda não deve ser descrita como serviço de emergência sem integração comprovada.
- RB04: não afirmar persistência de dados sem evidência no código e teste.
- RB05: os resultados de testes só podem ser marcados como aprovados/reprovados após execução real.
- RB06: não coletar dados pessoais sensíveis para demonstrar o protótipo.

## 5. Matriz de rastreabilidade

| Requisito | Caso de uso | Teste relacionado |
|---|---|---|
| RF01 | UC01 | T02 |
| RF02–RF03 | UC02 | T03 |
| RF04–RF06 | UC03 | T04, T05 |
| RF07 | UC05 | T07 |
| RF08 | UC06 | T08 |
| RF09 | UC07 | T09, T10, T11 |
| RF10 | UC04 | T06 |
| RF11 | UC08 | T12 |
| RF12 | Transversal | T13 |

## 6. Requisitos não funcionais que exigem avaliação específica

Contraste, acessibilidade, responsividade e compatibilidade devem ser avaliados no ambiente real. Não é suficiente declarar “acessível” apenas porque há botões de fonte ou contraste. A conformidade com WCAG ou outra norma só deve ser afirmada após uma avaliação documentada, com escopo e método apropriados.

## 7. Estado de verificação

| Situação | Significado |
|---|---|
| A verificar | Comportamento precisa ser conferido no código/execução |
| Pendente | Teste ainda não foi executado |
| Aprovado | Teste executado e critério atendido; evidência registrada |
| Reprovado | Teste executado e critério não atendido; defeito registrado |
| Bloqueado | Não foi possível executar; motivo registrado |

Não preencher estados com base em expectativa.

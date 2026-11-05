# Casos de uso e fluxos — ConectaIA

## UC01 — Iniciar aplicação
- **Ator primário:** pessoa usuária.
- **Objetivo:** acessar a interface.
- **Pré-condições:** aplicação executando e endereço disponível.
- **Fluxo principal:** abrir o endereço local; aguardar carregamento; visualizar boas-vindas.
- **Alternativas:** se a tela não carregar, registrar erro do navegador/terminal.
- **Pós-condição:** tela inicial disponível.
- **Critério de sucesso:** conteúdo inicial visível sem erro bloqueante.

## UC02 — Acessar painel
- **Ator primário:** pessoa usuária.
- **Objetivo:** encontrar as áreas disponíveis.
- **Pré-condições:** tela inicial carregada.
- **Fluxo principal:** acionar a opção de continuar; visualizar o painel; identificar as áreas.
- **Alternativas:** se o controle não responder, registrar defeito.
- **Pós-condição:** painel exibido.
- **Critério de sucesso:** opções disponíveis têm rótulos compreensíveis.

## UC03 — Enviar mensagem na conversa
- **Ator primário:** pessoa usuária.
- **Objetivo:** experimentar a interação textual.
- **Pré-condições:** painel acessível e área de conversa disponível.
- **Fluxo principal:** abrir conversa; inserir mensagem não sensível; enviar; observar a resposta predefinida.
- **Alternativas:** mensagem vazia; resposta genérica; ausência de resposta; qualquer caso deve ser registrado.
- **Pós-condição:** a interface mostra a mensagem e a resposta demonstrativa, conforme a implementação.
- **Critério de sucesso:** o envio é visível e a natureza simulada da resposta não é ocultada.
- **Limite:** não se trata de conversa com modelo de IA externo.

## UC04 — Ouvir conteúdo
- **Ator primário:** pessoa usuária.
- **Objetivo:** ouvir conteúdo por síntese de fala.
- **Pré-condições:** navegador com suporte à síntese de fala e dispositivo com saída de áudio, quando necessário.
- **Fluxo principal:** acionar leitura; navegador tenta sintetizar o texto.
- **Alternativas:** recurso indisponível, voz ausente ou áudio bloqueado; pessoa continua usando leitura visual.
- **Pós-condição:** texto pode ser lido em voz alta, se suportado.
- **Critério de sucesso:** recurso funciona no ambiente de teste ou a indisponibilidade fica documentada.

## UC05 — Conhecer a IA
- **Ator primário:** pessoa usuária.
- **Objetivo:** ler uma explicação introdutória.
- **Pré-condições:** navegação principal disponível.
- **Fluxo principal:** abrir “Sobre a IA”; ler conteúdo; retornar à navegação.
- **Pós-condição:** conteúdo explicativo apresentado.
- **Critério de sucesso:** linguagem compreensível e sem promessas de capacidade não implementada.

## UC06 — Explorar Trilhas de Sucesso
- **Ator primário:** pessoa usuária.
- **Objetivo:** explorar conteúdo demonstrativo de aprendizagem.
- **Pré-condições:** navegação principal disponível.
- **Fluxo principal:** abrir a área de trilhas; visualizar o conteúdo; retornar à navegação.
- **Pós-condição:** área apresentada.
- **Critério de sucesso:** conteúdo pode ser visualizado e a navegação não fica bloqueada.
- **Limite:** não afirmar progresso salvo sem comprovação.

## UC07 — Ajustar acessibilidade
- **Ator primário:** pessoa usuária.
- **Objetivo:** adaptar a visualização ou leitura.
- **Pré-condições:** controle de acessibilidade presente e funcional.
- **Fluxo principal:** abrir controles; alterar uma opção; observar mudança; testar retorno ao estado anterior quando disponível.
- **Alternativas:** controle não produz efeito ou não é reversível; registrar defeito.
- **Pós-condição:** configuração refletida na interface conforme o comportamento implementado.
- **Critério de sucesso:** rótulo, efeito e comportamento são coerentes.
- **Limite:** controles não comprovam, por si só, conformidade formal de acessibilidade.

## UC08 — Consultar ajuda
- **Ator primário:** pessoa usuária.
- **Objetivo:** localizar orientação sobre a interface.
- **Pré-condições:** área de ajuda disponível.
- **Fluxo principal:** acionar “Ajuda” ou “Socorro”; ler orientação; retornar à navegação.
- **Pós-condição:** conteúdo de ajuda exibido.
- **Critério de sucesso:** instruções claras e ausência de alegação falsa de contato com emergência.

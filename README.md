# Front-end Amethyst — Plugin Frontend para LuaTools Amethyst

Fork do plugin frontend injetado na Steam Store, parte do ecossistema **LuaTools Amethyst**. Este repositório entrega apenas a camada frontend/backend-relay do plugin (`public/` + `backend/` + `plugin.json`); o app desktop LuaTools é o backend real.

**Versão do fork:** `v1.3.0` (tags Git — veja [Bump de versão](#bump-de-versão)).

## Estado atual

Funcional sob **Millennium** (injeção `add_browser_js`/`add_browser_css`) e sob o loader clássico não-Millennium ("LTSP"), que usa o `CefInjectorService` do app LuaTools para poll via CDP na página injetada.

Principais correções e melhorias aplicadas nos últimos commits:

- **Overhaul de UI/UX (`v1.3.0`):** Design System Amethyst centralizado (`LT_DESIGN` e variáveis `--lt-*` em `:root`), modais responsivos e centralizados (`.lt-modal` com glassmorphism `backdrop-filter: blur()`, `max-width` seguro e `overflow-y: auto`), substituição integral do FontAwesome CDN por 14 ícones SVG inline (`getSvgIcon`), remoção do `<link>` quebrado para `themes/original.css`, micro-interações suaves com suporte a `prefers-reduced-motion` e acessibilidade reforçada (`:focus-visible`, `role="dialog"`, `aria-live` e suporte a teclado/gamepad na lista de fontes).
- **Resiliência do Header na Store Home (Steam 01/11/2026):** suporte ao novo container React `v7menu` (`.rQfSdlfLw8O-` e fallbacks estruturais via `[href*="/wishlist"]`/`[href*="/cart"]`), guarda de DOM precoce (`document.head`/`document.body`) nas IIFEs e desacoplamento do `window.__LuaToolsReady`.
- **Visual Amethyst:** paleta azul-Steam do tema `original` substituída por violeta/lavanda de ametista (sem mudança de layout, espaçamento ou lógica). Backdrop dos overlays corrigido (véu violeta com blur) e contraste WCAG validado (pior caso de texto 4.81:1, pior caso de UI 3.52:1).
- Detecção de SPA (mudança de rota sem reload) corrigida.
- Fallback de âncora de cabeçalho quando o alvo original não está presente no DOM.
- Labels construídos via DOM em vez de innerHTML (evita XSS e melhora a11y).
- Ajustes de acessibilidade (`aria-*`, foco, leitura por leitor de tela).
- Remoção de caminhos de código mortos, diagnósticos restaurados, coerência de tema.

### Pendências conhecidas

- **Handlers Lua ausentes:** `luatools.js` chama `OpenExternalUrl` e `CheckForUpdatesNow` via `Millennium.callServerMethod`, mas [`backend/main.lua`](backend/main.lua) não define essas funções globais. O botão do Discord e a checagem manual de updates falham silenciosamente.
- **Sistema de temas inerte:** `public/themes/themes.json` define 11 temas, mas apenas `original` é aplicado no modo LTSP — os outros 10 estão presentes no bundle sem forma conhecida de serem selecionados.
- **Assets possivelmente mortos:** `public/themes/`, `public/luatools-icon.png` e `public/steamdb-webkit.css` aguardam confirmação de uso real no modo LuaLoader antes de serem removidos.
- **56 erros `TS2339`** no typecheck — backlog de tipagem (o bundle é JS puro checado via `// @ts-check`; `types/millennium.d.ts` ainda não cobre toda a API). Sem impacto em runtime.

## Estrutura do repositório

```
plugin.json              # manifesto do plugin (schema Millennium)
backend/
  main.lua                # stub injetor: copia webkit files, relay HTTP para o app (127.0.0.1:6767)
  paths.lua
  steam_utils.lua
  plugin_logger.lua
public/
  luatools.js              # bundle frontend injetado na Steam (JS puro)
  steamdb-webkit.css
  luatools-icon.png
  themes/                  # 11 temas (themes.json + 10 .css) — ver Pendências
scripts/
  package-plugin.ps1        # gera plugin.zip a partir de plugin.json + backend/ + public/
package.json               # dev-only: typecheck/verify, nada aqui é empacotado
tsconfig.json               # dev-only
types/
  millennium.d.ts            # dev-only
```

## Como funciona

1. O app desktop LuaTools baixa/instala o `plugin.zip` deste release.
2. No load, `backend/main.lua` chama `copy_webkit_files()`, que copia `luatools.js` e `steamdb-webkit.css` de `public/` para `<Steam>/steamui/webkit/`.
3. Sob Millennium, `inject_webkit_files()` registra os arquivos via `add_browser_js`/`add_browser_css`. Sob o loader LTSP, a injeção equivalente é feita pelo `CefInjectorService` do app desktop.
4. `backend/main.lua` funciona como relay HTTP: cada RPC chamada de `luatools.js` (`Millennium.callServerMethod("luatools", "<Nome>", args)`) é repassada para a API do app desktop em `http://127.0.0.1:6767`.

## Instalação para teste

**Opção A — pacote completo:**

```powershell
scripts\package-plugin.ps1
```

Substitua o `plugin.zip` gerado na pasta de instalação do LuaTools (tipicamente `%LOCALAPPDATA%\LuaTools\`).

**Opção B — iteração rápida (só frontend):**

Copie `public/luatools.js` (e `steamdb-webkit.css`, se alterado) diretamente para `<Steam>\steamui\webkit\` e reinicie a Steam.

## Build e validação

```bash
node --check public/luatools.js        # sintaxe JS
npx tsc --noEmit -p tsconfig.json       # typecheck (56 erros TS2339 conhecidos, ver Pendências)
npm run verify                          # roda os dois acima em sequência
```

## Bump de versão

O `plugin.json` mantém o `version` herdado do LuaTools upstream (`9.0.1`) e não é alterado por este fork. O versionamento deste fork é feito via **tag Git**:

- `v1.0.0` — commit inicial do fork.
- `v1.1.0` — melhorias visuais e correções listadas em [Estado atual](#estado-atual).
- `v1.2.0` — visual Amethyst (roxo suave) aplicado ao tema padrão.
- `v1.2.1` — restaura ícone do header na Store Home após atualização da Steam (novo seletor React `v7menu` e guardas de DOM).
- `v1.3.0` — overhaul de UI/UX (glassmorphism, Design System Amethyst, SVGs inline sem CDN externo, responsividade e acessibilidade).

## Licença

Não definida ainda.

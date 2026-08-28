// Ambient declarations for the externals public/luatools.js talks to.
// Dev-only: nothing here is emitted or shipped.

/** RPC bridge injected by Millennium (or, in LuaLoader mode, by the CDP polyfill). */
interface MillenniumBridge {
  callServerMethod(
    plugin: string,
    method: string,
    args?: Record<string, unknown>,
  ): Promise<unknown>;
}

/** One entry of DEFAULT_THEMES / themes.json. */
interface LuaToolsTheme {
  value?: string;
  key?: string;
  name?: string;
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgHover: string;
  bgContainer: string;
  bgContainerGradient?: string;
  accent: string;
  accentLight: string;
  accentDark?: string;
  border: string;
  borderHover: string;
  text: string;
  textSecondary: string;
  gradient: string;
  gradientLight: string;
  shadow: string;
  shadowHover: string;
}

/** Envelope every bridge method resolves to (or a JSON string of one). */
interface LuaToolsRpcResult {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

/** Published by the gamepad IIFE at the top of luatools.js. */
interface GamepadNavApi {
  scanElements(): void;
  isConnected(): boolean;
}

interface Window {
  Millennium: MillenniumBridge;
  GamepadNav?: GamepadNavApi;
  __LUATOOLS_IS_BIG_PICTURE__?: boolean;
  __LuaToolsSettings?: { values?: Record<string, Record<string, unknown>> };
  __LuaToolsCurrentAppId?: number;
  __LuaToolsButtonInserted?: boolean;
  __LuaToolsGameAdded?: boolean;
  __LuaToolsRestartInserted?: boolean;
  __LuaToolsIconInserted?: boolean;
  __LuaToolsHeaderInserted?: boolean;
  __LuaToolsInjected?: boolean;
  __LuaToolsReady?: boolean;
  __LuaToolsLastUrl?: string;
  /** Set once the pushState/replaceState wrappers are installed, so a re-injection
   *  of luatools.js into a live page can't stack a second layer of wrappers. */
  __LuaToolsHistoryPatched?: boolean;
  __LuaToolsOrderObserver?: MutationObserver | null;
  __LuaToolsOrderObservedEl?: Element | null;
  __LuaToolsPresenceCheckInFlight?: boolean;
  __LuaToolsPresenceCheckAppId?: number | undefined;
  __LuaToolsPresenceCheckAt?: number;
}

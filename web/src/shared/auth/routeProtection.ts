// Util para definir patrones de rutas protegidas y comprobar coincidencias simples
// Soporta patrones con `**` (multi-segmento) y `*` (un segmento)

const defaultProtectedPatterns = ["/admin/**"];

let protectedPatterns = [...defaultProtectedPatterns];

function escapeRegex(s: string) {
  return s.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");
}

function patternToRegex(pattern: string) {
  // Normaliza: asegura que empiece con /
  if (!pattern.startsWith("/")) pattern = "/" + pattern;

  // Primera fase: sustituir comodines por marcadores temporales
  // para evitar que sean escapados por escapeRegex
  const withMarkers = pattern.replace(/\*\*/g, "__DOUBLE_WILDCARD__").replace(/\*/g, "__SINGLE_WILDCARD__");

  // Escapar el resto de caracteres que tienen significado en regex
  const escaped = escapeRegex(withMarkers);

  // Reemplazar los marcadores por sus equivalentes en regex
  const replaced = escaped
    .replace(/__DOUBLE_WILDCARD__/g, ".*")
    .replace(/__SINGLE_WILDCARD__/g, "[^/]*");

  // Anclar inicio y fin
  return new RegExp("^" + replaced + "$");
}

let _compiled: RegExp[] | null = null;

function compilePatterns() {
  _compiled = protectedPatterns.map((p) => patternToRegex(p));
}

export function setProtectedPatterns(patterns: string[]) {
  protectedPatterns = patterns.slice();
  _compiled = null;
}

export function addProtectedPattern(pattern: string) {
  protectedPatterns.push(pattern);
  _compiled = null;
}

export function getProtectedPatterns() {
  return protectedPatterns.slice();
}

export function isProtectedPath(pathname: string | null | undefined) {
  if (!pathname) return false;
  if (!_compiled) compilePatterns();
  if (!_compiled) return false;
  // Asegurar que pathname empiece con /
  const p = pathname.startsWith("/") ? pathname : "/" + pathname;
  return _compiled.some((rx) => rx.test(p));
}

const routeProtection = {
  setProtectedPatterns,
  addProtectedPattern,
  getProtectedPatterns,
  isProtectedPath,
};

export default routeProtection;

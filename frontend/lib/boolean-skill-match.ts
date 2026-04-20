/**
 * Boolean skill-query parser and matcher.
 *
 * Accepts expressions like:
 *   React AND (Node OR Python) NOT Java
 *   "machine learning" OR "deep learning"
 *   React Node                     (implicit AND)
 *
 * Operators (case-insensitive): AND, OR, NOT. Parentheses group.
 * Terms can be quoted with "..." to preserve spaces.
 *
 * Usage:
 *   const pred = compileSkillQuery('React AND (Node OR Python)')
 *   const matches = pred(studentSkillSet)  // studentSkillSet: Set<string> (lowercased)
 *
 * If the query is a plain comma-separated list (no operators, no parens, no quotes),
 * `compileSkillQuery` treats it as AND over the comma-split terms — preserving legacy
 * CSV behaviour.
 */

export type SkillPredicate = (skills: Set<string>) => boolean

interface Token {
  type: 'AND' | 'OR' | 'NOT' | 'LPAREN' | 'RPAREN' | 'TERM'
  value?: string
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const n = input.length
  while (i < n) {
    const c = input[i]
    if (c === ' ' || c === '\t' || c === ',') { i++; continue }
    if (c === '(') { tokens.push({ type: 'LPAREN' }); i++; continue }
    if (c === ')') { tokens.push({ type: 'RPAREN' }); i++; continue }
    if (c === '"') {
      // quoted term
      let j = i + 1
      while (j < n && input[j] !== '"') j++
      const value = input.slice(i + 1, j).toLowerCase().trim()
      if (value) tokens.push({ type: 'TERM', value })
      i = j < n ? j + 1 : j
      continue
    }
    // run until whitespace / paren / comma
    let j = i
    while (j < n && !' \t,()'.includes(input[j])) j++
    const raw = input.slice(i, j)
    const upper = raw.toUpperCase()
    if (upper === 'AND') tokens.push({ type: 'AND' })
    else if (upper === 'OR') tokens.push({ type: 'OR' })
    else if (upper === 'NOT' || raw === '-' || raw === '!') tokens.push({ type: 'NOT' })
    else {
      const val = raw.toLowerCase().trim()
      if (val) tokens.push({ type: 'TERM', value: val })
    }
    i = j
  }
  return tokens
}

// Recursive-descent parser. Grammar:
//   expr    := orExpr
//   orExpr  := andExpr ('OR' andExpr)*
//   andExpr := notExpr (('AND' | /*implicit*/) notExpr)*
//   notExpr := 'NOT' atom | atom
//   atom    := '(' expr ')' | TERM

function parse(tokens: Token[]): SkillPredicate {
  let pos = 0

  const peek = () => tokens[pos]
  const consume = () => tokens[pos++]

  const parseAtom = (): SkillPredicate => {
    const t = peek()
    if (!t) return () => false
    if (t.type === 'LPAREN') {
      consume()
      const inner = parseOr()
      if (peek()?.type === 'RPAREN') consume()
      return inner
    }
    if (t.type === 'TERM') {
      consume()
      const term = (t.value || '').toLowerCase()
      return (skills) => skills.has(term)
    }
    // Unexpected token — skip it, return always-true so the query still makes progress
    consume()
    return () => true
  }

  const parseNot = (): SkillPredicate => {
    if (peek()?.type === 'NOT') {
      consume()
      const inner = parseNot()
      return (skills) => !inner(skills)
    }
    return parseAtom()
  }

  const parseAnd = (): SkillPredicate => {
    let left = parseNot()
    while (true) {
      const t = peek()
      if (!t) break
      if (t.type === 'AND') { consume(); const right = parseNot(); left = and(left, right); continue }
      // Implicit AND: terms / NOT / ( follow each other with no operator.
      if (t.type === 'TERM' || t.type === 'NOT' || t.type === 'LPAREN') {
        const right = parseNot(); left = and(left, right); continue
      }
      break
    }
    return left
  }

  const parseOr = (): SkillPredicate => {
    let left = parseAnd()
    while (peek()?.type === 'OR') {
      consume()
      const right = parseAnd()
      left = or(left, right)
    }
    return left
  }

  return parseOr()
}

const and = (a: SkillPredicate, b: SkillPredicate): SkillPredicate => (s) => a(s) && b(s)
const or = (a: SkillPredicate, b: SkillPredicate): SkillPredicate => (s) => a(s) || b(s)

/**
 * Compile a boolean skill-query string into a predicate.
 * Falls back to comma-split AND semantics if the input has no operators/parens.
 */
export function compileSkillQuery(query: string): SkillPredicate | null {
  const trimmed = query.trim()
  if (!trimmed) return null

  const tokens = tokenize(trimmed)
  if (tokens.length === 0) return null

  // Legacy CSV path: if the raw input contains a comma and no operators/parens,
  // treat as AND-list — identical to the old `skills.split(',')` behaviour.
  const hasOperator = /\b(AND|OR|NOT)\b/i.test(trimmed) || trimmed.includes('(') || trimmed.includes(')') || trimmed.includes('"')
  if (!hasOperator && trimmed.includes(',')) {
    const terms = trimmed.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    if (terms.length === 0) return null
    return (skills) => terms.every(t => skills.has(t))
  }

  return parse(tokens)
}

/**
 * Extract the plain list of positive terms from a query, for legacy code paths
 * that pass `skills.hasSome: [...]` to Prisma. This is an approximation — the
 * authoritative filter is `compileSkillQuery(query)` applied after the DB fetch.
 */
export function extractPositiveTerms(query: string): string[] {
  const tokens = tokenize(query)
  const out: string[] = []
  let negateNext = false
  let depth = 0
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t.type === 'LPAREN') { depth++; continue }
    if (t.type === 'RPAREN') { depth = Math.max(0, depth - 1); continue }
    if (t.type === 'NOT') { negateNext = true; continue }
    if (t.type === 'TERM') {
      if (!negateNext && t.value) out.push(t.value)
      negateNext = false
      continue
    }
    negateNext = false
  }
  return Array.from(new Set(out))
}

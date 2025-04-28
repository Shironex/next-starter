import chalk from 'chalk'
import safeStringify from 'safe-stable-stringify'

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success'

interface LogOptions {
  timestamp?: boolean
  formatObjects?: boolean
}

const defaultOptions: LogOptions = {
  timestamp: true,
  formatObjects: true,
}

/**
 * Formatuje obiekt do czytelnej postaci
 */
function formatObject(obj: unknown, indent = 2): string {
  if (obj === null || obj === undefined) return String(obj)

  try {
    return safeStringify(obj, null, indent) || String(obj)
  } catch {
    return String(obj)
  }
}

/**
 * Zwraca aktualny timestamp jako string
 */
function getTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Zwraca zakolorowany prefix na podstawie poziomu logowania
 */
function getColoredPrefix(level: LogLevel): string {
  const timestamp = defaultOptions.timestamp ? `[${getTimestamp()}] ` : ''

  switch (level) {
    case 'debug':
      return chalk.gray(`${timestamp}[DEBUG]`)
    case 'info':
      return chalk.blue(`${timestamp}[INFO]`)
    case 'warn':
      return chalk.yellow(`${timestamp}[WARN]`)
    case 'error':
      return chalk.red(`${timestamp}[ERROR]`)
    case 'success':
      return chalk.green(`${timestamp}[SUCCESS]`)
    default:
      return chalk.white(`${timestamp}[LOG]`)
  }
}

/**
 * Przetwarza i formatuje argumenty do wyświetlenia
 */
function processArgs(level: LogLevel, args: unknown[]): string[] {
  return args.map((arg) => {
    if (
      typeof arg === 'object' &&
      arg !== null &&
      defaultOptions.formatObjects
    ) {
      return formatObject(arg)
    }

    return String(arg)
  })
}

/**
 * Główna funkcja logująca
 */
function logWithLevel(level: LogLevel, ...args: unknown[]): void {
  const prefix = getColoredPrefix(level)
  const processedArgs = processArgs(level, args)

  console.log(prefix, ...processedArgs)
}

/**
 * Logger z różnymi poziomami logowania
 */
export const logger = {
  /**
   * Ustawia globalne opcje dla loggera
   */
  setOptions(options: Partial<LogOptions>): void {
    Object.assign(defaultOptions, options)
  },

  /**
   * Loguje wiadomość na poziomie DEBUG
   */
  debug(...args: unknown[]): void {
    logWithLevel('debug', ...args)
  },

  /**
   * Loguje wiadomość na poziomie INFO
   */
  info(...args: unknown[]): void {
    logWithLevel('info', ...args)
  },

  /**
   * Loguje wiadomość na poziomie WARN
   */
  warn(...args: unknown[]): void {
    logWithLevel('warn', ...args)
  },

  /**
   * Loguje wiadomość na poziomie ERROR
   */
  error(...args: unknown[]): void {
    logWithLevel('error', ...args)
  },

  /**
   * Loguje wiadomość na poziomie SUCCESS
   */
  success(...args: unknown[]): void {
    logWithLevel('success', ...args)
  },
}

export default logger

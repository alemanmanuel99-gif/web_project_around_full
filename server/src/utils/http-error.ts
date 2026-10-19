// Crea un error con código de estado para que lo responda el manejador central
export const httpError = (statusCode: number, message: string) =>
  Object.assign(new Error(message), { statusCode });

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  console.error('❌ Erro:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      statusCode: 400,
      message: `Erro de validação: ${message}`
    };
  }

  // Erro de cast do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    error = {
      statusCode: 400,
      message: 'ID inválido fornecido'
    };
  }

  // Erro de duplicação (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      statusCode: 400,
      message: `${field} já existe no sistema`
    };
  }

  // Erro de sintaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = {
      statusCode: 400,
      message: 'JSON inválido no corpo da requisição'
    };
  }

  // Erro de limite de tamanho
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      statusCode: 400,
      message: 'Arquivo muito grande'
    };
  }

  // Erro de rate limiting
  if (err.status === 429) {
    error = {
      statusCode: 429,
      message: 'Muitas requisições. Tente novamente mais tarde.'
    };
  }

  // Erro de CORS
  if (err.message && err.message.includes('CORS')) {
    error = {
      statusCode: 403,
      message: 'Acesso não permitido'
    };
  }

  // Status code padrão
  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Erro interno do servidor';

  // Resposta de erro
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err.message
    })
  });
};

module.exports = errorHandler; 
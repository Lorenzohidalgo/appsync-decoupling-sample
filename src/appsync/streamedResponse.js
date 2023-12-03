export function request(ctx) {
  const {
    streamedResponseInput: { sessionId, messageId, completed, response },
  } = ctx.args;

  runtime.earlyReturn({
    sessionId,
    messageId,
    completed,
    response,
  });
}

export function response(ctx) {
  return ctx.result;
}

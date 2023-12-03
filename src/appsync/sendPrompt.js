import { util } from "@aws-appsync/utils";

const accountId = "#accountId#";
const queueName = "#queueName#";

export function request(ctx) {
  const { userPrompt } = ctx.args;

  const msgBody = {
    ...userPrompt,
    messageId: util.autoId(),
  };

  ctx.stash.msgBody = msgBody;

  return {
    version: "2018-05-29",
    method: "POST",
    resourcePath: `/${accountId}/${queueName}`,
    params: {
      body: `Action=SendMessage&Version=2012-11-05&MessageBody=${JSON.stringify(
        msgBody
      )}`,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    },
  };
}

export function response(ctx) {
  const { result, error } = ctx;

  if (error) {
    util.error(error.message);
  }

  if (result.statusCode !== 200) {
    util.error(result.body);
  }

  return ctx.stash.msgBody;
}

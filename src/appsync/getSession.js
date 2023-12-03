import { util } from '@aws-appsync/utils';

export function request() {
  runtime.earlyReturn(util.autoId());
}

export function response(ctx) {
  return ctx.result;
}

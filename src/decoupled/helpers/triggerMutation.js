import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';

const { Sha256 } = crypto;

const { GRAPHQL_ENDPOINT, REGION } = process.env;

const mutation = `
mutation MyOperation($streamedResponseInput: StreamedResponseInput!) {
    streamedResponse(streamedResponseInput: $streamedResponseInput) {
      completed
      messageId
      response
      sessionId
    }
  }
`;

export const triggerMutation = async (promptInput) => {
  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: REGION,
    service: "appsync",
    sha256: Sha256,
  });

  const { messageId, sessionId } = promptInput;

  const variables = {
    streamedResponseInput: {
      sessionId,
      messageId,
      completed: true,
      response: "Async Process Completed",
    },
  };

  const requestToBeSigned = new HttpRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      host: endpoint.host,
    },
    hostname: endpoint.host,
    body: JSON.stringify({ query: mutation, variables }),
    path: endpoint.pathname,
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(GRAPHQL_ENDPOINT, signed);

  await fetch(request);
};

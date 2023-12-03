import { triggerMutation } from "./helpers/triggerMutation";

export const handler = async (event, _, __) => {
  const promptInput = JSON.parse(event.Records[0].body);
  await triggerMutation(promptInput);
};

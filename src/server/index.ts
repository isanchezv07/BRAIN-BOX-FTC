import { SYSTEM_PROMPT as inspire } from './prompts/inspirePrompt';
import { SYSTEM_PROMPT as think } from './prompts/thinkPrompt';
import { SYSTEM_PROMPT as connect } from './prompts/connectPrompt';
import { SYSTEM_PROMPT as innovate } from './prompts/innovatePrompt';
import { SYSTEM_PROMPT as control } from './prompts/controlPrompt';
import { SYSTEM_PROMPT as design } from './prompts/designPrompt';
import { SYSTEM_PROMPT as reach } from './prompts/reachPrompt';
import { SYSTEM_PROMPT as sustain } from './prompts/sustainPrompt';
import { SYSTEM_PROMPT as world } from './prompts/aiPrompt';

export const PROMPT_MAP: Record<string, string> = {
  "Inspire Award": inspire,
  "Nivel World Champion": world,
  "Think Award": think,
  "Connect Award": connect,
  "Innovate Award (RTX)": innovate,
  "Control Award": control,
  "Design Award": design,
  "Reach Award": reach,
  "Sustain Award": sustain,
};
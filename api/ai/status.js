import { handleAI } from '../../worker/api.js';

export default {
  fetch(request) {
    return handleAI(request, process.env);
  }
};

import {handleAI} from '../worker/api.js';
const request=new Request('https://tuonta.example/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:'Using only this material, write two clear study notes: Mitochondria release energy from glucose through cellular respiration. Ribosomes make proteins.'})});
const response=await handleAI(request,process.env);const result=await response.json();console.log(JSON.stringify({status:response.status,...result}));if(!response.ok)process.exitCode=1;

import test from 'node:test';
import assert from 'node:assert/strict';
import {makePlan,relevantChunks} from '../dist/planner.js';
const exams=[{id:'bio',subject:'Biology',date:'2026-12-05',hours:5,difficulty:3},{id:'math',subject:'Math',date:'2026-12-10',hours:4,difficulty:2}];
test('sessions honor daily capacity, requested hours, and exam boundaries',()=>{const plan=makePlan(exams,{start:'2026-12-01',minutes:60});assert.ok(plan.length);const byDay={};for(const s of plan){assert.ok(s.date<exams.find(e=>e.id===s.examId).date);byDay[s.date]=(byDay[s.date]||0)+s.minutes}assert.ok(Object.values(byDay).every(n=>n<=60));for(const e of exams)assert.ok(plan.filter(s=>s.examId===e.id).reduce((n,s)=>n+s.minutes,0)<=e.hours*60)});
test('today and past exams receive no sessions',()=>assert.deepEqual(makePlan(exams,{start:'2026-12-10'}),[]));
test('tight calendar stays within capacity even when targets cannot fit',()=>{const p=makePlan([{...exams[0],date:'2026-12-02',hours:100}],{start:'2026-12-01',minutes:30});assert.equal(p.reduce((n,s)=>n+s.minutes,0),30)});
test('document retrieval prioritizes relevant excerpts',()=>{const text='Cell membranes regulate transport. '.repeat(40)+'Mitochondria release energy during respiration. '.repeat(30);assert.match(relevantChunks(text,'mitochondria respiration',1)[0].content,/Mitochondria/)});

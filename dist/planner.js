export const dayKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const parseDay=s=>new Date(s+'T00:00:00');
export function makePlan(exams,{start=dayKey(new Date()),minutes=90}={}){
 const first=parseDay(start), eligible=exams.filter(e=>e.date>start).sort((a,b)=>a.date.localeCompare(b.date));
 if(!eligible.length)return [];
 const last=parseDay(eligible.at(-1).date),days=Math.min(90,Math.round((last-first)/86400000));
 const total=new Map(),sessions=[];
 for(let i=0;i<days;i++){
  const date=new Date(first);date.setDate(date.getDate()+i);const key=dayKey(date);
  const active=eligible.filter(e=>e.date>key);
  const ranked=active.map(e=>({e,weight:((Number(e.difficulty)||2)*Math.max(1,Number(e.hours)||4)-((total.get(e.id)||0)/60))/Math.max(1,Math.round((parseDay(e.date)-date)/86400000))})).sort((a,b)=>b.weight-a.weight);
  let remaining=Number(minutes);
  for(const {e} of ranked){const done=total.get(e.id)||0,target=(Number(e.hours)||4)*60;if(done>=target||remaining<15)continue;const duration=Math.min(45,remaining,target-done);if(duration<15)continue;
   const until=Math.round((parseDay(e.date)-date)/86400000);sessions.push({id:`${key}-${e.id}`,examId:e.id,date:key,subject:e.subject,topic:e.topics||'Core concepts',minutes:duration,method:until<=2?'Practice & recall':done===0?'Understand & map':'Active recall',done:false});total.set(e.id,done+duration);remaining-=duration;
  }
 }
 return sessions;
}
export function relevantChunks(text,question,max=3){const words=question.toLowerCase().match(/[a-z]{3,}/g)||[];return text.match(/[\s\S]{1,1100}(?:\s|$)/g)?.map((content,i)=>({content,i,score:words.reduce((n,w)=>n+(content.toLowerCase().includes(w)?1:0),0)})).sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,max)||[]}

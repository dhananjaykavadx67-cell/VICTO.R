export default async function handler(req,res){

 if(req.method!=="POST"){
  return res.status(405).json({
   error:"Method not allowed"
  });
 }

 try{

  const {message}=req.body||{};

  if(!message){
   return res.status(400).json({
    error:"No message received"
   });
  }

  const r=await fetch(
   "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
   {
    method:"POST",

    headers:{
     "Content-Type":"application/json",
     "x-goog-api-key":process.env.GEMINI_API_KEY
    },

    body:JSON.stringify({

     systemInstruction:{
      parts:[{
       text:`
You are V.I.C.T.O.R.
Voice-Integrated Intelligent Controller
for Tasks, Operations, and Responses.

You were created by Dhananjay and Kartik
as a school project.

Give short, natural answers.
No markdown.
No emojis.

If asked who created you,
say Dhananjay and Kartik.
`
      }]
     },

     contents:[{
      role:"user",
      parts:[{
       text:message
      }]
     }],

     generationConfig:{
      maxOutputTokens:250
     }

    })
   }
  );

  const data=await r.json();

  if(!r.ok){

   console.error(data);

   return res.status(r.status).json({
    error:"Gemini request failed"
   });

  }

  const text=
   data?.candidates?.[0]?.content?.parts
   ?.map(x=>x.text||"")
   .join("")
   .trim();

  if(!text){

   return res.status(500).json({
    error:"Empty AI response"
   });

  }

  return res.status(200).json({
   text
  });

 }catch(error){

  console.error(error);

  return res.status(500).json({
   error:"Backend error"
  });

 }

}

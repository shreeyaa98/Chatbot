var sendForm = document.querySelector('#chatform'),
textInput = document.querySelector('.chatbox'),
chatList = document.querySelector('.chatlist'),
userBubble = document.querySelectorAll('.userInput'),
botBubble = document.querySelectorAll('.bot__output'),
chatbotButton = document.querySelector(".submit-button")
var input;
var pos=[];
var selected_pos=[];
var types={};
var selected_skills=[];
var questions={};
var positions={};
var accessToken = "2520c2592722445b8d4de82cd407004b";
var baseUrl = "https://api.dialogflow.com/v1/";
var chats_user=new Array();
var chats_bot=new Array();
var pattern="";

function setResponse(val) {
      
      console.log(val);
      var a=JSON.parse(val);
      //console.log(a);
      
      var i=0;

      for(i=0;i<a.result.fulfillment.messages.length;i++){
        
        if(a.result.fulfillment.messages[i].type==0){

          chats_bot.push(a.result.fulfillment.messages[i].type);
        
          pattern+="B";
          respond(a,i);  
        }
        
      }
    }
function send(input) {

  // if(start==0){
  //   console.log("Start is 0");
  //   var text='Hi';
  //   start=1;
  // }
  // else{ 
    text = input;
    console.log("Text is" +input);
    pattern+="U";
      //after some time
      
      chats_user.push(text);
    //}

    $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
        success: function(data) {
          setResponse(JSON.stringify(data, undefined, 2));
        },
        error: function(data) {
          //setResponse("Internal Server Error");
          setResponse(data);
        }
      });
      //setResponse("Loading...");
    }

// $(document).ready(function() {
// 		setTimeout(function(){ 
// 			$('#multiselect').multiselect({
//             buttonWidth: '100px'
//         });
// 		 }, 8000);
        
//     });

    

$(document).ready(function() {
send('Hi');
gather_skills();
gather_positions();
});

sendForm.onkeydown = function(e){
  if(e.keyCode == 13){
    e.preventDefault();
    var input = textInput.value;
    if(input.length > 0) {
      createBubble(input)
    }
  }
};

sendForm.addEventListener('submit', function(e) {
  e.preventDefault();
  input = textInput.value;
  if(input.length > 0) {
    createBubble(input)
  }
});

var createBubble = function(input) {
  textInput.value="";
  var chatBubble = document.createElement('li');
  chatBubble.classList.add('userInput');
  chatBubble.innerHTML = input;
  chatList.appendChild(chatBubble)
  send(input);
}

function check_message(msg){

    if(msg=="Now, what is your field of expertise ?"){

      //create buttons
      return 1;
    }
    else{

      return 0;

    }

}

function gather_skills(){
  
  
    
        $.ajax({

          url: "https://spreadsheets.google.com/feeds/list/1ACXXZiWctlrLT8XzoqLHnnmo8MDnj84Elo1N37REVeQ/3/public/values?alt=json", 
          success: function(result){
              parse_skills(result);

        }});
    }

function parse_skills(data){
  
  var values=[];
  var type=[];
  //console.log(data.feed.entry[i].gsx$type.$t);

  $.each(data.feed.entry,function(i,item){
    //values=[];
    key=data.feed.entry[i].gsx$type.$t;
    //console.log(data.feed.entry[i].gsx$name.$t);
    if(type.indexOf(key)!=-1){

      //console.log("hi");
      values.push(data.feed.entry[i].gsx$name.$t);
      types[key]=values;

    }   
    else{

      values=[];
      values.push(data.feed.entry[i].gsx$name.$t);
      type.push(key);

      }
      //console.log(types);
  });   

  
}
function fun2(i,j){
/*
  var elem=document.getElementById(i);
  elem.onclick = function(){
*/
    $("#"+j+"").toggle();


//  };
}
  function skills(j){
    k=100;
Object.keys(types).forEach(function(key) {

$("#"+k+" option:selected").each(function() {
    selected_skills.push(types[key][($(this).val())]);
});
k+=1;
});
console.log(selected_skills)
send("Skills Taken")
   }

function gather_positions(){
  
  
    
        $.ajax({

          url: "https://spreadsheets.google.com/feeds/list/1WsJLKFcNMrl6sJLZZTIqHRhbAzbj1Cux3IGx9x2j3a0/4/public/values?alt=json", 
          success: function(result){
              parse_positions(result);

        }});
    }

function parse_positions(data){

  var position=[];
  var values=[];
  //console.log(data.feed.entry[i].gsx$type.$t);

  $.each(data.feed.entry,function(i,item){
    
    //questions.push(data.feed.entry[i].gsx$question.$t);
    //values=[];
    key=data.feed.entry[i].gsx$positionname.$t;
    // console.log(key)
    // console.log(data.feed.entry[i].gsx$minimumexperience.$t);
    // console.log(data.feed.entry[i].gsx$jobdescription.$t);
   
    positions[key]={};

      positions[key]["minexp"]=data.feed.entry[i].gsx$minimumexperience.$t;
      positions[key]["skills"]=data.feed.entry[i].gsx$skills.$t;
      positions[key]["description"]=data.feed.entry[i].gsx$jobdescription.$t;


      });
  key=".NET Leader";
  positions[key]={};
  positions[key]["minexp"]="6";
  positions[key]["skills"]="ADO.NET";
  positions[key]["description"]="Description Available";

  console.log(positions);
}


function findpos(years){
var minexp;
var skills=[];

Object.keys(positions).forEach(function(key) {
  flag=0;
  minexp=positions[key]["minexp"]
  str=positions[key]["skills"];
  skills=str.split(", ")
  //console.log(skills)
  if(minexp<=years){
  for(var i in selected_skills)
{
     // console.log(selected_skills[i])
     for(var j in skills){
        if(selected_skills[i]==skills[j])
          { 
            flag=1;
            break;}
     }
      
      if(flag==1){
        pos.push(key)
        break;}
}
}
});
}

function posit(i){
  selected_pos.push(pos[i]);
  var response = document.createElement('li');
  response.classList.add('bot__output');
  response.innerHTML=positions[pos[i]]["description"];
  chatList.appendChild(response);
  chatList.scrollTop = chatList.scrollHeight;
  send("Position Chosen");
}



function respond(e,i) {
  
  var response = document.createElement('li');
  response.classList.add('bot__output');
  msg_by_bot=e.result.fulfillment.messages[i].speech;
  console.log(msg_by_bot);

  

  response.innerHTML = msg_by_bot;
  chatList.appendChild(response);
  chatList.scrollTop = chatList.scrollHeight;
 console.log(e.result.fulfillment.messages.length);
    console.log("Value of i is" +i);
    i=i+1;

  

  

  if(check_message(msg_by_bot)==1){
      response.innerHTML+="<br>";
      i=0;
      j=100;
      
      Object.keys(types).forEach(function(key) {
        
        //console.log(key, types[key]);
        //var x="class=\"selectpicker\" data-style=\"btn-primary\"";
        var s="<button style=\"margin:5px\" id=\""+i+"\" onclick=\"fun2("+i+","+j+")\" class=\"btn btn-info\">"+key+"</button><div id=\""+j+"\" hidden><select id=\"multiselect\" text=\""+key+"\" multiple>";

        //var s = $("<select id=\"selectId\" name=\"selectName\" />");

        k=0;
        for(var val in types[key]) {
            
            //console.log("------------------------------------------------");
            //console.log("Val=" +types[key][val]);

            var option="<option value="+k+">"+types[key][val]+"</option>";
            
            console.log("\noption=" +option);
            s+=option;

            //$("<option />", {value: types[key][val], text: types[key][val]}).appendTo(s);
            
            k+=1;
            //console.log(s);    
        }
        s+="</select></div>";
        
        response.innerHTML+=s;

        //console.log("#"+i+"");
        
        i+=1;
        j+=1;


        //"<a href='javascript:void(0)' onclick='fun1(\""+key+"\")'>"+key+"</a>  ";
      });
     response.innerHTML+="<br>"; 
     str="Submit"; 
     console.log(i,j);
	   b="<button class=\"btn btn-danger\" onclick=\"skills("+j+")\">"+str+"</button>";
 	   response.innerHTML+=b;
  }

    if(e.result.parameters.number!=undefined){
          
          
          years=e.result.parameters.number[0];
           console.log(years);
           response.innerHTML+="<br>";
            findpos(years);
            setTimeout(function(){
              if (pos.length==0){
                console.log("say what")
                str="No jobs available now";
               response.innerHTML="<strong style=\"color:red\">"+str+"</strong>" 
              }
              for(var i in pos)
            {
              console.log("We are here");
              response.innerHTML+="<button style=\"margin:5px\" id=\""+i+"\" class=\"btn btn-info\" onclick=\"posit("+i+")\">"+pos[i]+"</button>";
              response.innerHTML+="<br>"
            }
          },1000);

   }

    if(e.result.metadata.intentName=="View Positions - yes"){
      console.log("Suprisingly worked");
     var flag=0;
     for (var i in pos){
     response.innerHTML+="<br>";
     for (var v in selected_pos){
      if(pos[i]==selected_pos[v]){
            break;
      }
      flag=1;
   response.innerHTML+="<button style=\"margin:1px\" id=\""+i+"\" class=\"btn btn-info\" onclick=\"posit("+i+")\">"+pos[i]+"</button>";
   }
   }
  if(flag==0){
    var str="No More Positions Available";
    response.innerHTML="<strong style=\"color:red\">"+str+"</strong>";
    send("no");
  } 
}
    


}








function gather_questions(){
  
  
    
        $.ajax({

          url: "https://spreadsheets.google.com/feeds/list/1WsJLKFcNMrl6sJLZZTIqHRhbAzbj1Cux3IGx9x2j3a0/1/public/values?alt=json", 
          success: function(result){
              parse_questions(result);

        }});
    }

function parse_questions(data){
  var question=[];
  
  //console.log(data.feed.entry[i].gsx$type.$t);

  $.each(data.feed.entry,function(i,item){
    //values=[];
    key=data.feed.entry[i].gsx$skill.$t;
    //console.log(data.feed.entry[i].gsx$name.$t);
    if(skill.indexOf(key)!=-1){

      //console.log("hi");
      questions[key].push(data.feed.entry[i].gsx$question.$t);

    }   
    else{

      values=[];
      values.push(data.feed.entry[i].gsx$question.$t);
      skill.push(key);
      skills[key]=values;

      }

  });   

  console.log(types);
}





    

    function save_to_firebase(chats){

      var ref = new Firebase('https://chatbot-6160d.firebaseio.com');
      console.log(ref);
      var userRef = ref.child('User1').child('usr2').set('hi');
    }

    function get_from_database(){

      var ref = new Firebase('https://chatbot-6160d.firebaseio.com');
      ref=ref.child('User1');

      ref.on("value", function(snapshot) {
       console.log(snapshot.val());
     }, function (error) {
       console.log("Error: " + error.code);
     });
    }


    // function check_suggestion_chips(a){

    //   var i;
    //   var count=1;  
    //   for(i=0;i<a.result.fulfillment.messages.length;i++){
    //     console.log("Type="+a.result.fulfillment.messages[i].type);
    //     if(a.result.fulfillment.messages[i].type=="suggestion_chips"){
    //       count=0;
    //       break;
    //     } 
    //     else{
    //       count=1;
    //     }


    //   }
    //   console.log('count value'+count);
    //   return count;

    // }

    // function fun1(chip){
    //   //console.log();
    //   console.log('inside fun1');
    //   createBubble(chip);
      
    //   //$("#input").val(chip);
      
    // }
   










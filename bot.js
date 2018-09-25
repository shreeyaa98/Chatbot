var sendForm = document.querySelector('#chatform'),
textInput = document.querySelector('.chatbox'),
chatList = document.querySelector('.chatlist'),
userBubble = document.querySelectorAll('.userInput'),
botBubble = document.querySelectorAll('.bot__output'),
chatbotButton = document.querySelector(".submit-button")
var input;
var pos=[];
var selected_pos;
var applied_pos=[];
var types={};
var selected_skills=[];
var questions={};
var positions={};
var accessToken = "2520c2592722445b8d4de82cd407004b";
var baseUrl = "https://api.dialogflow.com/v1/";
var chats_user=new Array();
var chats_bot=new Array();
var pattern="";
var app=false;
var question_to_ask=[];
var dictionary=new Object();
var selected_posits=[];
var company=false;
var ques=0;
var all_questions=[];
var retreive=[];
var start=0;
var wel=false;
var viewed_posits=[]
var expect_ctc=false;
var last_pos=false;
var error_free=false;
var revive=false;
var revival=0;
var transfer=false;
var uid=0;
var get_transfer=false;





function gather_questions(){
  
  
    
        $.ajax({

          url: "https://spreadsheets.google.com/feeds/list/1WsJLKFcNMrl6sJLZZTIqHRhbAzbj1Cux3IGx9x2j3a0/1/public/values?alt=json", 
          success: function(result){
              parse_questions(result);

        }});
    }

function parse_questions(data){
  //var question=[];
  var skill=[];
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
      questions[key]=values;

      }

  });   

  console.log(questions);
}


function setResponse(val) {
      
      console.log(val);
      var a=JSON.parse(val);
      //console.log(a);
      
      var i=0;

      for(i=0;i<a.result.fulfillment.messages.length;i++){
        
        if(a.result.fulfillment.messages[i].type==0){

          //chats_bot.push(a.result.fulfillment.messages[i].type);
        
          //pattern+="B";
          respond(a,i);  
        }
        
      }
    }

function q(){
 var r=all_questions.pop();
 chats_bot.push(r);
show_human_msg(r);
if(all_questions.length==0){ques=0;
show_human_msg("Please upload your resume");
}


}
function send(input) {

  // if(start==0){
  //   console.log("Start is 0");
  //   var text='Hi';
  //   start=1;
  // }
  // else{ 
    if(ques==1){
      //chat_user.push()
      q();
      text = input;
      pattern+="U";
      chats_user.push(text);
    }
    else{
    text = input;
    console.log("Text is" +input);
    pattern+="U";
      //after some time

      chats_user.push(text);
    //}
    	if(company)
    	{
    		dictionary.CompanyName=text;
    		console.log(dictionary);
    		text="John"
    		company=false;
        	retreive.push(text);
    	} 
      if (wel){
		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(!(text.match(mailformat)))
		{
		  text="Please enter Email"
		}

      }
      if (expect_ctc){
		var mailformat = /\d+/;
		if(!(text.match(mailformat)))
		{
		  text="Expected CTC"
		}
}
	if (get_transfer){

	}
    retreive.push(text)
    console.log("Text is" +input);
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
}
    function generate_uid(length,chars){

      
  
      var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    if(transfer){
      return uid;
    }
    else{
      uid=result;
      transfer=true;
      return result;
    }
    }

    function change_notification(){

      console.log("Inside change Notification");
      var ref = new Firebase('https://jobbot-d8652.firebaseio.com');
      var change_notification=ref.child('Notification').set('1');
      id=generate_uid(16,'#aA');
      console.log(id);

      var check=false;
      ref=ref.child('requests');

      ref.once("value", function(snapshot) {
      no_of_children=snapshot.numChildren();
      console.log("No of children"+no_of_children);

      console.log(check);
      }, function (error) {
       console.log("Error: " + error.code);
       });

        setTimeout(function(){

          if(check==false){
          console.log('Inside if');
          ref.child(id).set(0);
          ref = new Firebase('https://jobbot-d8652.firebaseio.com');
          ref.child('Notification').set('0');

          upload_to_firebase(id);


        }
        else{
          console.log(check);
        }
      },3000);
    }

function check_intent(e){

  console.log("Intent is" +e.result.metadata.intentName);
  if(e.result.metadata.intentName=="Default Fallback Intent"){


    return true;

  }
  return false;
}

function show_human_msg(msg)
{

  var response = document.createElement('li');
  response.classList.add('bot__output');
  msg_by_bot=msg;

  chats_bot.push(msg_by_bot);

  response.innerHTML = msg_by_bot;
  chatList.appendChild(response);
  chatList.scrollTop = chatList.scrollHeight;

}

function send_to_revive(i){

    text=i;
    console.log("Text is send to revive"+text);

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
          console.log("success");
          console.log(JSON.stringify(data, undefined, 2))
          revival+=1
          doSetTimeout(revival)
        },
        error: function(data) {
          //setResponse("Internal Server Error");
        }
      });


}

function send_msg_to_app(msg){

  var ref = new Firebase('https://jobbot-d8652.firebaseio.com');
  x=chats_user.length;
  ref=ref.child(id).child("user").child(""+x).set(msg);
  chats_user.push(msg);
  chatList.scrollTop = chatList.scrollHeight;
    
  }


$(document).ready(function() {
//send_to_revive("Hi");
//setTimeout(function(){send('Hi');},2200);
send("Hi")
gather_skills();
gather_positions();
gather_questions();
//selected_pos=".Net Developer";
//setTimeout(function(){retreive_questions();},1000);

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

  if(app){
    send_msg_to_app(input);
  }
  else{
    send(input);  
  }
  
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
      types[key].push(data.feed.entry[i].gsx$name.$t);
      

    }   
    else{

      values=[];
      values.push(data.feed.entry[i].gsx$name.$t);
      type.push(key);
      types[key]=values;

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
 pattern+="U";
      //after some time
      
      chats_user.push(selected_skills);
      console.log(chats_user);
      dictionary.Skills=selected_skills;
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
  // key=".NET Leader";
  // positions[key]={};
  // positions[key]["minexp"]="6";
  // positions[key]["skills"]="ADO.NET";
  // positions[key]["description"]="Description Available";

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
  selected_pos=pos[i];
  // selected_posits.push(selected_pos);
  viewed_posits.push(pos[i])
  var response = document.createElement('li');
  response.classList.add('bot__output');
  response.innerHTML=positions[pos[i]]["description"];
  chatList.appendChild(response);
  chatList.scrollTop = chatList.scrollHeight;
  chats_user.push(selected_pos);
  pattern+="U";
  if(!last_pos){
  send("Position Viewed");
	}
else{
	send("Apply")
}

}



function respond(e,i) {

  if(check_intent(e)){
    if(start==0){
        console.log("Intent is checked");
        send("Hi");
    }
    else{
    console.log("Pattern is" +pattern);
    console.log("bot list is")
    console.log(chats_bot);
    console.log(chats_user);
    retreive.pop();
    console.log(retreive);
    app=true;
	  var response = document.createElement('li');
	  response.classList.add('bot__output');
	  msg_by_bot=e.result.fulfillment.messages[i].speech;
	  chats_bot.push(msg_by_bot);
	  console.log(msg_by_bot);
	  pattern+="B"
	  response.innerHTML = msg_by_bot;
	  chatList.appendChild(response);
	  chatList.scrollTop = chatList.scrollHeight;
	 	console.log(e.result.fulfillment.messages.length);
	    console.log("Value of i is" +i);
	    i=i+1;

    change_notification();
  }
  }
  else{
    var response = document.createElement('li');
  response.classList.add('bot__output');
  msg_by_bot=e.result.fulfillment.messages[i].speech;
  chats_bot.push(msg_by_bot);

  console.log(msg_by_bot);
  pattern+="B"
  

  response.innerHTML = msg_by_bot;
  chatList.appendChild(response);
  chatList.scrollTop = chatList.scrollHeight;
 console.log(e.result.fulfillment.messages.length);
    console.log("Value of i is" +i);
    i=i+1;


    if (e.result.metadata.intentName=="Default Welcome Intent"){
          console.log("welcome");
              		wel=true;
    }
  
  if(e.result.metadata.intentName=="Default Welcome Intent - custom"){
  			wel=false;
  			dictionary.Email=e.result.parameters.email;
  			start=1
  			//console.log(email);

        }
  

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
            
            // console.log("\noption=" +option);
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

	if(e.result.metadata.intentName=="Skill - no"){
			years=0;
			dictionary.Years=0;
			findpos(years);
            setTimeout(function(){
            	console.log("positions are")
            	console.log(pos)
            	if(pos.length>0){
            		str="Current Jobs Available are:";
               response.innerHTML="<strong style=\"color:red\">"+str+"</strong>";
              for(var i in pos)
            {
              console.log("We are here");
              response.innerHTML+="<button style=\"margin:5px\" id=\""+i+"\" class=\"btn btn-info\" onclick=\"posit("+i+")\">"+pos[i]+"</button>";
              response.innerHTML+="<br>"
            }
        }
        else{
        	console.log("here")
        		response.innerHTML+="<br>"
          }},1000);
        

	}
    if(e.result.metadata.intentName=="Default Welcome Intent - custom - select.number - select.number"){
          
          
          years=e.result.parameters.number[0];
          dictionary.Years=years;
           console.log(years);
           response.innerHTML+="<br>";
            findpos(years);
            setTimeout(function(){
              if (pos.length==0){
                console.log("say what")
                str="No jobs available now. We will get in touch with you if there are any other openings available";
               response.innerHTML="<strong style=\"color:red\">"+str+"</strong>";
               // send("no"); 
              }
              else{
              for(var i in pos)
            {
              console.log("We are here");
              response.innerHTML+="<button style=\"margin:5px\" id=\""+i+"\" class=\"btn btn-info\" onclick=\"posit("+i+")\">"+pos[i]+"</button>";
              response.innerHTML+="<br>"
            }
        }
          },1000);

   }

   	
   	if(e.result.metadata.intentName=="View Positions - yes"){
   		applied_pos.push(selected_pos);
   		console.log(applied_pos);
   		dictionary.Positions=applied_pos;

   	}

   	if (e.result.metadata.intentName=="Current CTC"){
      	retreive_questions();
   		current_ctc=e.result.parameters.number[0];
   		str=current_ctc+" lac";
   		dictionary.CurrentCTC=str;
   		expect_ctc=true;
      console.log('some random shit')
      console.log(expect_ctc)
   	}

   	 if (e.result.metadata.intentName=="View Positions - yes - no"){
      retreive_questions();
   		str="User did not mention";
   		dictionary.CurrentCTC=str;
   		expect_ctc=true;
   	}

   	if (e.result.metadata.intentName=="Current CTC - custom"){
   		expect_ctc=false;
   		expected_ctc=e.result.parameters.number[0];
   		str=expected_ctc+" lac";
   		dictionary.ExpectedCTC=str;
   	}
   	if (e.result.metadata.intentName=="Availibility"){
   		date=e.result.parameters.date[0];
   		dictionary.DateOfAvailability=date;
   	}
   	if (e.result.metadata.intentName=="Availibility - yes"){

   			console.log("here");
   			company=true;
   		
   	}

   	  	if (e.result.metadata.intentName=="Availibility - no"){
   					dictionary.CompanyName="No Job Offered"
   		if(viewed_posits.length==pos.length)
   	  		{
   	 			response.innerHTML="Before we complete your expression of interest, you will have to take a quick test based on the skillset you have mentioned.Please Enter only  the answers to the questions as these answers will be assessed by us."
   	  			      	ques=1;
      					q();
   	  		}

      	}

   	   	  	if (e.result.metadata.intentName=="Apply - no"){
  				if(viewed_posits.length<pos.length)
   	  		{
   	  			send("Apply Again");
   	  		}
   	  		else
   	  		{
   	  			response.innerHTML="Before we complete your expression of interest, you will have to take a quick test based on the skillset you have mentioned.Please Enter only  the answers to the questions as these answers will be assessed by us."
   	  			      	ques=1;
      					q();
   	  		}
 	}

 	 if (e.result.metadata.intentName=="Company - no"){
  				if(viewed_posits.length==pos.length)
   	  		{
   	 			response.innerHTML="Before we complete your expression of interest, you will have to take a quick test based on the skillset you have mentioned.Please Enter only  the answers to the questions as these answers will be assessed by us."
   	  			      	ques=1;
      					q();
   	  		}
 	}

 	 	 if (e.result.metadata.intentName=="Company - no - no"){

   	 			//response.innerHTML="Before we complete your expression of interest, you will have to take a quick test based on the skillset you have mentioned.Please Enter only  the answers to the questions as these answers will be assessed by us."
   	  			      	ques=1;
      					q();
   	  		 	}
   	   	
   	   	  	if (e.result.metadata.intentName=="Apply - yes"){
   				selected_posits.push(selected_pos);
   				retreive_questions();
   				if(viewed_posits.length<pos.length)
   	  		{
   	  			send("Apply Again");
   	  		}
   	  		else{
   	response.innerHTML="Before we complete your expression of interest, you will have to take a quick test based on the skillset you have mentioned.Please Enter only  the answers to the questions as these answers will be assessed by us."
   	  			      	ques=1;
      					q();
   	  		

   	  		}



   	}


   	  	if (e.result.metadata.intentName=="Company - no - yes"){

   	  		for (var i in pos){
			     	flag=0;
			        console.log('position loop '+pos[i])

				 for (var v in viewed_posits){
			     		console.log(viewed_posits[v])
			          if(pos[i]==viewed_posits[v])
			          {
			          		console.log('View '+viewed_posits[v])
						     flag=1
						     break;
			     	 }
			  }
      		if(flag==1){
      				continue
     				 }
      console.log('why is anything printed '+pos[i])
      last_pos=true;
   	response.innerHTML+="<button style=\"margin:1px\" id=\""+i+"\" class=\"btn btn-info\" onclick=\"posit("+i+")\">"+pos[i]+"</button>";
   

   }

   	}



   	if (e.result.metadata.intentName=="Company - ctc"){
   		company_ctc=e.result.parameters.number-integer;
   		str=company_ctc+" lac";
   		dictionary.CompanyCTC=str;
	}
  


    if(e.result.metadata.intentName=="CTC"){
          console.log("Suprisingly worked");
          var flag=0;
          var pos_left=false;
          console.log(selected_pos);
          console.log(pos)
          console.log(viewed_posits);
     for (var i in pos){
     	flag=0;
        console.log('position loop '+pos[i])

     for (var v in viewed_posits){
     		console.log(viewed_posits[v])
          if(pos[i]==viewed_posits[v])
          {
          		console.log('View '+viewed_posits[v])
			     flag=1
			     break;
      }
  }
      if(flag==1){
      	continue
      }
      console.log('why is anything printed '+pos[i])
      pos_left=true;
      response.innerHTML+="<br>"
   response.innerHTML+="<button style=\"margin:1px\" id=\""+i+"\" class=\"btn btn-info\" onclick=\"posit("+i+")\">"+pos[i]+"</button>";
   

   }
  if(!pos_left){
    var str="No More Positions are Available ";
    response.innerHTML="<strong style=\"color:red\">"+str+"</strong>";
    //send("no");
  } 
}


}
}
    


function retreive_questions() {
	console.log(selected_pos);
	console.log(positions);
	var skill=[];
	var quest="";
	str=positions[selected_pos]["skills"];
  	skill=str.split(", ");
  	console.log(skill);
  	for (var i in skill){
  		if (skill[i] in questions){
  			quest=questions[skill[i]];
  			console.log(quest);
         question_to_ask.push(quest);
  		}
  	}
        for (var i in question_to_ask){
        for (var j in question_to_ask[i]){
      all_questions.push(question_to_ask[i][j])
    }
  }


	
}
function yes(){
send_msg_to_app("Yes");
var chatBubble = document.createElement('li');
  chatBubble.classList.add('userInput');
  chatBubble.innerHTML = "Yes";
  chatList.appendChild(chatBubble)
  
}

 function doSetTimeout(revival) {
 	if(revival>=retreive.length-1){
 			get_transfer=true;
 			send(retreive[revival])
	}
else
{
  send_to_revive(retreive[revival])
}
}
function no(){
  send_msg_to_app("No");
  var chatBubble = document.createElement('li');
  chatBubble.classList.add('userInput');
  chatBubble.innerHTML = "No";
  chatList.appendChild(chatBubble)
  revival=0
  // show_human_msg("No");
  console.log("NNNNNNNNNOOOOOOOO");
  app=false;
  console.log("Array")
  var ref = new Firebase('https://jobbot-d8652.firebaseio.com');
  ref=ref.child(id).child("pattern");

      ref.once("value", function(snapshot) {
      pattern=snapshot.val();
      }, function (error) {
       console.log("Error: " + error.code);
       });

  console.log(retreive)
  doSetTimeout(revival)
}
function retrieve_human_msg(){

    var new_msg='';
  var ref = new Firebase('https://jobbot-d8652.firebaseio.com');
  ref=ref.child(id);
  console.log("outside");
  console.log("hello")
  if(ref.child("bot")!=undefined){
  ref=ref.child("bot");
  ref.on("value", function(snapshot) {
       new_msg=snapshot.val();
       new_msg=new_msg[new_msg.length-1];
       console.log("Message is");
       console.log(new_msg);

       if(new_msg=="Do you have any other queries?"){

            var response = document.createElement('li');
            response.classList.add('bot__output');
            chats_bot.push(new_msg);
            response.innerHTML = new_msg;
            response.innerHTML +="<br>"
            y="Yes";
            n="No";
            var s="<button style=\"margin:5px\" onclick=\"yes()\" class=\"btn btn-info\">"+y+"</button>";
            response.innerHTML+=s;
            var b="<button style=\"margin:5px\" onclick=\"no()\" class=\"btn btn-info\">"+n+"</button>";
            response.innerHTML+=b;
            chatList.appendChild(response);
            chatList.scrollTop = chatList.scrollHeight;

       }
        
        else if(new_msg!=''){
            console.log("yesss");
            show_human_msg(new_msg);
            }
      }, function (error) {
       console.log("Error: " + error.code);
       });
}
}
 

    function save_to_firebase(chats)
  {

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
 function upload_to_firebase(id)
 {
    
 	var l=[];
 	for(var k in dictionary) {l.push(k)};
 	dictionary.Parameters=l;

    console.log("Hello");
    var ref = new Firebase('https://jobbot-d8652.firebaseio.com');
    var create_node=ref.child(id);
  

    console.log(pattern);

    var p=create_node.child("pattern").set(pattern);
    var flag=create_node.child("flag").set("false");
    //var previous_chats=create_node.child("previous_chats").set("null");
    var user_chats=create_node.child("user").set(chats_user);

    var bot_chats=create_node.child("bot").set(chats_bot);
    var concise_chat=create_node.child("concise").set(dictionary);
	retrieve_human_msg();
  
}


  
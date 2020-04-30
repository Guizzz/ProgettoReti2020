function trigger(){
  var val;
  var input = document.getElementById("input");
  var todo = parseInt(document.getElementById("todo").innerHTML);
  if(input){
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      if(input.value){
        val = input.value.toUpperCase();
        input.value = "";
        document.getElementById("lista").innerHTML += "<li>"+val+"</li>";
        todo+=1;
        document.getElementById("todo").innerHTML = todo;
        console.log(document.getElementById("lista").length);
        }
      }
    });
  }
}

function viewLabel(){
  $("#label").css("visibility", "visible");
}



function log(){
  console.log("ciao");
}

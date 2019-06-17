document.getElementById("filterClass").onchange = function(){
    let selectEle = document.getElementById("filterClass").value;
    let eleLength = document.getElementsByClassName("penaltyClass2").length;
    for(i=0 ; i<eleLength ; i++){
        document.getElementsByClassName("penaltyClass2")[i].parentElement.classList.remove("not-active")
        let valueEle = document.getElementsByClassName("penaltyClass2")[i].innerText;
        if(valueEle != selectEle){
            document.getElementsByClassName("penaltyClass2")[i].parentElement.classList.add("not-active");
        }
    }

    if(selectEle == "all"){
        for(i=0 ; i<eleLength ; i++){
            document.getElementsByClassName("penaltyClass2")[i].parentElement.classList.remove("not-active")
        }
    }
}



document.getElementById("filterUser").onchange = function(){
    let selectEle = document.getElementById("filterUser").value;
    let eleLength = document.getElementsByClassName("penaltyUser").length;
    for(i=0 ; i<eleLength ; i++){
        document.getElementsByClassName("penaltyUser")[i].parentElement.classList.remove("not-active")
        let valueEle = document.getElementsByClassName("penaltyUser")[i].innerText;
        if(valueEle != selectEle){
            document.getElementsByClassName("penaltyUser")[i].parentElement.classList.add("not-active");
        }
    }

    if(selectEle == "all"){
        for(i=0 ; i<eleLength ; i++){
            document.getElementsByClassName("penaltyUser")[i].parentElement.classList.remove("not-active")
        }
    }
}


//delete
ajax = new XMLHttpRequest();
table.onclick = function(event){
    if(event.target.name=="penaltyDeleted"){
        row = event.target.parentElement.parentElement;
        ajax.open("DELETE","http://localhost:8888/penalty/delete/"+ event.target.getAttribute('value'));
        ajax.send();
        ajax.onreadystatechange = ()=>{
            if(ajax.readyState === 4 && ajax.status === 200){
                response = JSON.parse(ajax.responseText);
                console.log(response);
                if(response.success){
                    row.remove();
                }
            }
        }
        
    }else if(event.target.name=="penaltyApproved"){
        row = event.target.parentElement.parentElement;
        ajax.open("GET","http://localhost:8888/penalty/update/"+ event.target.getAttribute('value'));
        ajax.send();
        ajax.onreadystatechange = ()=>{
            if(ajax.readyState === 4 && ajax.status === 200){
                response = JSON.parse(ajax.responseText);
                console.log(response);
                if(response.success){
                    row.remove();
                }else{
                    // flash.innerHTML= "<p class='alert alert-danger'>"+ data.msg + "</p>";
                }
            }
        }
    }
}
      
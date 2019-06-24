






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
            
        }else if(event.target.name=="penaltyApproved"){
            row = event.target.parentElement.parentElement;
            ajax.open("GET","http://localhost:8888/penalty/update/"+ event.target.getAttribute('value'));
            ajax.send();
            ajax.onreadystatechange = ()=>{
                if(ajax.readyState === 4 && ajax.status === 200){
                    response = JSON.parse(ajax.responseText);
                    console.log(response);
                    if(response.success){
                        row.style.backgrounColor = '#000';
                        setTimeout(()=> row.remove(),1000);
                    }else{
                        // flash.innerHTML= "<p class='alert alert-danger'>"+ data.msg + "</p>";
                    }
                }
            }
        }
    }
          
})
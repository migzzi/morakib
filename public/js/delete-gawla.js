let flash = document.getElementById('flash');
// let table = document.getElementsByTagName("table")[0],
ajax = new XMLHttpRequest();

table.onclick = function(event){
if(event.target.tagName=="BUTTON"){
    row = event.target.parentElement.parentElement;
    ajax.open("DELETE","http://localhost:8888/gawla/delete/"+ event.target.id);
    ajax.send();
    ajax.onreadystatechange = ()=>{
        if(ajax.readyState === 4 && ajax.status === 200){
            response = JSON.parse(ajax.responseText);
            console.log(response);
            if(response.success){
                row.remove();

            }else{
                flash.innerHTML= "<p class='alert alert-danger'>"+ data.msg + "</p>";

            }
            // if(response['msg']== "done")
            // row.remove();
        }
    }
    
}
}


let doneButton = document.getElementById('done');
if(doneButton){
doneButton.onclick = function(event){
        ajax.open("POST","http://localhost:8888/gawla/finish/"+ event.target.getAttribute('value'));
        ajax.send();
        ajax.onreadystatechange = ()=>{
            if(ajax.readyState === 4 && ajax.status === 200){
                response = JSON.parse(ajax.responseText);
                console.log(response);
                if(response.success){
                    window.location.replace(`/gawlat`);
    
                }else{

                    console.log(response.msg);
                }
              
            }
        }
        
    
    }
}  



let submit = document.getElementById('submit');
let inputs = document.getElementsByTagName('input');
let flash = document.getElementById('flash');


submit.onclick = function (e){
    for (let input of inputs){
        if(input.value)
        input.dataset.state = 'valid';
        else{
            input.dataset.state = 'invalid';
        
        }
        flash.innerHTML= "<p class='alert alert-danger'> من فضلك ادخل بيانات صحيححة </p>";

    }
}


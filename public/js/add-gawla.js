let name = document.getElementsByName('name')[0];
let phone = document.getElementsByName('phone')[0];
let class_id = document.getElementsByName('type')[0];
let address = document.getElementsByName('address')[0];
let liscene_num = document.getElementsByName('liscene_num')[0];
let target = document.getElementsByName('target')[0];
let inspector_id = document.getElementsByName('inspector')[0];
let flash = document.getElementById('flash');
let submit = document.getElementById('submit');

let ajax = new XMLHttpRequest();

submit.onclick = function(e){
    if(name.value && phone.value){
    ajax.open("POST","http://localhost:8888/gawla/add");
    ajax.setRequestHeader('content-type','application/json');
    console.log(address.value)
    let newGawla = {
        name : name.value,
        phone : phone.value,
        class_id : class_id.value,
        address : address.value,
        liscene_num : liscene_num.value,
        target : target.value,
        inspector_id : inspector_id.value,
       
    }
    let req = JSON.stringify(newGawla);
    console.log(req);
    ajax.send(req);
    ajax.onreadystatechange = ()=>{
        if (ajax.readyState === 4 && ajax.status === 200){
            let data = JSON.parse(ajax.responseText);
            if(data.success){
                window.location.replace(`/gawla/${data.id}`);
            }else{
                let inputs = document.getElementsByTagName('input');
                for (let input of inputs){
                    if(input.value)
                    input.dataset.state = 'valid';
                    else
                    input.dataset.state = 'invalid';
                }
                flash.innerHTML= "<p class='alert alert-danger'>"+ data.msg + "</p>";
            }
            console.log(data);
           
          
        }
    }
}

}
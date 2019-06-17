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


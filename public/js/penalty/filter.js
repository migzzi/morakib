if(document.getElementById('filterClass')){
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
}
if(document.getElementById("filterUser")){
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
}
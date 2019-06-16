document.getElementById("penaltyClasses").onchange = function(){
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET","http://localhost:8888/penalty/add-penalty/" + this.value);
    console.log(this.value);
    ajaxRequest.send();
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState === 4 && ajaxRequest.status === 200){
            JSON.parse(ajaxRequest.responseText).penaltyTypes.forEach(element => {
                var node = document.createElement("option");
                var textNode = document.createTextNode(element.name);
                node.appendChild(textNode);
                node.value=element.name;
                document.getElementById("penaltyTypes").appendChild(node);
            })
        }
    }
}



document.getElementById("penaltyTypes").onchange = function(){
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET","/penalty/add-penalty/penaltyType/" + this.value);
    ajaxRequest.send();
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState === 4 && ajaxRequest.status === 200){
            console.log(JSON.parse(ajaxRequest.responseText).penaltyTerms);
            JSON.parse(ajaxRequest.responseText).penaltyTerms.forEach(element => {
                var node = document.createElement("option");
                var textNode = document.createTextNode(element.name);
                node.appendChild(textNode);
                node.value=element.name;
                document.getElementById("penaltyTerms").appendChild(node);
            })
        }
    }
}

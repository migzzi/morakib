    function submitForm(method, url, form, options = {}){
        /**
         * This function send ajax request to submit form data.
         * give the function the form id that it's supposed to sumit its
         * data and the method and the action url.
         * it also optionally takse options object for further configs.
        */
        form.on("submit", function(e){
            e.preventDefault();
            let fd = new FormData(this);
            // $(this).serializeArray().forEach(e => {
            //     fd.append(e.name, e.value);
            // });
            $.ajax({
                url: url,
                type: method,
                contentType: false,
                processData: false,
                dataType: options.dataType || "json",
                data: fd,
                success: options.success,
                error: options.error
            })
        })
    }

    function readImgURL(input, resImgID){
        input.on("change", function(e){
            let fr = new FileReader();
            fr.onload = function(e){
                resImgID.attr("src", e.target.result);
            };
    
            fr.readAsDataURL(input[0].files[0]);
        });
    }


    function getManagers(roleSelector, managers){
        let role = $(this).children("option:selected").data("value");
        if(role !== "admin"){
            console.log(managers);
            if(managers.length == 0){
                $.ajax({
                    method: "GET",
                    url: "/managers",
                    dataType: "json",
                    success: function(data){
                        //if server sent data. and succeeded to get users.
                        if(data.success){
                            managers = data.users;
                            //If there's no managers in the system.
                            if(managers.length == 0){
                                roleSelector.after("<p class='text-danger'>عفواً, لا يوجد مديرين فى النظام! رجاءاً اضف على الأقل مدير لتتمكن من اضافة مراقب</p>");
                                $("#form_submit").prop("disabled", true);
                                return;
                            }
                            let managerSelector = $("<select class='form-control mb-4' id='manager_selector' name='manager'></select>");
                            managers.forEach((m) => {
                                let manager = $(`<option value='${m.id}'>${m.username}</option>`);
                                managerSelector.append(manager);
                            });
                            let label = $("<label id='manager_label'>مديره</label>");
                            roleSelector.after(label);
                            label.after(managerSelector);
                        } else { //if server sent data. but no users sent.
                            let resFlash = $("#result_flash");
                            resFlash.append("<div class='alert alert-danger' role='alert'>Couldn't perform your action, Please try again.</div>");
                        }
                    },
                    error: (err) => {
                        console.log(err);
                        let resFlash = $("#result_flash");
                        resFlash.append("<div class='alert alert-danger' role='alert'>Couldn't perform your action, Please try again.</div>");
                    }
                });
            }
            //TODO: BUG
        } else {
            $("#manager_label").remove();
            $("#manager_selector").remove();
        }
        //make the selector required for any role other than the manager.
        if(role !== "manager")
            $("#manager_selector").prop("required", true); 
            
    }
    function initForm(){
            let managers = [];
            let roleSelector = $("#role_selector");
            let role = roleSelector.children("option:selected").data("value");
            
            if(role && role !== "admin")
                getManagers.call(roleSelector, roleSelector, managers);
            roleSelector.on("change", function(e){
                getManagers.call(roleSelector, roleSelector, managers);
            });       
        }

    function getEmployees(role = null, options){
        $.ajax({
            url: (options.prefix || "/admin/") + (role ? role : "employee"),
            method: "GET",
            dataType: "json",
            success: options.success,
            error: options.error
        })
    }

    function deleteRow(table, url){
            table.on("click", "button", function(e){
                let tr = $(this).parent().parent();
                $.ajax({
                    url: url + $(this).attr("id"),
                    method: "DELETE",
                    dataType: "json",
                    success: (data) => {
                        if(data.success){
                            tr.remove();
                        } else console.log("error");
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
            });
        }

        function deleteCookie(name){
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }

        function logOut(){
            deleteCookie("auth_token");
        }
        


const { User, Role } = require("./models"),
bcrypt = require("bcrypt"),
config = require("../../../config/config.json")[process.env.APP_ENV || "development"];

const saltRoundsCount = process.env.APP_SALT_ROUNDS_COUNT || config.salt_rounds_count;

function createSuperUser(obj){
    let username = obj.username;
    return bcrypt.hash(obj.password, saltRoundsCount)
    .then(hashedPassword => {
        return User.create(Object.assign(obj, {password: hashedPassword}));
    })
     
}



function createSuperUserTask(){
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      })
    readline.question(`Choose your username? `, (username) => {
        if(username.length <= 1) {
        console.log("Not valid username"); 
        readline.close()
        return;
    }
        readline.question('What is your first name? ', (first_name) => {
            readline.question("What is your last name? ", (last_name) => {
                readline.question("What is your email? ", (email) => {
                    readline.question("Choose your password? ", (password) => {
                        readline.question("Conform your password? ", (passwordConfirm) => {
                            if(password !== passwordConfirm){
                                console.log("not matched passwords");
                                readline.close()
                                return ;
                            }
                            createSuperUser({
                                username,
                                first_name,
                                last_name,
                                email,
                                password
                            }).then((user) => {
                                if(!user){
                                    console.log("can't create user");
                                    readline.close()
                                    return ;
                                }
                                console.log("created successfully");
                                readline.close();
                                process.exit(0);

                                return ;
                            })
                            .catch((err)=>{
                                console.log("Can't create user", err);
                                readline.close();
                                process.exit();
                                return ;
                            });
                        })
                    })
                })
            })
        })
    })
}

createSuperUserTask();
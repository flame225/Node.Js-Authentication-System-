const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

function initialize(passport, getUserByEmail, getUserById){
    //function to authenticate user
    const authenticateUseer = async (email, password, done)=>{
        //get user by email
        const user = getUserByEmail(email)
        if (user == null){
            return done(null, false,{message: "no user found with that wmail"})
        }
        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done (null, false, {message: "not coreect password"})
            }

        } catch (e) {
            console.log(e)
            return done(e)
            
        }

    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUseer))
    passport.serializeUser((user, done)=>done(null, user.id))
    passport.deserializeUser((id, done)=>{
        return done (null, getUserById(id))
    })
}

module.exports = initialize
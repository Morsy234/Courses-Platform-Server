//async wrapper to handle errors in async functions
//function takes an async function and returns a new function that wraps the original function in a try-catch block and passes any errors to the next middleware

// takes all errors from async and pass it to the middleware 
module.exports= (asyncfn) => {
    return (req, res, next) => {
        asyncfn(req, res, next).catch((err)=>
        {next(err);
        });
    }
};
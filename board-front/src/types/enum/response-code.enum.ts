enum ResponseCode {
        // 200 
        SUCCESS = "SU",

        // 400
        VALIDATION_FAILED = "VF",
    
        // 401
        SIGN_IN_FAILED = "SF",
        AUTHORIZATION_FAILED = "AF",
    
        // 403
        NO_PERMISSION = "NP",
    
        // 500
        DATABASE_ERROR = "DBE",
}

export default ResponseCode;
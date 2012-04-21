module.exports = {
  dwolla: {
      id          : String
    , accessToken : String
    , expires     : Date
    , city        : String
    , latitude    : Number
    , longitude   : Number
    , name        : String
    , state       : String
    , type        : {type:String,"enum":[null,'Personal','Commercial','Nonprofit']}
  }
};

import * as helper from "../helpers/validation.js"
import {users} from "../config/mongoCollections.js"
import bcrypt from "bcrypt";
import * as EmailValidator from 'email-validator';
const saltRounds = 10;

/*
Refernce Schema:
users:{
    _id: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”, 
    firstName: “Jennifer”,
    lastName: “Antison”,
    sex: “female”,
    age: 30,
    contactEmail: “jen@gmail.com”,
    password: "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
    following: [“7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,  
		    “7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710”],
    followers: [“7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,  
			“7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710”],
    tags: [veg, bearded, liquor],
    location: {
        firstLine: “538 New York Ave”,
        secondLine: “Apt 1”,
        country: “US”,
        city: “Jersey City”,
        state: “New Jersey”,
        zip: “07307”,
    },
    reviews: [7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310,  
		  7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710],
    comments: [7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310, 
               7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310],
    createdAt: 2022-02-26T16:37:48.244Z,
    updatedAt: 2022-02-26T16:37:48.244Z,
}
*/

export const createUser =async(
    firstName,
    lastName,
    sex,
    age,
    contactEmail,
    password,
    location
)=>{
    /*this is a basic template I have use from hw just to get it started* /
    firstName=helper.checkString(firstName,1,50)
    lastName=helper.checkString(lastName,1,50)
    sex=helper.checkString(sex)
    */

    // Create a new user and return its Id
    
    const userCollection= await users();
    
    firstName=helper.checkString(firstName,"firstName",1,25)
    lastName=helper.checkString(lastName,"lastName",1,25)
    sex=helper.checkSex(sex)
    contactEmail=await helper.checkIfEmailPresent(contactEmail)
    age=helper.checkAge(age,12,105)
    password=helper.checkPass(password)
    let followers=[]
    let following=[]
    let tags=[]
    location=helper.checkAddress(location)

    const hash = await bcrypt.hash(password, saltRounds);

    
    let dataPacket={
        firstName,
        sex,
        contactEmail,
        password:hash,
        following,
        followers,
        tags,
        location
    }

    const inserted = await userCollection.insertOne(dataPacket);
    if (inserted.insertedId){
    return {insertedUser:true}
    }else{
    throw "Could not insert user"
    }
}

export const loginUser = async (contactEmail, password) => {
    contactEmail=await helper.checkValidEmail(contactEmail)
    password=helper.checkPass(password)
  
    const userCollection= await users();
    const found= await userCollection.findOne({contactEmail:contactEmail})
    if (found==null){
      throw "Either the email address or password is invalid"
    }
    let compareToPassword=false
    try {
      compareToPassword = await bcrypt.compare(password, found.password);
    } catch (e) {
      //no op
    }
    if (compareToPassword){
      return {firstName:found.firstName,lastName:found.lastName,contactEmail:found.contactEmail}
    }else{
      throw "Either the email address or password is invalid"
    }
  };

export const getUser = async(userId)=>{

}

export const updateUser =async(
    userId,
    firstName,
    lastName,
    sex,
    age,
    contactEmail,
    password,
    location
)=>{
    /*
    create empty array like
    following,
    followers,
    tags,
    reviews
    comments
    put a "created" timesteamp
    */
      
}

export const updateLastTimeStamp= async(userId)=>{
    /*
    Call this in every function to update the date
     */
}

export const deleteUser= async(userId)=>{
}

export const getFollowing=async(userId)=>{
}

export const getFollowers=async(userId)=>{
}

export const getTags=async(userId)=>{
}

export const addFollowing=async(userId,followingId)=>{
}

export const addFollower=async(userId,followerId)=>{
}

export const addTags=async(userId,tags)=>{
}

export const addReview=async(userId,reviewId)=>{
}

export const deleteReview=async(userId,reviewId)=>{
}

export const addComment=async(userId,commentId)=>{
}

export const deleteComment=async(userId,commentId)=>{
}

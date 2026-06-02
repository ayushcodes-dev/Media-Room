
import {getAuthstatus} from "@/api/auth.js"
/**
 * desc : it gets auth status of user from server and store data in localhost
 */

async function syncUserAuth(){
   let olduserdata = null;
  const raw_userdata = localStorage.getItem("user_auth");
  if (raw_userdata) {
  try {
    olduserdata = JSON.parse(raw_userdata);
  } catch {
   olduserdata = null;
  }
}
   const data= await getAuthstatus()
  
 // console.log("data",data)
   
   if(data.success){
    if (!data.data.isAuthenticated) data.data.isAuthenticated = false;
       localStorage.setItem(
         "user_auth",
         JSON.stringify({ ...(olduserdata ? olduserdata : {}), ...data.data }),
       );
   }else{
    data.error.data.isAuthenticated = false;
     localStorage.setItem("user_auth",JSON.stringify({...(olduserdata?olduserdata:{}), ...data.error.data}));
   }
}
export default syncUserAuth;
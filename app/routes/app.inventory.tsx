import {Page,Card ,Layout,List } from "@shopify/polaris";
import {LoaderFunction,json} from "@remix-run/node"
import { apiVersion,authenticate } from "~/shopify.server";
import { useActionData, useLoaderData } from "@remix-run/react";

export const loader : LoaderFunction=async({request})=>{
    console.log("inside inventory")
    const {session,admin} =await authenticate.admin(request);
    console.log("session",session)
    console.log("admin.......",admin)
    const {shop,accessToken}=session;
    console.log("accessToken}................",shop,accessToken)
    
    try {
        const response=  await admin.rest.resources.InventoryLevel.all({
              session:session,
              location_ids:'68796678196'
          })
        
        if(response){
             console.log("hit")
            const data1= response.data;
            console.log("data",data1)
            return json({
                inventory:data1
            })
        }
       
      return null;
     } catch (error) {
        
        console.log(error)
        return null;
     }
    
}

const Inventory = () => {
    const data:any=useActionData()
    console.log("data inventory...",data)
  return (
    <div>app.inventory</div>
  )
}

export default Inventory
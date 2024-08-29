import {Page,Card ,Button} from "@shopify/polaris";
import type {ActionFunction} from "@remix-run/node"
import  {json} from "@remix-run/node"
import {authenticate } from "~/shopify.server";
import {Form , useActionData,  useSubmit } from "@remix-run/react";


 
export const action : ActionFunction=async({request})=>{
    console.log("inside discount")
    const {admin} =await authenticate.admin(request);

    console.log("admin.......",admin)
  
    
    try {
        const response = await admin.graphql(
          `#graphql
          mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
            discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
              codeDiscountNode {
                codeDiscount {
                  ... on DiscountCodeBasic {
                    title
                    codes(first: 10) {
                      nodes {
                        code
                      }
                    }
                    startsAt
                    endsAt
                    customerSelection {
                      ... on DiscountCustomerAll {
                        allCustomers
                      }
                    }
                    customerGets {
                      value {
                        ... on DiscountPercentage {
                          percentage
                        }
                      }
                      items {
                        ... on AllDiscountItems {
                          allItems
                        }
                      }
                    }
                    appliesOncePerCustomer
                  }
                }
              }
              userErrors {
                field
                code
                message
              }
            }
          }`,
          {
            variables: {
              "basicCodeDiscount": {
                "title": "20% off all items during the summer of 2022",
                "code": "SUMMER20",
                "startsAt": "2022-06-21T00:00:00Z",
                "endsAt": "2022-09-21T00:00:00Z",
                "customerSelection": {
                  "all": true
                },
                "customerGets": {
                  "value": {
                    "percentage": 0.2
                  },
                  "items": {
                    "all": true
                  }
                },
                "appliesOncePerCustomer": true
              }
            },
          },
        );
        
        console.log("resp..............",response)
  
     if(response.ok){
             console.log("hit")
            const data1= await request.json();
            console.log("data",data1)
            return json({
                discount:data1
            })
        }
       
      return null;
     } catch (error) {
        
        console.log(error)
        return null;
     }
    
}


const Discount = () => {
    const submit=useSubmit();
    const actionData=useActionData<typeof action>();
    console.log(actionData,"actionData,.....")
   const generateDiscount =()=>{
    console.log("generate dis.................................................")
    submit({},{replace:true,method:'POST'})
   }
  return (
    <Page>
<Card>
  <Form onSubmit={generateDiscount} method='post'>
  <Button submit>
Create Discount
    </Button>
  </Form>
</Card>
    </Page>
    
  )
}

export default Discount
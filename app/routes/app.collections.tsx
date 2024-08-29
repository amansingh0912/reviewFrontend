import {Page,Card ,Layout,List } from "@shopify/polaris";
import type{LoaderFunction} from "@remix-run/node"
import { apiVersion,authenticate } from "~/shopify.server";
import { useLoaderData } from "@remix-run/react";

export const query = `
  {
    collections(first: 5) {
      edges {
        node {
          id
          title
          handle
          description
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;




export const loader : LoaderFunction=async({request})=>{
    console.log("inside collection")
    const {session} =await authenticate.admin(request);
    console.log("session",session)
    const {shop,accessToken}=session;
    
    try {
        const response=await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`,{
            method:"POST",
            headers:{
                "Content-Type":"application/graphql",
                "X-Shopify-Access-Token":accessToken!
            },
            body:query
        })
        
        if(response.ok){
           
            const data1=await response.json();
          
            const {
                data:{
                    collections:{edges}
                }
            }=data1;
            console.log("data2",edges)
            return edges;
           
           
        }
       
      return null;
     } catch (error) {
        
        console.log(error)
        return null;
     }
    
}


const Collections = () => {
    const collections:any=useLoaderData();
    console.log("collections",collections)
  return (
    <Page>
        <Layout>
            <Layout.Section>
            <Card>
            <h1>Collections</h1>
          </Card>
            </Layout.Section>
        <Layout.Section>
            <Card>
                <List type="bullet" gap="loose">
                    {
                          collections.map((edge:any)=>{
                            const {node:collection}=edge;
                            return(
                                <List.Item key={collection.id}>
                                    <h2>
                                        {collection.title}
                                    </h2>
                                    <h2>
                                        {collection.description}
                                    </h2>
                                </List.Item>
                            )
                          })
                    }
                </List>
            </Card>
        </Layout.Section>
        </Layout>
    </Page>
  );
  
};

export default Collections ;
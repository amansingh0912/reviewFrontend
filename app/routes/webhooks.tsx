import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);
console.log("inside action")
  if (!admin && topic !== 'SHOP_REDACT') {
    console.log("inside admin");
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    // The SHOP_REDACT webhook will be fired up to 48 hours after a shop uninstalls the app.
    // Because of this, no admin context is available.
    throw new Response();
  }

  // The topics handled here should be declared in the shopify.app.toml.
  // More info: https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration
  switch (topic) {
    case "APP_UNINSTALLED":
      console.log("inside app uninstalled")
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case 'PRODUCTS_UPDATE':
        console.log('product was updated');
        return new Response("PRODUCTS_UPDATE handled successfully", { status: 200 });
        
    case 'PRODUCTS_DELETE':
       console.log('product was DELETED')   
       return new Response("PRODUCTS_DELETE handled successfully", { status: 200 });
    case "CUSTOMERS_DATA_REQUEST":
      console.log('product CUSTOMERS_DATA_')   
      return new Response("CUSTOMERS_DATA_REQUEST handled successfully", { status: 200 });
    case "CUSTOMERS_REDACT":
      console.log('Customers data redacted');
      return new Response("CUSTOMERS_REDACT handled successfully", { status: 200 });
    case "SHOP_REDACT":
      console.log('Shop data redacted');
      return new Response("SHOP_REDACT handled successfully", { status: 200 });  

    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};

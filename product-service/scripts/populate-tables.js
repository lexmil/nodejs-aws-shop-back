"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({
    region: "eu-central-1", // replace with your region
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
// Test data for products
const productItems = [
    {
        id: "1",
        title: "iPhone 13 Pro",
        description: "Apple iPhone 13 Pro 256GB",
        price: 999.99
    },
    {
        id: "2",
        title: "Samsung Galaxy S21",
        description: "Samsung Galaxy S21 Ultra 5G",
        price: 899.99
    },
    {
        id: "3",
        title: "MacBook Pro",
        description: "MacBook Pro 14-inch M1 Pro",
        price: 1999.99
    },
    {
        id: "4",
        title: "iPad Air",
        description: "iPad Air 4th Generation",
        price: 599.99
    },
    {
        id: "5",
        title: "AirPods Pro",
        description: "Apple AirPods Pro with MagSafe",
        price: 249.99
    }
];
// Test data for stocks
const stockItems = [
    {
        product_id: "1",
        count: 10
    },
    {
        product_id: "2",
        count: 15
    },
    {
        product_id: "3",
        count: 5
    },
    {
        product_id: "4",
        count: 20
    },
    {
        product_id: "5",
        count: 30
    }
];
async function populateTables() {
    try {
        // Populate products table
        const productChunks = chunk(productItems, 25); // DynamoDB limit is 25 items per batch
        for (const chunk of productChunks) {
            const productParams = {
                RequestItems: {
                    "products": chunk.map(item => ({
                        PutRequest: {
                            Item: item
                        }
                    }))
                }
            };
            await docClient.send(new lib_dynamodb_1.BatchWriteCommand(productParams));
        }
        console.log("Products table populated successfully");
        // Populate stocks table
        const stockChunks = chunk(stockItems, 25);
        for (const chunk of stockChunks) {
            const stockParams = {
                RequestItems: {
                    "stocks": chunk.map(item => ({
                        PutRequest: {
                            Item: item
                        }
                    }))
                }
            };
            await docClient.send(new lib_dynamodb_1.BatchWriteCommand(stockParams));
        }
        console.log("Stocks table populated successfully");
    }
    catch (error) {
        console.error("Error populating tables:", error);
    }
}
// Utility function to split arrays into chunks
function chunk(array, size) {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
}
// Run the population script
populateTables();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdWxhdGUtdGFibGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9wdWxhdGUtdGFibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOERBQTBEO0FBQzFELHdEQUcrQjtBQUUvQixNQUFNLE1BQU0sR0FBRyxJQUFJLGdDQUFjLENBQUM7SUFDakMsTUFBTSxFQUFFLGNBQWMsRUFBRSwyQkFBMkI7Q0FDbkQsQ0FBQyxDQUFDO0FBRUgsTUFBTSxTQUFTLEdBQUcscUNBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRXRELHlCQUF5QjtBQUN6QixNQUFNLFlBQVksR0FBRztJQUNwQjtRQUNDLEVBQUUsRUFBRSxHQUFHO1FBQ1AsS0FBSyxFQUFFLGVBQWU7UUFDdEIsV0FBVyxFQUFFLDJCQUEyQjtRQUN4QyxLQUFLLEVBQUUsTUFBTTtLQUNiO0lBQ0Q7UUFDQyxFQUFFLEVBQUUsR0FBRztRQUNQLEtBQUssRUFBRSxvQkFBb0I7UUFDM0IsV0FBVyxFQUFFLDZCQUE2QjtRQUMxQyxLQUFLLEVBQUUsTUFBTTtLQUNiO0lBQ0Q7UUFDQyxFQUFFLEVBQUUsR0FBRztRQUNQLEtBQUssRUFBRSxhQUFhO1FBQ3BCLFdBQVcsRUFBRSw0QkFBNEI7UUFDekMsS0FBSyxFQUFFLE9BQU87S0FDZDtJQUNEO1FBQ0MsRUFBRSxFQUFFLEdBQUc7UUFDUCxLQUFLLEVBQUUsVUFBVTtRQUNqQixXQUFXLEVBQUUseUJBQXlCO1FBQ3RDLEtBQUssRUFBRSxNQUFNO0tBQ2I7SUFDRDtRQUNDLEVBQUUsRUFBRSxHQUFHO1FBQ1AsS0FBSyxFQUFFLGFBQWE7UUFDcEIsV0FBVyxFQUFFLGdDQUFnQztRQUM3QyxLQUFLLEVBQUUsTUFBTTtLQUNiO0NBQ0QsQ0FBQztBQUVGLHVCQUF1QjtBQUN2QixNQUFNLFVBQVUsR0FBRztJQUNsQjtRQUNDLFVBQVUsRUFBRSxHQUFHO1FBQ2YsS0FBSyxFQUFFLEVBQUU7S0FDVDtJQUNEO1FBQ0MsVUFBVSxFQUFFLEdBQUc7UUFDZixLQUFLLEVBQUUsRUFBRTtLQUNUO0lBQ0Q7UUFDQyxVQUFVLEVBQUUsR0FBRztRQUNmLEtBQUssRUFBRSxDQUFDO0tBQ1I7SUFDRDtRQUNDLFVBQVUsRUFBRSxHQUFHO1FBQ2YsS0FBSyxFQUFFLEVBQUU7S0FDVDtJQUNEO1FBQ0MsVUFBVSxFQUFFLEdBQUc7UUFDZixLQUFLLEVBQUUsRUFBRTtLQUNUO0NBQ0QsQ0FBQztBQUVGLEtBQUssVUFBVSxjQUFjO0lBQzVCLElBQUksQ0FBQztRQUNKLDBCQUEwQjtRQUMxQixNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsdUNBQXVDO1FBQ3RGLEtBQUssTUFBTSxLQUFLLElBQUksYUFBYSxFQUFFLENBQUM7WUFDbkMsTUFBTSxhQUFhLEdBQUc7Z0JBQ3JCLFlBQVksRUFBRTtvQkFDYixVQUFVLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzlCLFVBQVUsRUFBRTs0QkFDWCxJQUFJLEVBQUUsSUFBSTt5QkFDVjtxQkFDRCxDQUFDLENBQUM7aUJBQ0g7YUFDRCxDQUFDO1lBQ0YsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksZ0NBQWlCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBRXJELHdCQUF3QjtRQUN4QixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLEtBQUssTUFBTSxLQUFLLElBQUksV0FBVyxFQUFFLENBQUM7WUFDakMsTUFBTSxXQUFXLEdBQUc7Z0JBQ25CLFlBQVksRUFBRTtvQkFDYixRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzVCLFVBQVUsRUFBRTs0QkFDWCxJQUFJLEVBQUUsSUFBSTt5QkFDVjtxQkFDRCxDQUFDLENBQUM7aUJBQ0g7YUFDRCxDQUFDO1lBQ0YsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksZ0NBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0lBRXBELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEQsQ0FBQztBQUNGLENBQUM7QUFFRCwrQ0FBK0M7QUFDL0MsU0FBUyxLQUFLLENBQUksS0FBVSxFQUFFLElBQVk7SUFDekMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQ3RFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUN0QyxDQUFDO0FBQ0gsQ0FBQztBQUVELDRCQUE0QjtBQUM1QixjQUFjLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER5bmFtb0RCQ2xpZW50IH0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1keW5hbW9kYlwiO1xuaW1wb3J0IHtcblx0RHluYW1vREJEb2N1bWVudENsaWVudCxcblx0QmF0Y2hXcml0ZUNvbW1hbmQsXG59IGZyb20gXCJAYXdzLXNkay9saWItZHluYW1vZGJcIjtcblxuY29uc3QgY2xpZW50ID0gbmV3IER5bmFtb0RCQ2xpZW50KHtcblx0cmVnaW9uOiBcImV1LWNlbnRyYWwtMVwiLCAvLyByZXBsYWNlIHdpdGggeW91ciByZWdpb25cbn0pO1xuXG5jb25zdCBkb2NDbGllbnQgPSBEeW5hbW9EQkRvY3VtZW50Q2xpZW50LmZyb20oY2xpZW50KTtcblxuLy8gVGVzdCBkYXRhIGZvciBwcm9kdWN0c1xuY29uc3QgcHJvZHVjdEl0ZW1zID0gW1xuXHR7XG5cdFx0aWQ6IFwiMVwiLFxuXHRcdHRpdGxlOiBcImlQaG9uZSAxMyBQcm9cIixcblx0XHRkZXNjcmlwdGlvbjogXCJBcHBsZSBpUGhvbmUgMTMgUHJvIDI1NkdCXCIsXG5cdFx0cHJpY2U6IDk5OS45OVxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwiMlwiLFxuXHRcdHRpdGxlOiBcIlNhbXN1bmcgR2FsYXh5IFMyMVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlNhbXN1bmcgR2FsYXh5IFMyMSBVbHRyYSA1R1wiLFxuXHRcdHByaWNlOiA4OTkuOTlcblx0fSxcblx0e1xuXHRcdGlkOiBcIjNcIixcblx0XHR0aXRsZTogXCJNYWNCb29rIFByb1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIk1hY0Jvb2sgUHJvIDE0LWluY2ggTTEgUHJvXCIsXG5cdFx0cHJpY2U6IDE5OTkuOTlcblx0fSxcblx0e1xuXHRcdGlkOiBcIjRcIixcblx0XHR0aXRsZTogXCJpUGFkIEFpclwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcImlQYWQgQWlyIDR0aCBHZW5lcmF0aW9uXCIsXG5cdFx0cHJpY2U6IDU5OS45OVxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwiNVwiLFxuXHRcdHRpdGxlOiBcIkFpclBvZHMgUHJvXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiQXBwbGUgQWlyUG9kcyBQcm8gd2l0aCBNYWdTYWZlXCIsXG5cdFx0cHJpY2U6IDI0OS45OVxuXHR9XG5dO1xuXG4vLyBUZXN0IGRhdGEgZm9yIHN0b2Nrc1xuY29uc3Qgc3RvY2tJdGVtcyA9IFtcblx0e1xuXHRcdHByb2R1Y3RfaWQ6IFwiMVwiLFxuXHRcdGNvdW50OiAxMFxuXHR9LFxuXHR7XG5cdFx0cHJvZHVjdF9pZDogXCIyXCIsXG5cdFx0Y291bnQ6IDE1XG5cdH0sXG5cdHtcblx0XHRwcm9kdWN0X2lkOiBcIjNcIixcblx0XHRjb3VudDogNVxuXHR9LFxuXHR7XG5cdFx0cHJvZHVjdF9pZDogXCI0XCIsXG5cdFx0Y291bnQ6IDIwXG5cdH0sXG5cdHtcblx0XHRwcm9kdWN0X2lkOiBcIjVcIixcblx0XHRjb3VudDogMzBcblx0fVxuXTtcblxuYXN5bmMgZnVuY3Rpb24gcG9wdWxhdGVUYWJsZXMoKSB7XG5cdHRyeSB7XG5cdFx0Ly8gUG9wdWxhdGUgcHJvZHVjdHMgdGFibGVcblx0XHRjb25zdCBwcm9kdWN0Q2h1bmtzID0gY2h1bmsocHJvZHVjdEl0ZW1zLCAyNSk7IC8vIER5bmFtb0RCIGxpbWl0IGlzIDI1IGl0ZW1zIHBlciBiYXRjaFxuXHRcdGZvciAoY29uc3QgY2h1bmsgb2YgcHJvZHVjdENodW5rcykge1xuXHRcdFx0Y29uc3QgcHJvZHVjdFBhcmFtcyA9IHtcblx0XHRcdFx0UmVxdWVzdEl0ZW1zOiB7XG5cdFx0XHRcdFx0XCJwcm9kdWN0c1wiOiBjaHVuay5tYXAoaXRlbSA9PiAoe1xuXHRcdFx0XHRcdFx0UHV0UmVxdWVzdDoge1xuXHRcdFx0XHRcdFx0XHRJdGVtOiBpdGVtXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkpXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRhd2FpdCBkb2NDbGllbnQuc2VuZChuZXcgQmF0Y2hXcml0ZUNvbW1hbmQocHJvZHVjdFBhcmFtcykpO1xuXHRcdH1cblx0XHRjb25zb2xlLmxvZyhcIlByb2R1Y3RzIHRhYmxlIHBvcHVsYXRlZCBzdWNjZXNzZnVsbHlcIik7XG5cblx0XHQvLyBQb3B1bGF0ZSBzdG9ja3MgdGFibGVcblx0XHRjb25zdCBzdG9ja0NodW5rcyA9IGNodW5rKHN0b2NrSXRlbXMsIDI1KTtcblx0XHRmb3IgKGNvbnN0IGNodW5rIG9mIHN0b2NrQ2h1bmtzKSB7XG5cdFx0XHRjb25zdCBzdG9ja1BhcmFtcyA9IHtcblx0XHRcdFx0UmVxdWVzdEl0ZW1zOiB7XG5cdFx0XHRcdFx0XCJzdG9ja3NcIjogY2h1bmsubWFwKGl0ZW0gPT4gKHtcblx0XHRcdFx0XHRcdFB1dFJlcXVlc3Q6IHtcblx0XHRcdFx0XHRcdFx0SXRlbTogaXRlbVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0YXdhaXQgZG9jQ2xpZW50LnNlbmQobmV3IEJhdGNoV3JpdGVDb21tYW5kKHN0b2NrUGFyYW1zKSk7XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKFwiU3RvY2tzIHRhYmxlIHBvcHVsYXRlZCBzdWNjZXNzZnVsbHlcIik7XG5cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgcG9wdWxhdGluZyB0YWJsZXM6XCIsIGVycm9yKTtcblx0fVxufVxuXG4vLyBVdGlsaXR5IGZ1bmN0aW9uIHRvIHNwbGl0IGFycmF5cyBpbnRvIGNodW5rc1xuZnVuY3Rpb24gY2h1bms8VD4oYXJyYXk6IFRbXSwgc2l6ZTogbnVtYmVyKTogVFtdW10ge1xuXHRyZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogTWF0aC5jZWlsKGFycmF5Lmxlbmd0aCAvIHNpemUpIH0sIChfLCBpKSA9PlxuXHRcdGFycmF5LnNsaWNlKGkgKiBzaXplLCBpICogc2l6ZSArIHNpemUpXG5cdCk7XG59XG5cbi8vIFJ1biB0aGUgcG9wdWxhdGlvbiBzY3JpcHRcbnBvcHVsYXRlVGFibGVzKCk7XG4iXX0=
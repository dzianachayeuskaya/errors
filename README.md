# errors

This page displays the product catalog. In cases where an error occurred while loading goods, invalid JSON was returned, or the server returned an unsuccessful response status, an alert is displayed to the user.

After starting the local server (npm start), the data required to display the list of products is requested. The server returns different response status and data with a random probability. This is done to simulate unstable server operation.

## Details

If the server returned invalid JSON, an information block with the text “An error occurred, try refreshing the page later” is displayed.
If a network error occurs, an information block with the text “An error has occurred, check your Internet connection” is displayed.
If the server returns an empty product list and a 404 response status instead of a product list, a header with the text “Product List is Empty” is displayed.
If the server returns a 500 response status, the request is repeated twice. If the status has not changed after repeated requests, a message is displayed to the user: “An error has occurred, please try refreshing the page later.”

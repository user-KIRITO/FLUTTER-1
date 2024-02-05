# API Documentation

### 1. Add new product

Route:

```
    /api/products/addProduct
```

Method: POST   
Type: urlencoded  

Fields
| value | type | required |
| -------- | -------- | -------- |
| productName | string | 
qty| number |
price| float |
category| string |
description| string |
urlKey| string |
metaTitle| string |
metaKeyWords| [string] |
metaDescription| string |
status| boolean |
visibility| boolean |
stockAvailable| boolean |

### 2.List All Products

Route:
```   
    api/products/viewAllProducts
```

Method: GET

Response: Array with all the products in the database

### 3.Search Product

Route:
```
    api/products/searchProduct
```

Method: POST,

Fields:
 value | type | 
| -------- | -------- |
| productName | string |
Note: If the response is an empty array, it means the product searched for is not found.

### 3.Add/Update Images Of Product

This same route can be used to add or update the images of the products which are currently present in the db.

Route:
```
    api/products/uploadImages?id=_id
```
Note: File uploads require the use of the FormData API, which is a JavaScript API for creating and sending form data.

We create a new FormData object from the form and use the fetch API to send a POST request to the /api/products/uploadImage endpoint with the FormData object as the request body.

The images should be an array of 3 files from frontend.


Method: POST,

Fields: _id from the database as query parameter


Example Request:
```
<form class="images">
          <input type="file" name="image">
          <input type="file" name="image">
          <input type="file" name="image">
          <button type="submit">Submit</button>
        </form>
        
        <script>
          const form = document.querySelector('.images');
          form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData();
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach((fileInput) => {
              formData.append(fileInput.name, fileInput.files[0]);
            });
            fetch(`/api/products/uploadImages?id=${_id}`, {
              method: 'POST',
              body: formData
            })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              console.log(data);
            })
            .catch((error) => {
              console.error(error);
            });
          });
        </script>
```

Here

```
    /api/products/uploadImages?id=${_id}
```
_id is obtained from the searchProduct 
Endpoint Response.

_id is used to remove any sort of document duplication errors as it is unique throughout the db.

### 4.Update Product Attributes
This route can be used to update all the attributes of a product **except Images**.
(Images can be updated with addImage(section.3) Endpoint)

Route:
```
    /api/products/updateProduct
```

Method: POST,

Fields

query_params : _id from the database as query parameter

form_values : Only Include the fields in which you want to update or change the value. Other
fields should not be included in the request.





Here

```
    /api/products/updateProduct?id=${_id}
```
_id is obtained from the searchProduct 
Endpoint Response.

| value | type |
| -------- | -------- | 
| productName | string | 
qty| number |
price| float |
category| string |
description| string |
urlKey| string |
metaTitle| string |
metaKeyWords| [string] |
metaDescription| string |
status| boolean |
visibility| boolean |
stockAvailable| boolean |


Example Usage 1:
```
    

    const formData = new FormData();
    formData.append('qty', '17');
    formData.append('category', 'laptop');

    fetch('/api/products/updateProduct?id=6536b58c423addb9cbeec0a7', {
      method: 'POST',
      body: formData
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
```
This request will update the **qty** and **category** of product with *_id = 6536b58c423addb9cbeec0a7* to *qty = 17* and *category = 17*


### 5. Delete Product

This route can be used to delete a particular product from database by a given _id

Route:
```
    /api/products/deleteProduct
```


Method: POST,

Fields

query_params : _id from the database as query parameter

Full Definition:
```
    /api/products/deleteProduct?id=${_id}
```


Example Usage:
```
    fetch('/api/products/deleteProduct?id=6536b58c423addb9cbeec0a7', {
      method: 'POST'
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
    
```

Here:

The product with *_id = 6536b58c423addb9cbeec0a7* is deleted from the database.
